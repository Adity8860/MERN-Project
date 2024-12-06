const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuther} = require("../middleware.js");
const Review = require("../models/review.model.js");
const Listing = require("../models/listings.model.js");
const reviewCtrl = require("../controllers/reviews.controller.js");





// Post Review
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewCtrl.createReview));

  //Delete Review
  
  router.delete("/:reviewId",isLoggedIn,isReviewAuther, wrapAsync(reviewCtrl.deleteReview));

  module.exports = router