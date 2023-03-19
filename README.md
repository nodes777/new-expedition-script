
# new-expedition-script

This is a collection of node typescript scripts that help me manage my photos after returning from an "expedition". It is a port of my [python photo scripts.](https://github.com/nodes777/photo_scripts)

## Installation

Clone the project, cd into that directory, and install new-expedition-script with npm. 

```bash
    cd new-expedition-script
    npm i
```

Ideal usage is for the `.bat` scripts to be called from any directory. To accomplish this, add the directory of the .bat files to your PATH. For Windows:

1. Copy the `.bat` directory. `<where-you-cloned-the-project>/new-expedition-script/`.
2. Open the Start menu and search for "Environment Variables".
3. Click on "Edit the system environment variables".
4. Click on the "Environment Variables" button.
5. Under "System Variables", scroll down until you find "Path". Click on "Edit".
6. Click on "New" and enter the path to the directory where the .bat file is located, in this case `<where-you-cloned-the-project>/new-expedition-script/`.
7. Click "OK" on all windows to close them and save the changes.
8. Open a new command prompt and try running the .bat file by typing new-exp test. It should run the new-exp script with the argument test from any directory.


## Usage/Examples

`new-exp.bat <name_of_location_of_expedition>`

When prompted with `"Ready to move photos per the sheet? (y/n)"`

Entering `y` will move keeper photos and delete unmoved .NEF files. Entering `n` prints the path of the new description spreadsheet and ends the program. This path can later be used to sort the photos with:

`sort-photos.bat <path-to-descriptions-spreadsheet>`

If you didn't set this script in your path, you can cd into the folder and call the script directly `cd <your-path>\new-expedition-script npm run new-exp <name_of_location_of_expedition>`
## License

[GPL3.0](https://choosealicense.com/licenses/gpl-3.0/)

