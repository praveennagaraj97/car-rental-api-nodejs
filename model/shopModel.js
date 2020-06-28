import { Schema, model } from "mongoose";
import slugify from "slug";

const shopSchema = new Schema(
  {
    partName: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "Part name cannot be less than 5 characters"],
      maxlength: [55, "Part Name cannot be more than 25 characters !"],
    },
    slug: {
      type: String,
    },
    dateAdded: {
      type: Date,
      default: Date.now(),
    },
    partPrice: {
      type: Number,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
      maxlength: [20, "Product Category cannot be more than 20 characters !"],
    },
    carBrand: {
      type: String,
      required: true,
      maxlength: [15, "Car Brand cannot be more than 15 characters !"],
    },
    carModel: {
      type: String,
      required: true,
    },
    carVarient: {
      type: Number,
      required: true,
    },
    productBy: {
      type: String,
      required: true,
      select: false,
    },
    productQuality: {
      type: String,
      required: true,
    },
    productQuantity: {
      type: Number,
      max: 25,
      required: true,
    },
    productImages: {
      type: [String],
      required: [true, "Please Add Product Image"],
    },
    productDetails: {
      type: String,
      trim: true,
      maxlength: [150, "Product Details cannot be more than 150 characters !"],
      select: false,
    },
    productPartNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

shopSchema.indexes({ price: 1, slug: 1 });

shopSchema.virtual("Available").get(function () {
  return this.productQuantity ? "Availabale" : "Not Available";
});

shopSchema.pre("save", function (next) {
  this.slug = slugify(this.partName, { lower: true });
  next();
});

export const Shop = model("shopping", shopSchema);
