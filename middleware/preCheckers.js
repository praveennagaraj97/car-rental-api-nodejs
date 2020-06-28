// Checkers
import { AppError } from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsyncError";

// If Input Is Coming in req.body.
export const checkWhetherDocumentExists = (ModelName, fieldToCheckAt) =>
  catchAsyncError(async (req, res, next) => {
    const docxExist = await ModelName.findById(req.body[fieldToCheckAt]);
    if (!docxExist)
      return next(
        new AppError(
          "Please Check Input / Document Referenced is Not Found",
          405
        )
      );

    next();
  });

// If Input is Coming In Req.params
export const checkWetherReferenceExist = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const docxExist = await ModelName.findById(req.params.id);
    if (!docxExist || docxExist.length == 0)
      return next(new AppError("No Document Found", 404));

    next();
  });

export const checkingToWhomDocumentBelongs = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const loggedUser = req.loggedUser._id;
    const documentOwner = await ModelName.findById(req.params.id);
    if (!documentOwner)
      return next(new AppError("No Document Found With Given ID", 500));
    if (String(loggedUser) !== String(documentOwner.userId._id))
      return next(new AppError("This Document Doesn't Belongs To You", 404));
    next();
  });

export const checkWetherThisBelongsTo = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const docxOwner = await ModelName.findById(req.params.id);
    if (!docxOwner)
      return next(new AppError("No Document Found With Given ID", 500));
    if (String(req.profile._id) !== String(docxOwner.profileId))
      return next(new AppError("This Document Doesn't Belongs To You", 404));
    next();
  });
