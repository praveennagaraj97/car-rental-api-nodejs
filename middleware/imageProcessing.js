import { uploadImageBehindTheRequest } from "./../handlers/factoryHandler";
import { AppError } from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsyncError";

export const processDataWithSingleImage = (imagefieldName, bucketfolderName) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.files) return next(new AppError("Please Select Image", 206));

    if (req.files.length !== 1)
      return next(new AppError("Please Select an Image", 400));

    req.files[0].originalname =
      Math.random().toString(36).substring(2, 15) + req.files[0].originalname;

    const imageUrl = await uploadImageBehindTheRequest(
      req.files[0],
      bucketfolderName
    );
    req.body[imagefieldName] = imageUrl;
    next();
  });

// Ask For Number Of Images / imagefieldname,bucketfoldername
export const processDataWithMultipleImage = (
  imagefieldName,
  bucketfolderName,
  noOfImages
) =>
  catchAsyncError(async (req, res, next) => {
    if (req.files.length < 1)
      return next(new AppError("Please Upload Required Images", 206));

    if (req.files.length > noOfImages)
      return next(
        new AppError(`Please Select ${noOfImages} Images Only!.`, 413)
      );
    const images = [];
    // const randomStr = Math.random().toString(36).substring(2, 15);

    for (let i = 0; i < req.files.length; i++) {
      // req.files[i].originalname = randomStr + req.files[i].originalname;
      images.push(
        await uploadImageBehindTheRequest(req.files[i], bucketfolderName)
      );
    }
    req.body[imagefieldName] = images;
    next();
  });
