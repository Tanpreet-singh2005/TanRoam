const express=require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js")
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
const ReviewListing=require("../controllers/reviews.js")




//Reviews
router.post("/",validateReview,isLoggedIn,wrapAsync(ReviewListing.createReview));
//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewListing.destroyReview));

module.exports=router;


