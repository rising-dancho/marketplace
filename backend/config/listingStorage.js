import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.LISTING_CLOUDNAME,
  api_key: process.env.LISTING_CLOUDKEY,
  api_secret: process.env.LISTING_CLOUDSECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "grp_proj_listings",
    allowedFormats:["jpeg","jpg", "png"],
  },
});

export { cloudinary, storage };
