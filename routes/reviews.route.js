const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../middleware.js");
const Review = require("../models/review.model.js");
const Listing = require("../models/listings.model.js");





// Post Review
router.post("/",validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
  //   if (!listing) {
  //     return res.status(404).send("Listing not found"); // Handle the case where the listing does not exist
  // }
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created");
   
    res.redirect(`/listings/${listing._id}`);
  }));

  //Delete Review
  
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
  
  
  }))

  module.exports = router