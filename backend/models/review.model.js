import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingID: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required."],
    },
    comment: {
      type: String,
    },
    image: {
      path: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

reviewSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
