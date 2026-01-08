use std::fs::{self, File};
use std::io;
use std::path::{Path, PathBuf};
use std::process::Command;
use zip::ZipArchive;

// Embedded ZIP files as bytes
const PROCESSING_ZIP: &[u8] = include_bytes!("../resources/processing-3.5.4-windows64.zip");
const STARTECH_ZIP: &[u8] = include_bytes!("../resources/startech.zip");
const TEMPLATE_ZIP: &[u8] = include_bytes!("../resources/Template.zip");

fn get_install_path(folder_name: &str) -> PathBuf {
    PathBuf::from(format!("C:\\{}", folder_name))
}

fn extract_zip_from_bytes(zip_bytes: &[u8], dest_path: &Path) -> Result<(), String> {
    let cursor = std::io::Cursor::new(zip_bytes);
    let mut archive = ZipArchive::new(cursor).map_err(|e| format!("Failed to open ZIP: {}", e))?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| format!("Failed to access file in ZIP: {}", e))?;
        
        let outpath = match file.enclosed_name() {
            Some(path) => dest_path.join(path),
            None => continue,
        };

        if file.is_dir() {
            fs::create_dir_all(&outpath).map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            if let Some(parent) = outpath.parent() {
                if !parent.exists() {
                    fs::create_dir_all(parent).map_err(|e| format!("Failed to create parent directory: {}", e))?;
                }
            }
            let mut outfile = File::create(&outpath).map_err(|e| format!("Failed to create file: {}", e))?;
            io::copy(&mut file, &mut outfile).map_err(|e| format!("Failed to write file: {}", e))?;
        }

        // Set permissions on Unix (no-op on Windows but good for cross-platform)
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode)).ok();
            }
        }
    }

    Ok(())
}

#[tauri::command]
fn create_install_folder(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    
    if !install_path.exists() {
        fs::create_dir_all(&install_path)
            .map_err(|e| format!("Failed to create folder {}: {}", install_path.display(), e))?;
    }
    
    Ok(())
}

