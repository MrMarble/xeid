use deno_lint::{linter::LinterBuilder, rules::get_recommended_rules};
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MarkerData {
    message: String,
    start_line_number: usize,
    start_column: usize,
    end_line_number: usize,
    end_column: usize,
    severity: u8,
    source: String,
}

pub fn lint(source: &str) -> Result<Vec<MarkerData>, [MarkerData; 1]> {
    let linter_builder = LinterBuilder::default()
        .rules(get_recommended_rules())
        .media_type(deno_ast::MediaType::TypeScript);

    let linter = linter_builder.build();

    match linter.lint("main.ts".to_string(), source.to_string()) {
        Ok((_, diagnostics)) => {
            let mut markers: Vec<MarkerData> = Vec::new();
            for diagnostic in diagnostics {
                let marker = MarkerData {
                    message: if let Some(hint) = diagnostic.hint {
                        diagnostic.message + ". " + hint.as_str()
                    } else {
                        diagnostic.message
                    },
                    start_line_number: diagnostic.range.start.line_index + 1,
                    start_column: diagnostic.range.start.column_index + 1,
                    end_line_number: diagnostic.range.end.line_index + 1,
                    end_column: diagnostic.range.end.column_index + 1,
                    severity: 4,
                    source: "deno".to_string(),
                };
                markers.push(marker);
            }
            Ok(markers)
        }
        Err(err) => Err([MarkerData {
            message: err.message().to_string(),
            start_line_number: err.display_position().line_number,
            start_column: err.display_position().column_number,
            end_line_number: err.display_position().line_number,
            end_column: err.display_position().column_number,
            severity: 8,
            source: "deno".to_string(),
        }; 1]),
    }
}
