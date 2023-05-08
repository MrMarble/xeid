use std::vec;

use crate::core::linter::MarkerData;
use deno_ast::swc::common::Spanned;
use deno_core::JsRuntime;
use tauri::Manager;

type CmdResult<T = ()> = Result<T, String>;

#[derive(Debug, serde::Serialize)]
pub struct Expr(usize, String);

#[tauri::command]
pub fn evaluate(javascript: &str) -> CmdResult<Vec<Expr>> {
    let mut runtime: JsRuntime = JsRuntime::new(Default::default());
    runtime.execute_script(
        "runtime.js",
        r#"
    ((globalThis) => {
      const core = Deno.core;
    
      function argsToMessage(...args) {
        return args.map((arg) => JSON.stringify(arg)).join(" ");
      }
    
      globalThis.console = {
        log: (...args) => {
          return argsToMessage(...args)
        },
        error: (...args) => {
         return argsToMessage(...args)
        },
      };
    })(globalThis);"#
            .to_string()
            .into(),
    );
    let parsed_source =
        crate::core::deno::parse_module(javascript).map_err(|err| err.to_string())?;

    let mut top_level_expressions: Vec<Expr> = vec![];

    parsed_source.module().body.iter().for_each(|item| {
        if let deno_ast::swc::ast::ModuleItem::Stmt(stmt) = item {
            match stmt {
                deno_ast::swc::ast::Stmt::Expr(_) | deno_ast::swc::ast::Stmt::If(_) => {
                    let start = stmt.span_lo().0 as usize - 1;
                    let end = stmt.span_hi().0 as usize - 1;
                    let code = &javascript[start..end];
                    let lines = javascript[..end].lines().count();

                    let parsed = crate::core::deno::parse_module(code);
                    if parsed.is_err() {
                        return;
                    }
                    let transpiled = crate::core::deno::transpile(parsed.unwrap());
                    if transpiled.is_err() {
                        return;
                    }

                    match crate::core::deno::execute_script(
                        &mut runtime,
                        transpiled.unwrap().into(),
                    ) {
                        Ok(evaluated) => top_level_expressions.push(Expr(
                            lines,
                            unescape::unescape(evaluated.to_string().as_str()).unwrap(),
                        )),
                        Err(err) => {
                            println!("Error: {}", err);
                        }
                    }
                }
                _ => {
                    let start = stmt.span_lo().0 as usize - 1;
                    let end = stmt.span_hi().0 as usize - 1;
                    let code = &javascript[start..end];

                    let parsed = crate::core::deno::parse_module(code);
                    if parsed.is_err() {
                        return;
                    }
                    let transpiled = crate::core::deno::transpile(parsed.unwrap());
                    if transpiled.is_err() {
                        return;
                    }

                    match crate::core::deno::execute_script(
                        &mut runtime,
                        transpiled.unwrap().into(),
                    ) {
                        Ok(_) => {}
                        Err(err) => {
                            println!("Error: {} {}", err, code);
                        }
                    }
                }
            }
        }
    });

    Ok(top_level_expressions)
}

#[tauri::command]
pub async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
pub fn lint(javascript: &str) -> Result<Vec<MarkerData>, [MarkerData; 1]> {
    crate::core::linter::lint(javascript)
}
