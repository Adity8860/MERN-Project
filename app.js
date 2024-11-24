const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.model.js");
const Review = require("./models/review.model.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMates = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

const MONGODB_URI = "mongodb://localhost:27017/wanderlust2";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMates);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGODB_URI);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});
//Middleware

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  let errorMessage = error?.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(400, errorMessage);
  }
  next();
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errorMessage = error?.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(400, errorMessage);
  }
  next();
};

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listings/${id}`);
  })
);
//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

// Post Review
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
  let listing = await Listing.findById(req.params.id);
//   if (!listing) {
//     return res.status(404).send("Listing not found"); // Handle the case where the listing does not exist
// }
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
 
  res.redirect(`/listings/${listing._id}`);
}));
//Delete Review

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
let { id, reviewId } = req.params;
await Listing.findByIdAndUpdate(id, {
  $pull: { reviews: reviewId },
});
await Review.findByIdAndDelete(reviewId)
res.redirect(`/listings/${id}`);


}))
 














//Error Handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  if (statusCode !== 404) {
    console.error(err);
  }
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
