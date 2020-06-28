// Error Handlers
// catchAsyncError will catch asyncrounous func Errors
// AppError Will create user Defined Errors

import { catchAsyncError } from "./../utils/catchAsyncError";
import { AppError } from "./../utils/appError";

import { ApiFeatures } from "./../utils/apiFeatures";

// Google Cloud.
import {
  uploadImage,
  storageBucket,
  createBucket,
} from "./../utils/googleCloudImageBucket";

export const createDocument = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const docx = await ModelName.create(req.body);
    responseObj.docx = docx;
    res.status(201).json(responseObj);
  });

export const readAllDocument = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const modelledData = new ApiFeatures(ModelName.find(), req.query)
      .filter()
      .limit()
      .paging()
      .sort();

    const docx = await modelledData.queryObj;
    if (!docx || docx.length < 1)
      return next(new AppError("No Document to Show", 400));
    responseObj.results = docx.length;
    responseObj.docx = docx;

    res.status(302).json(responseObj);
  });

export const readDocumentByID = (
  ModelName,
  responseObj,
  ...selectFieldoptions
) =>
  catchAsyncError(async (req, res, next) => {
    const docx = await ModelName.findById(req.params.id).select(
      ...selectFieldoptions
    );

    if (!docx)
      return next(new AppError("No Document Found With Given Id", 404));

    responseObj.docx = docx;
    res.status(302).json(responseObj);
  });

export const updateDocumentByID = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    if (!Object.keys(req.body).length)
      return next(new AppError("Document Not Changed As No Values Given", 304));

    const docx = await ModelName.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!docx)
      return next(
        new AppError(`Document with ${req.params.id} is not Found`, 500)
      );

    responseObj.document = docx;
    responseObj.updatedValue = req.body;
    res.status(202).json(responseObj);
  });

export const deleteDocument = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const docx = await ModelName.findByIdAndDelete(req.params.id);
    if (!docx)
      return next(new AppError("No Document Found With Given ID to Delete"));
    responseObj.deleteID = `Deleted Document with ${req.params.id}`;
    res.status(202).json(responseObj);
  });

// Advanced Handlers

export const imageUploader = (
  ModelName,
  folderName,
  imageFieldName,
  responseObj
) =>
  catchAsyncError(async (req, res, next) => {
    if (req.files.length > 1)
      return next(new AppError("Please Select One Image!", 205));
    const checkExist = await ModelName.findById(req.params.id);
    if (!checkExist)
      return next(
        new AppError("No Document Found With Given ID to Upload Image", 500)
      );

    let folder;
    try {
      folder = await createBucket(folderName);
    } catch (err) {
      if (err.code == 409) {
        folder = folderName;
      }
    }
    req.files[0].originalname =
      Math.random().toString(36).substring(2, 15) + req.files[0].originalname;

    const googleStorage = storageBucket(folder);
    const publicUrl = await uploadImage(req.files[0], googleStorage);
    if (!publicUrl) return next(new AppError("Image Upload Failed", 500));

    const docx = await ModelName.findByIdAndUpdate(
      req.params.id,
      { [imageFieldName]: publicUrl },
      {
        new: true,
        runValidators: true,
      }
    );
    responseObj.docx = docx;
    res.status(200).json(responseObj);
  });

export const uploadImageBehindTheRequest = async (file, bucketFolerName) => {
  let folder;
  try {
    folder = await createBucket(bucketFolerName);
  } catch (err) {
    if (err.code == 409) {
      folder = bucketFolerName;
    }
  }
  const googleStorage = storageBucket(folder);
  const publicUrl = await uploadImage(file, googleStorage);

  return publicUrl;
};
