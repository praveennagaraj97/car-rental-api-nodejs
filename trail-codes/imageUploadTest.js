const express = require("express");
const multer = require("multer");
const { format } = require("util");
//Multer SetUp

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();

app.use(express.json());
app.disable("x-powered-by");
app.use(multerMid.single("file"));
app.use(express.urlencoded({ extended: false }));

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Creates a client
const storage = new Storage({
  keyFilename: "./../explore-dream-and-discover-3f8e0425481b.json",
  projectId: "explore-dream-and-discover",
});

const storageBucket = storage.bucket("carrental");
// Function For Uploading
const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = storageBucket.file(originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.cloud.google.com/${storageBucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

app.post("/uploads", async (req, res, next) => {
  //   console.log(req.file);
  uploadImage(req.file)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(4000, () => {
  console.log("LIstening");
});
