import { Storage } from "@google-cloud/storage";
import { format } from "util";
import { join } from "path";
// Creates a client
const storage = new Storage({
  keyFilename: join(
    __dirname,
    "../",
    "explore-dream-and-discover-3f8e0425481b.json"
  ),
  projectId: "explore-dream-and-discover",
});

// Bucket Creater - Bucket Is The Place Where Our Data gets Stored.
// Run This Only Ones.
export const createBucket = async (bucketName) => {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
  return bucketName;
};

// Initializing
export const storageBucket = (name) => storage.bucket(name);

// Function For Uploading
export const uploadImage = (file, storageBucket) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const data = storageBucket.file(originalname);
    const dataStream = data.createWriteStream({
      resumable: false,
    });

    // Data is being Written Here.
    dataStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.cloud.google.com/${storageBucket.name}/${data.name}`
        );
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
