import { Schema, model } from "mongoose";

const hotelSchema = new Schema(
  {
    hotelName: {
      type: String,
      required: [true, "Enter The Name Of The Hotel"],
    },
    hotelImage: {
      type: String,
    },
    hotelLicenceId: {
      type: String,
      unique: true,
      required: [true, "Enter The Hotel ID"],
      validate: {
        validator: function (val) {
          if (String(val).length > 15 && String(val).length < 20) return true;
        },
        message: `Entered is not valid`,
      },
      select: false,
    },
    accommodation: {
      type: String,
      enum: ["Hotel", "Mansion", "Resort"],
      required: [true, "Enter the Accommodation Type"],
    },
    starHotel: {
      type: Number,
      min: 1,
      max: 7,
      required: [true, "Enter the Star"],
    },
    hotelAddress: {
      type: String,
      required: [true, "Enter the Full address"],
    },
    location: {
      type: String,
      required: [true, "Please Enter City Where Hotel is Located"],
    },
    checkIn: {
      type: String,
      default: "12:00 PM",
    },
    checkOut: {
      type: String,
      default: "12:00 PM",
    },
    amenities: {
      type: [String],
      default: [
        "Air Conditioning",
        "Internet",
        "Laundry Service",
        "Parking Facility",
        "Power backup",
        "Room Service",
        "Travel Assistance",
      ],
    },
    available: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    timestamps: true,
  }
);

// hotelSchema.virtual("hello").get(function () {
//   console.log("I got Attached To Hotel Schema");
//   return "Yes You Attached Me At The Time Of Calling Hotel Schema";
// });

/*@virtual Populate
..//HotelId = 1(_id)
    Room = search for ForeignField(_id=1)
*/

hotelSchema.virtual("availableRooms", {
  ref: "Room",
  localField: "_id", //reference to HotelSchema
  foreignField: "hotelId", //reference to Room Schema
});

hotelSchema.virtual("manager", {
  ref: "manager",
  localField: "_id",
  foreignField: "hotelId",
});

hotelSchema.pre(/^findOne/, function (next) {
  this.populate("availableRooms").populate("manager");
  next();
});

// Room Model

const roomSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "hotel",
  },
  roomImages: {
    type: [String],
    required: [true, "Please Upload Room Images"],
  },
  roomType: {
    type: String,
    require: [true, "Enter the Room Type"],
  },
  totalNumOfRoom: {
    type: Number,
    min: 1,
    require: [true, "Enter the Total Number of Room In This Room Type"],
  },
  roomCost: {
    type: Number,
    require: [true, "Enter the Room Cost per Night"],
  },
  typeOfCot: {
    type: String,
    enum: ["Single", "Double"],
    require: [true, "Enter the Type of cot"],
  },
  numOfGuest: {
    type: Number,
    require: [true, "Enter the Number of Guest Allowed Per Room"],
  },
  roomFacilitiess: {
    type: [String],
    default: ["Ac", "Smart tv", "Wifi", "Intercom", "Hot water"],
    require: [true, "Enter the Facilitiess"],
  },
});

roomSchema.pre(/^find/, function (next) {
  this.populate({
    path: "hotelId",
    model: "Hotel",
  });

  next();
});

roomSchema.pre("save", async function (next) {
  await Hotel.findByIdAndUpdate(
    this.hotelId,
    { available: true },
    {
      runValidators: true,
      new: true,
    }
  );

  next();
});

export const Hotel = model("Hotel", hotelSchema);
export const Room = model("Room", roomSchema);

//Manager Model

const managerSchema = new Schema({
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
  },
  contactNo: {
    type: Number,
    require: [true, "Enter the Contact Number"],
  },
  position: {
    type: [String],
    enum: ["Manager"],
    default: "Manager",
  },
});

managerSchema.pre(/^find/, function (next) {
  this.populate({
    path: "hotelId",
    model: "Hotel",
  });

  next();
});

export const Manager = model("manager", managerSchema);
