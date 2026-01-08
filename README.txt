=============================================
PROCESSING AUTO-INSTALL TOOL (64-bit)
=============================================

This tool helps you set up the Processing IDE and related files automatically.

Before You Begin
----------------
1. Copy *all* the files and folders from this USB drive to your computer.
   (You can copy them anywhere, for example: Desktop or Documents folder.)

2. Once copied, double-click the file:
       install_processing.bat
   The script will begin installing everything automatically.

What the Tool Does
------------------
✔ Extracts and installs Processing (version 3.5.4)
✔ Copies the required “Startech” folder to your Documents folder
✔ Copies the “Template” folder (used for lessons)
✔ Creates desktop shortcuts for:
     - Processing
     - Startech folder
     - Template folder
✔ Connects .PDE files to open automatically with Processing

If Something Fails
------------------
At the end of the installation, you’ll see a summary message.

If any steps fail (for example, creating shortcuts or setting file associations),
the tool will list which ones didn’t work in the command window.

You can also check the log file:
       install_log.txt
which is created automatically next to this script.

After Installation
------------------
Once everything is complete, you can:
- Open Processing from your desktop shortcut
- Open any .pde file directly (it should open in Processing)
- Explore the "Template" and "Startech" folders for your first projects

Tips
----
• Run the installer as Administrator if shortcuts or file association fail.
• If you already have Processing installed, this version won’t overwrite it
  — it just adds another local installation.
• Check that minim is installed correctly with your pc configuration.
• If .pde files are not associated with processing, Open the template.pde and choose open always with... and then go to processing and pick the version you downloaded.

---------------------------------------------
Created by: Elia Elhadad
Version: 1.1
---------------------------------------------
