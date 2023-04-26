// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Error;

use deno_ast::ImportsNotUsedAsValues;

use deno_core::v8;
use deno_core::FastString;

use deno_core::JsRuntime;

use deno_core::RuntimeOptions;
use substring::Substring;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[derive(serde::Serialize)]
struct Statement {
    start: usize,
    output: String,
}

#[tauri::command]
fn evaluate(javascript: &str) -> Result<Vec<Statement>, String> {
    let mut runtime = JsRuntime::new(RuntimeOptions::default());
    let transpiled_src = transpile(javascript);
    match transpiled_src {
        Ok(transpiled_src) => {
            let text_info = deno_ast::SourceTextInfo::new(transpiled_src.clone().into());
            let parsed_source = deno_ast::parse_module(deno_ast::ParseParams {
                specifier: "file:///my_file.ts".to_string(),
                media_type: deno_ast::MediaType::JavaScript,
                text_info,
                capture_tokens: true,
                maybe_syntax: None,
                scope_analysis: false,
            })
            .expect("should parse");
            let mut statements: Vec<Statement> = vec![];

            parsed_source
                .module()
                .body
                .iter()
                .enumerate()
                .for_each(|(i, node)| {
                    if i < 2 {
                        return;
                    }
                    match node {
                        swc_ecma_ast::ModuleItem::Stmt(stmt) => match stmt {
                            swc_ecma_ast::Stmt::Expr(expr) => {
                                let result = eval(
                                    &mut runtime,
                                    transpiled_src
                                        .substring(
                                            expr.span.lo.0 as usize - 1,
                                            expr.span.hi.0 as usize - 1,
                                        )
                                        .to_owned()
                                        .into(),
                                );
                                match result {
                                    Ok(value) => {
                                        statements.push(Statement {
                                            start: transpiled_src
                                                .substring(22, expr.span.hi.0 as usize - 1)
                                                .lines()
                                                .count()
                                                - 1,
                                            output: unescape::unescape(value.to_string().as_str())
                                                .unwrap(),
                                        });
                                    }
                                    Err(err) => {}
                                }
                            }
                            swc_ecma_ast::Stmt::If(expr) => {
                                let result = eval(
                                    &mut runtime,
                                    transpiled_src
                                        .substring(
                                            expr.span.lo.0 as usize - 1,
                                            expr.span.hi.0 as usize - 1,
                                        )
                                        .to_owned()
                                        .into(),
                                );
                                match result {
                                    Ok(value) => {
                                        statements.push(Statement {
                                            start: transpiled_src
                                                .substring(22, expr.span.hi.0 as usize - 1)
                                                .lines()
                                                .count()
                                                - 1,
                                            output: value.to_string(),
                                        });
                                    }
                                    Err(err) => {}
                                }
                            }
                            swc_ecma_ast::Stmt::Block(_) => todo!(),
                            swc_ecma_ast::Stmt::Empty(_) => todo!(),
                            swc_ecma_ast::Stmt::Debugger(_) => todo!(),
                            swc_ecma_ast::Stmt::With(_) => todo!(),
                            swc_ecma_ast::Stmt::Return(_) => todo!(),
                            swc_ecma_ast::Stmt::Labeled(_) => todo!(),
                            swc_ecma_ast::Stmt::Break(_) => todo!(),
                            swc_ecma_ast::Stmt::Continue(_) => todo!(),
                            swc_ecma_ast::Stmt::Switch(_) => todo!(),
                            swc_ecma_ast::Stmt::Throw(_) => todo!(),
                            swc_ecma_ast::Stmt::Try(_) => todo!(),
                            swc_ecma_ast::Stmt::While(_) => todo!(),
                            swc_ecma_ast::Stmt::DoWhile(_) => todo!(),
                            swc_ecma_ast::Stmt::For(_) => todo!(),
                            swc_ecma_ast::Stmt::ForIn(_) => todo!(),
                            swc_ecma_ast::Stmt::ForOf(_) => todo!(),
                            swc_ecma_ast::Stmt::Decl(decl) => match decl {
                                swc_ecma_ast::Decl::Class(_) => todo!(),
                                swc_ecma_ast::Decl::Fn(_) => todo!(),
                                swc_ecma_ast::Decl::Var(expr) => {
                                    let result = eval(
                                        &mut runtime,
                                        transpiled_src
                                            .substring(
                                                expr.span.lo.0 as usize - 1,
                                                expr.span.hi.0 as usize - 1,
                                            )
                                            .to_owned()
                                            .into(),
                                    );
                                    match result {
                                        Ok(value) => {}
                                        Err(err) => {}
                                    }
                                }
                                _ => {}
                            },
                        },
                        _ => {
                            println!("{:?}", node)
                        }
                    }
                });
            Ok(statements)
        }
        Err(err) => Err(err.to_string()),
    }
}

fn transpile(source: &str) -> Result<String, Error> {
    let parsed_module = deno_ast::parse_module(deno_ast::ParseParams {
        specifier: "repl.ts".to_string(),
        text_info: deno_ast::SourceTextInfo::from_string(source.to_string()),
        media_type: deno_ast::MediaType::TypeScript,
        capture_tokens: false,
        maybe_syntax: None,
        scope_analysis: false,
    })?;
    let transpiled_src = parsed_module
        .transpile(&deno_ast::EmitOptions {
            emit_metadata: false,
            source_map: false,
            inline_source_map: false,
            inline_sources: false,
            imports_not_used_as_values: ImportsNotUsedAsValues::Preserve,
            // JSX is not supported in the REPL
            transform_jsx: false,
            jsx_automatic: false,
            jsx_development: false,
            jsx_factory: "React.createElement".into(),
            jsx_fragment_factory: "React.Fragment".into(),
            jsx_import_source: None,
            var_decl_imports: true,
        })?
        .text;
    Ok(format!("'use strict'; void 0;\n{transpiled_src}"))
}

fn eval(context: &mut JsRuntime, code: FastString) -> Result<serde_json::Value, String> {
    let res = context.execute_script("<anon>", code);
    match res {
        Ok(global) => {
            let scope = &mut context.handle_scope();
            let local = v8::Local::new(scope, global);
            // Deserialize a `v8` object into a Rust type using `serde_v8`,
            // in this case deserialize to a JSON `Value`.
            let deserialized_value = serde_v8::from_v8::<serde_json::Value>(scope, local);

            match deserialized_value {
                Ok(value) => Ok(value),
                Err(err) => Err(format!("Cannot deserialize value: {err:?}")),
            }
        }
        Err(err) => Err(format!("Evaling error: {err:?}")),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![evaluate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
