import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //Cloudinary URL
      required: [true, "Video file is required"],
    },
    thumbnail: {
      type: String, //Cloudinary URL
      required: [true, "Video thumbnail is required"],
    },
    title: {
      type: String,
      required: [true, "Video title is required"],
    },
    description: {
      type: String,
      required: [true, "Video description is required"],
    },
    duration: {
      type: Number, //Cloudinary URL
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
