const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.model.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingCtrl = require("../controllers/listings.controller.js");






router.get("/new", isLoggedIn, listingCtrl.newRoute);
router
  .route("/")
  .get(wrapAsync(listingCtrl.index))
  .post(isLoggedIn, validateListing, wrapAsync(listingCtrl.createRoute));

router
  .route("/:id")
  .get(wrapAsync(listingCtrl.showRoute))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingCtrl.updateRoute))
  .delete(isLoggedIn, isOwner, wrapAsync(listingCtrl.deleteRoute));

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingCtrl.deleteRoute));

//Index Route
// router.get("/", wrapAsync(listingCtrl.index));
//New Route
// router.get("/new", isLoggedIn, listingCtrl.newRoute);

//Show Route
// router.get("/:id", isLoggedIn, wrapAsync(listingCtrl.showRoute));

//Create Route
// router.post(
//   "/",
//   validateListing,
//   isLoggedIn,
//   wrapAsync(listingCtrl.createRoute)
// );

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingCtrl.editRoute));

//Update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingCtrl.updateRoute))
module.exports = router;
