use deno_core::JsRuntime;
use deno_core::RuntimeOptions;
use tauri::Manager;

type CmdResult<T = ()> = Result<T, String>;

#[tauri::command]
pub fn evaluate(javascript: &str) -> CmdResult<String> {
    let mut runtime = JsRuntime::new(RuntimeOptions::default());
    let transpiled_src = crate::deno::transpile(javascript);
    match transpiled_src {
        Ok(transpiled_src) => match crate::deno::eval(&mut runtime, transpiled_src.into()) {
            Ok(evaluated) => Ok(unescape::unescape(evaluated.to_string().as_str()).unwrap()),
            Err(err) => Err(err.to_string()),
        },
        Err(err) => Err(err.to_string()),
    }
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
