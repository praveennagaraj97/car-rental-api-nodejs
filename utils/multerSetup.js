import multer from "multer";

export const multerSetup = (filesize) =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: filesize || 5 * 1024 * 1024,
    },
  });
