// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod cmds;
mod core;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cmds::evaluate,
            cmds::close_splashscreen,
            cmds::lint
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            if let Some(window) = app.get_window("main") {
                #[cfg(debug_assertions)]
                window.open_devtools();
                #[cfg(any(windows, target_os = "macos"))]
                let _ = window_shadows::set_shadow(&window, true);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
