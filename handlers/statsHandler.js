import { catchAsyncError } from "../utils/catchAsyncError";
import { AppError } from "../utils/appError";

export const getCollectionStatistics = (
  whoseStats,
  ModelName,
  matchingOption,
  groupOption,
  extraOption
) =>
  catchAsyncError(async (req, res, next) => {
    let Stats;
    if (extraOption) {
      Stats = await ModelName.aggregate([
        {
          $match: matchingOption,
        },
        {
          $group: groupOption,
        },
        extraOption,
      ]);
    } else {
      Stats = await ModelName.aggregate([
        {
          $match: matchingOption,
        },
        {
          $group: groupOption,
        },
      ]);
    }
    if (!Stats)
      return next(new AppError("No Document Found to Calculate Statistics"));
    res.status(200).json({
      Stats,
    });

    // req[whoseStats] = Stats;
    // next();
  });
