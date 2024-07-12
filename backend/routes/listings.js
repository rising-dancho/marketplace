import { Router } from "express";
import { addListing, deleteListing, editListing, getListings, listingOfUser, markListingSold, searchForListing, viewOneListing } from "../controllers/listing.controller.js";
import multer from "multer";
import {storage} from "../config/listingStorage.js";
import requireAuth from "../middleware/requireAuth.js";

const listingsRouter = Router();
const listingImages = multer({storage})
listingsRouter.post("/addListing", listingImages.array("listing-img"), requireAuth, addListing);
listingsRouter.get("/viewAllListings", getListings);
listingsRouter.get("/viewListing/:id", viewOneListing);
listingsRouter.get("/search/:searchTerm", searchForListing);
listingsRouter.put("/editListing/:id", listingImages.array("listing-img"), requireAuth, editListing);
listingsRouter.put("/deleteListing/:id", requireAuth, deleteListing);
listingsRouter.put("/markSold/:id", requireAuth, markListingSold)
listingsRouter.get("/users/:id", listingOfUser)
export default listingsRouter;