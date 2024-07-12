import express from "express";
import {
  loginUser,
  signupUser,
  updateUser,
  getAllUsers,
  getUser,
} from "../controllers/user.controller.js";
import multer from "multer";
import {storage} from "../config/userStorage.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();
const profilePic = multer({storage})
// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// get a single user profile
router.get("/profile/:id", getUser);

// update profile route
router.put("/profile/:id", profilePic.single("profile-img"),requireAuth, updateUser);

// get all users
router.get("/profile", getAllUsers);

export default router;
