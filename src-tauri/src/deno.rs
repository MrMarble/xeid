use anyhow::Error;

use deno_ast::ImportsNotUsedAsValues;

use deno_core::v8;
use deno_core::FastString;

use deno_core::JsRuntime;

pub fn transpile(source: &str) -> Result<String, Error> {
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

pub fn eval(context: &mut JsRuntime, code: FastString) -> Result<serde_json::Value, String> {
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
        Err(err) => Err(err.to_string()),
    }
}
