import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilePath: string) => {
  try {
    if (!localfilePath) return null;
    //upload file on cloudinary
    const res = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    console.log("File uploaded successfully", res.url);
    return res;
  } catch (error) {
    fs.unlinkSync(localfilePath); // remove the locally saved temp file
    return null;
  }
};

export { uploadOnCloudinary };
