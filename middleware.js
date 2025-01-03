const Listing = require("./models/listings.model.js");
const Review = require("./models/review.model.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("failed", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  let errorMessage = error?.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(400, errorMessage);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errorMessage = error?.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(400, errorMessage);
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id?.equals(res.locals.currUser._id)) {
    req.flash("failed", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuther = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id?.equals(res.locals.currUser._id)) {
    req.flash("failed", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
// module.exports.fileSizeLimit = (req, res, next) => {
//   if (req.file) {  
//     const fileSize = req.file.size; 
//     if (fileSize > 10 * 1024 * 1024) {   
//       return res.status(400).send('File size exceeds the limit.');
//     }
//   } else {
//     return res.status(400).send('No file uploaded.');  
    
//   }
//   next();  
// };
