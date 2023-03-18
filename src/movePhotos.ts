import * as fs from "fs";
import * as path from "path";
import { DateTime } from "luxon";
import * as XLSX from "xlsx";
import trash from "trash";

const startTime = DateTime.now();
const photos_path = "D:\\Photos";
const keepers_path = "D:\\Photos\\Keepers";
const file_prefix = "DSC_";
const file_suffixes = [".JPG", ".NEF", ".MOV"];
const delimeters = [";", ","];
const temp_descriptions_path =
  "D:\\Photos\\Keepers\\Loftus_Loop_2021-12-05\\descriptions.xlsx";

interface PhotoDescription {
  "Photo Numbers": string;
}

export const sortPhotos = (descriptionsPath: string) => {
  const initialPath = path.dirname(descriptionsPath);
  const destinationPath = path.join(initialPath, "keepers");
  const filesToMove = readSheet(descriptionsPath, initialPath);
  movePhotos(filesToMove, initialPath, destinationPath);
  deleteNEFFiles(initialPath);
  console.log("\nDone!");
  console.log(`--- ${DateTime.now().diff(startTime).seconds} seconds ---`);
};

const readSheet = (descriptionsPath: string, initialPath: string) => {
  const workbook = XLSX.readFile(descriptionsPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const descriptions = XLSX.utils.sheet_to_json<PhotoDescription>(worksheet);
  const fileNamesToMove: string[] = [];

  descriptions.forEach((row) => {
    const photoNumsStr = row["Photo Numbers"];
    if (typeof photoNumsStr !== "undefined") {
      const photoNums = photoNumsStr
        .replace(new RegExp(delimeters.join("|"), "g"), ";")
        .split(";")
        .filter(Boolean);

      photoNums.forEach((photoNum) => {
        const fileNum = photoNum.padStart(4, "0");
        file_suffixes.forEach((fileSuffix) => {
          const potentialFile = file_prefix + fileNum + fileSuffix;
          const fileInPath = path.join(initialPath, potentialFile);
          if (fs.existsSync(fileInPath)) {
            fileNamesToMove.push(potentialFile);
          }
        });
      });
    }
  });

  return fileNamesToMove;
};

const movePhotos = async (
  files: string[],
  initialPath: string,
  destinationPath: string
) => {
  let numMoved = 0;
  for (let i = 0; i < files.length; i++) {
    const fileToMove = files[i];
    const fileInPath = path.join(initialPath, fileToMove);
    if (fs.existsSync(fileInPath)) {
      await fs.promises.mkdir(destinationPath, { recursive: true });
      await fs.promises.rename(
        fileInPath,
        path.join(destinationPath, fileToMove)
      );
      console.log(`Moving: ${fileInPath} ${i + 1}/${files.length}`);
      numMoved += 1;
    }
  }
  console.log(`Moved: ${numMoved} files`);
};

const deleteNEFFiles = async (path: string) => {
  let nefCounter = 0;
  let numDeleted = 0;
  const filesToDelete: string[] = [];
  const files = await fs.promises.readdir(path);
  files.forEach((file) => {
    if (file.endsWith(".NEF")) {
      nefCounter += 1;
      filesToDelete.push(file);
    }
  });

  for (let i = 0; i < filesToDelete.length; i++) {
    const fileToDelete = filesToDelete[i];
    if (
      !fs.lstatSync(fileToDelete).isDirectory() &&
      fileToDelete.endsWith(".NEF")
    ) {
      console.log(
        `Deleting: ${fileToDelete} ${i + 1}/${nefCounter} .NEF files`
      );
      await trash(`${path}${fileToDelete}`);
      numDeleted += 1;
    }
  }
  console.log(`Deleted: ${numDeleted} files`);
};
