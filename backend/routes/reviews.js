import express from "express";
import multer from "multer";
import { storage } from "../config/reviewStorage.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  createReview,
  getReviewsByUser,
  getAllReviewsOfUserByListing,
  getReviewsByListing,
  getReviewByID,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();
const reviewImage = multer({ storage });

router.post("/", reviewImage.single("review-image"), requireAuth, createReview); // POST a new review
router.get("/by-user/:userID", getReviewsByUser); // GET all reviews by user
router.get("/by-user-listings/:userID", getAllReviewsOfUserByListing); // GET reviews for all listings of a user
router.get("/by-listing/:listingID", getReviewsByListing); // GET all reviews by listing
router.get("/:reviewID", getReviewByID); // GET a single review
router.patch(
  "/:reviewID",
  reviewImage.single("review-image"),
  requireAuth,
  updateReview
); // UPDATE a review
router.delete("/:reviewID", requireAuth, deleteReview); // DELETE a review without image

export default router;