#[tauri::command]
fn extract_processing(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    
    // Extract directly to install_path - the ZIP contains "processing-3.5.4" folder
    // We'll rename it to "Processing" after extraction
    extract_zip_from_bytes(PROCESSING_ZIP, &install_path)?;
    
    // Rename the extracted folder from "processing-3.5.4" to "Processing"
    let extracted_folder = install_path.join("processing-3.5.4");
    let target_folder = install_path.join("Processing");
    
    if extracted_folder.exists() && !target_folder.exists() {
        fs::rename(&extracted_folder, &target_folder)
            .map_err(|e| format!("Failed to rename Processing folder: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
fn copy_startech(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    
    // Extract directly to install_path - the ZIP already contains the "startech" folder
    extract_zip_from_bytes(STARTECH_ZIP, &install_path)?;
    
    Ok(())
}

#[tauri::command]
fn copy_template(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    
    // Extract directly to install_path - the ZIP already contains the "Template" folder
    extract_zip_from_bytes(TEMPLATE_ZIP, &install_path)?;
    
    Ok(())
}

#[tauri::command]
fn copy_extra_files(folder_name: String, files: Vec<String>) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    
    for file_path in files {
        let source = Path::new(&file_path);
        if source.exists() {
            let file_name = source.file_name()
                .ok_or_else(|| "Invalid file name".to_string())?;
            let dest = install_path.join(file_name);
            
            if source.is_dir() {
                copy_dir_all(source, &dest)?;
            } else {
                fs::copy(source, &dest)
                    .map_err(|e| format!("Failed to copy {}: {}", file_path, e))?;
            }
        }
    }
    
    Ok(())
}

fn copy_dir_all(src: &Path, dst: &Path) -> Result<(), String> {
    fs::create_dir_all(dst).map_err(|e| format!("Failed to create directory: {}", e))?;
    
    for entry in fs::read_dir(src).map_err(|e| format!("Failed to read directory: {}", e))? {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let ty = entry.file_type().map_err(|e| format!("Failed to get file type: {}", e))?;
        
        if ty.is_dir() {
            copy_dir_all(&entry.path(), &dst.join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.join(entry.file_name()))
                .map_err(|e| format!("Failed to copy file: {}", e))?;
        }
    }
    
    Ok(())
}

#[tauri::command]
fn create_shortcuts(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    
    // Get desktop path
    let desktop_path = dirs::desktop_dir()
        .ok_or_else(|| "Failed to get desktop path".to_string())?;
    
    // Find processing.exe - it might be in a subfolder
    let processing_exe = find_processing_exe(&install_path)?;
    
    // Create shortcuts using PowerShell
    let ps_script = format!(
        r#"
        $ws = New-Object -ComObject WScript.Shell
        
        $s1 = $ws.CreateShortcut('{}\Processing.lnk')
        $s1.TargetPath = '{}'
        $s1.WorkingDirectory = '{}'
        $s1.Save()
        
        $s2 = $ws.CreateShortcut('{}\Startech.lnk')
        $s2.TargetPath = '{}'
        $s2.Save()
        
        $s3 = $ws.CreateShortcut('{}\Template.lnk')
        $s3.TargetPath = '{}'
        $s3.Save()
        "#,
        desktop_path.display(),
        processing_exe.display(),
        processing_exe.parent().unwrap_or(&install_path).display(),
        desktop_path.display(),
        install_path.join("startech").display(),
        desktop_path.display(),
        install_path.join("Template").display()
    );
    
    let output = Command::new("powershell")
        .args(["-NoProfile", "-Command", &ps_script])
        .output()
        .map_err(|e| format!("Failed to run PowerShell: {}", e))?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to create shortcuts: {}", stderr));
    }
    
    Ok(())
}

fn find_processing_exe(install_path: &Path) -> Result<PathBuf, String> {
    let processing_dir = install_path.join("Processing");
    
    // Check direct path first (after our rename)
    let direct_path = processing_dir.join("processing.exe");
    if direct_path.exists() {
        return Ok(direct_path);
    }
    
    // Check in subdirectory (fallback if rename didn't happen)
    if let Ok(entries) = fs::read_dir(&processing_dir) {
        for entry in entries.flatten() {
            if entry.file_type().map(|t| t.is_dir()).unwrap_or(false) {
                let exe_path = entry.path().join("processing.exe");
                if exe_path.exists() {
                    return Ok(exe_path);
                }
            }
        }
    }
    
    // Also check if processing-3.5.4 folder exists at install_path level (if rename failed)
    let fallback_dir = install_path.join("processing-3.5.4");
    let fallback_exe = fallback_dir.join("processing.exe");
    if fallback_exe.exists() {
        return Ok(fallback_exe);
    }
    
    Err("processing.exe not found".to_string())
}

#[tauri::command]
fn set_file_associations(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    let processing_exe = find_processing_exe(&install_path)?;
    
    // Set file associations using cmd
    let _assoc_output = Command::new("cmd")
        .args(["/c", "assoc", ".pde=ProcessingSketch"])
        .output()
        .map_err(|e| format!("Failed to run assoc: {}", e))?;
    
    let ftype_cmd = format!("ProcessingSketch=\"{}\" \"%1\"", processing_exe.display());
    let _ftype_output = Command::new("cmd")
        .args(["/c", "ftype", &ftype_cmd])
        .output()
        .map_err(|e| format!("Failed to run ftype: {}", e))?;
    
    // Note: These commands might fail without admin rights, but that's OK
    // The shortcuts will still work
    
    Ok(())
}

#[tauri::command]
fn open_processing(folder_name: String) -> Result<(), String> {
    let install_path = get_install_path(&folder_name);
    let processing_exe = find_processing_exe(&install_path)?;
    
    Command::new(&processing_exe)
        .spawn()
        .map_err(|e| format!("Failed to open Processing: {}", e))?;
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            create_install_folder,
            extract_processing,
            copy_startech,
            copy_template,
            copy_extra_files,
            create_shortcuts,
            set_file_associations,
            open_processing
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

