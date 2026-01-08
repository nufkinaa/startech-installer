# 🚀 Startech Processing Installer

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Windows%2064--bit-0078D6?style=for-the-badge&logo=windows)
![Processing](https://img.shields.io/badge/Processing-3.5.4-00979D?style=for-the-badge)
![Built With](https://img.shields.io/badge/built%20with-Tauri%20%2B%20React-FFC131?style=for-the-badge&logo=tauri)

**Automated installer for Processing IDE and Startech educational resources**

[Installation](#-installation) •
[Features](#-features) •
[Troubleshooting](#-troubleshooting) •
[Getting Started](#-getting-started-with-processing)

</div>

---

## 📋 Overview

This installer automates the complete setup of the **Processing IDE** (v3.5.4) along with Startech educational resources and templates. Designed for classroom environments to ensure consistent setup across all student computers.

> **Processing** is an open-source graphical library and integrated development environment (IDE) built for electronic arts, new media art, and visual design.

---

## 💻 System Requirements

| Requirement     | Specification                      |
| --------------- | ---------------------------------- |
| **OS**          | Windows 10/11 (64-bit only)        |
| **RAM**         | 4 GB minimum (8 GB recommended)    |
| **Disk Space**  | ~500 MB for full installation      |
| **Display**     | 1024x768 minimum resolution        |
| **Permissions** | Administrator rights (recommended) |

---

## 📦 What's Included

| Component                 | Description                          |
| ------------------------- | ------------------------------------ |
| 🎨 **Processing 3.5.4**   | Full IDE with Java mode              |
| 📚 **Startech Resources** | Educational materials & examples     |
| 📁 **Template Folder**    | Starter files for lessons & projects |
| 🔊 **Minim Library**      | Audio library for sound projects     |

---

## 🚀 Installation

### Step 1: FIND THE INSTALLER AND ADD IT TO THE PC

Copy the installer to your PC if you are using USB drive, If not continue to step 2.
(This will make the installation run faster):

- ✅ Desktop
- ✅ Documents folder
- ✅ Any easily accessible folder

### Step 2: Run the Installer

<table>
<tr>
<td width="50%">

#### App: Graphical Installer ⭐ Recommended

Double-click:

```
Startech Installer.exe
```

</td>
<td width="50%">

> 💡 **Tip:** Right-click → **"Run as Administrator"** for best results

### Step 3: Wait for Completion

The installer will automatically:

- [x] Extract Processing IDE to Program Files
- [x] Copy "Startech" folder to your Documents
- [x] Copy "Template" folder for your projects
- [x] Create desktop shortcuts
- [x] Associate `.pde` files with Processing

---

## ✅ After Installation

Your desktop will have new shortcuts:

| Shortcut          | Purpose                      |
| ----------------- | ---------------------------- |
| 🖥️ **Processing** | Launch the Processing IDE    |
| 📁 **Startech**   | Access educational resources |
| 📁 **Template**   | Your project starter files   |

You can now:

- Double-click any `.pde` file to open it in Processing
- Start creating visual art and interactive programs
- Follow along with Startech lessons

---

## 🔧 Troubleshooting

<details>
<summary><b>🔴 Shortcuts not created</b></summary>

Run the installer as **Administrator**:

1. Right-click on `Startech Installer.exe`
2. Select "Run as administrator"
3. Confirm the UAC prompt

</details>

<details>
<summary><b>🔴 .pde files won't open in Processing</b></summary>

Manually set file association:

1. Right-click any `.pde` file
2. Select **"Open with..."** → **"Choose another app"**
3. Browse to `Processing.exe`
4. Check ✅ **"Always use this app to open .pde files"**
5. Click **OK**

</details>

<details>
<summary><b>🔴 Audio not working (Minim issues)</b></summary>

- Verify Minim library is in Processing's `libraries` folder
- Check your audio drivers are up to date
- Test with a simple sketch that doesn't use audio first

</details>

<details>
<summary><b>🔴 Installation fails</b></summary>

1. Check available disk space (need ~500 MB)
2. Temporarily disable antivirus software
3. Check `install_log.txt` for detailed error messages
4. Ensure you have write permissions to the target folders

</details>

<details>
<summary><b>🔴 Already have Processing installed?</b></summary>

No problem! This creates a **separate installation** — your existing version won't be affected.

</details>

### 📄 Log File

A detailed installation log is created at:

```
install_log.txt
```

Check this file if you encounter any issues.

---

## 🌐 Language Support

The graphical installer supports multiple languages:

| Language          | Code |
| ----------------- | ---- |
| 🇬🇧 English        | EN   |
| 🇮🇱 עברית (Hebrew) | HE   |

Click the language toggle in the installer to switch.

---

### 📖 Helpful Resources

| Resource            | Link                                                         |
| ------------------- | ------------------------------------------------------------ |
| 🌐 Official Website | [processing.org](https://processing.org)                     |
| 📖 Reference        | [processing.org/reference](https://processing.org/reference) |
| 🎓 Tutorials        | [processing.org/tutorials](https://processing.org/tutorials) |
| 💬 Forum            | [discourse.processing.org](https://discourse.processing.org) |

---

## 📝 Notes for Educators

- 📚 The **Startech** folder contains curriculum-aligned materials
- 📁 **Template** folder includes blank project starters
- 🔒 All installations are self-contained (no registry pollution)
- 💾 Can be deployed via USB for computer lab setups
- 👤 Students can run Processing without admin rights after install

---

## ⚠️ Known Limitations

- Windows 64-bit only (32-bit not supported)
- Some antivirus software may flag the installer (false positive)
- Minim audio library requires compatible sound drivers
- Java is bundled with Processing; no separate install needed

---

<div align="center">

## 👨‍💻 About

**Created by Elia Elhadad**

Built with [Tauri](https://tauri.app/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)

---

_For support or questions, contact your instructor._

</div>
