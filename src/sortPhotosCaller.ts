import { sortPhotos } from "./sortPhotos";

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
