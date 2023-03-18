import * as fs from "fs";
import * as path from "path";
import { DateTime } from "luxon";
import * as child_process from "child_process";

// 102D7000 - Moms D7000
// 108D3400 - My Camera
const cameraPath = "E:/DCIM/108D3400";
const photosPath = "D:/Photos";
const keepersPath = "D:/Photos/Keepers";
const descriptionsTemplatePath = path.join(
  keepersPath,
  "descriptions_template.xlsx"
);
const descriptionsFileName = "descriptions.xlsx";
const todaysDate = DateTime.local().toFormat("yyyy-MM-dd");

export const createNewExpedition = (folderNameInput: string) => {
  const startTime = Date.now();
  const [newFolderPath, newFolderName] = makeNewFolder(folderNameInput);
  movePhotosFromCameraToComp(cameraPath, newFolderPath);
  const descriptionsFile = createKeepersFolder(newFolderName);
  console.log(`--- ${Date.now() - startTime} milliseconds ---`);
  child_process.spawn("explorer.exe", [newFolderPath]);
  // After the files have been copied to the computer, delete them from the SD card
  deleteFilesFromSdCard(cameraPath);
  return descriptionsFile;
};

const makeNewFolder = (folderNameInput: string) => {
  if (!folderNameInput) {
    throw new Error("No input folder provided");
  }
  const newFolderName = `${folderNameInput}_${todaysDate}`;
  const newFolderPath = path.join(photosPath, newFolderName);
  fs.mkdirSync(newFolderPath, { recursive: false });
  console.log(`Created New Folder ${newFolderPath}`);
  return [newFolderPath, newFolderName];
};

const movePhotosFromCameraToComp = (
  cameraPath: string,
  newFolderPath: string
) => {
  const filesOnCamera = fs.readdirSync(cameraPath);
  const numFiles = filesOnCamera.length;
  for (let i = 0; i < numFiles; i++) {
    const file = filesOnCamera[i];
    const source = path.join(cameraPath, file);
    const dest = path.join(newFolderPath, file);
    fs.copyFileSync(source, dest);
    process.stdout.write(`Moving ${file} ${i}/${numFiles}\r`);
  }
};

const createKeepersFolder = (newFolderName: string) => {
  const newKeepersFolder = path.join(keepersPath, newFolderName);
  fs.mkdirSync(newKeepersFolder, { recursive: false });
  console.log(`Created New Folder ${newKeepersFolder}`);
  // Copy a descriptions file from template
  const descriptionsCopy = path.join(newKeepersFolder, descriptionsFileName);
  fs.copyFileSync(descriptionsTemplatePath, descriptionsCopy);
  // Open the descriptions file and the new keepers folder in the OS's file explorer
  child_process.spawn("explorer.exe", [newKeepersFolder]);
  child_process.spawn("explorer.exe", [descriptionsCopy]);
  return descriptionsCopy;
};

const deleteFilesFromSdCard = async (directoryPath: string) => {
  const files = await fs.promises.readdir(directoryPath);
  const deletionPromises = files.map((file) =>
    fs.promises.unlink(path.join(directoryPath, file))
  );
  await Promise.all(deletionPromises);
  console.log("All SD card files deleted");
};
