import { createNewExpedition } from "./createNewExpedition";
import { sortPhotos } from "./sortPhotos";

import * as readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sortPhotosCaller = async () => {
  const descriptionsFileName = process.argv[2];

  if (descriptionsFileName) {
    await sortPhotos(descriptionsFileName);
    process.exit();
  } else {
    throw new Error("No descriptions.xlsx file path was provided");
  }
};

sortPhotosCaller();
