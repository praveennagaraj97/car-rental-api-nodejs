// Schema AND model IS extracted/destructured from mongoose.
import { Schema, model } from "mongoose";

// Slug is Used To Search The Car With The Help of Slugify.
import slugify from "slug";

// CarSchema Contains Basic Car Details.
const carSchema = new Schema(
  {
    carname: {
      type: String,
      required: true,
      unique: [true, "car Name Should be Unique"],
    },

    slug: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },
    doors: {
      type: Number,
      required: true,
      select: false,
    },
    seats: {
      type: Number,
      required: true,
      max: 7,
      select: false,
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Auto", "Manual"],
    },
    min_age: {
      type: Number,
      default: 21,
      select: false,
    },
    carCoverImage: {
      type: String,
      required: [true, "Please Upload Car Cover Image"],
    },
    luggage: {
      type: String,
      required: true,
      select: false,
    },
    fuelType: {
      type: String,
      required: true,
    },
    fuelEconomy: {
      type: Number,
      required: true,
    },
    engine: {
      type: Number,
      required: true,
      select: false,
    },
    horsepower: {
      type: Number,
      required: true,
      select: false,
    },
    carType: {
      type: String,
      enum: ["SUV", "Sedan", "Sportback", "Hatchback"],
      required: true,
    },
    condition: {
      type: Boolean,
      default: true,
    },
  },
  {
    //Virtuals Are Used To Show The Availability Of The Car.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);

const attachCarSchema = new Schema(
  {
    numberPlate: {
      type: String,
      required: [true, "Please Enter Car Number Plate"],
      unique: true,
    },
    carImages: {
      type: [String],
      required: true,
    },
    availableLocation: {
      type: String,
      required: [true, "Please Enter Car Location"],
      enum: ["Kormangala", "Indiranagar", "Jaynagar", "Yelahanka", "RT Nagar"],
    },
    colour: {
      type: String,
      required: [true, "Please Enter Car Colour"],
      enum: ["Red", "White", "Blue", "Black"],
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Please Provide Car Id"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    modelYear: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

carSchema.indexes({ price: -1, fuelEconomy: -1, slug: 1 });
attachCarSchema.indexes({ numberPlate: 1 });

carSchema.virtual("availablecars", {
  ref: `Attachcar`,
  localField: `_id`,
  foreignField: `carId`,
});

carSchema.pre(`save`, function (next) {
  this.slug = slugify(this.carname, { lower: true });
  this.price = Math.floor(this.price);
  this.min_age = Math.floor(this.min_age);
  next();
});

carSchema.pre(/^findOne/, function (next) {
  this.find({ condition: { $ne: false } });
  this.populate({
    path: "availablecars",
  });
  next();
});

carSchema.pre(/^find/, function (next) {
  this.find({ condition: { $ne: false } });
  next();
});

attachCarSchema.pre(/^find/, function (next) {
  this.find({ available: { $ne: false } });
  next();
});

attachCarSchema.pre(/^find/, function (next) {
  this.populate({
    path: "carId",
    model: "Car",
  });
  next();
});

// carSchema.pre(`aggregate`, function (next) {
//   this.pipeline().unshift({ $match: { condition: { $ne: false } } });
//   next();
// });

export const Car = model("Car", carSchema);
export const AttachCar = model("Attachcar", attachCarSchema);
