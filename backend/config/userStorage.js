import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.USER_CLOUDNAME,
  api_key: process.env.USER_CLOUDKEY,
  api_secret: process.env.USER_CLOUDSECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads",
    allowedFormats:["jpeg","jpg", "png"],
  },
});

export { cloudinary, storage };
