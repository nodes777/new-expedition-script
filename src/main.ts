import { createNewExpedition } from "./createNewExpedition";
import { sortPhotos } from "./movePhotos";

import * as readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = async () => {
  const folderName = process.argv[2];

  const descriptionsFile = await createNewExpedition(folderName);

  const answer = await rl.question(
    "Ready to move photos per the sheet? (y/n)\n"
  );

  if (answer === "y") {
    console.log("Moving photos...");
    console.log(descriptionsFile);
    sortPhotos(descriptionsFile);
    rl.close();
  } else if (answer === "n") {
    console.log("Ok here's the file path for later");
    console.log(descriptionsFile);
    rl.close();
  }
};

main();
