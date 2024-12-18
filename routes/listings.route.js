const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  fileSizeLimit,
} = require("../middleware.js");
const listingCtrl = require("../controllers/listings.controller.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

router.get("/new", isLoggedIn, listingCtrl.newRoute);
router
  .route("/")
  .get(wrapAsync(listingCtrl.index))
  .post(
    isLoggedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingCtrl.createRoute)
  );

router
  .route("/:id")
  .get(wrapAsync(listingCtrl.showRoute))
  .put(
    isLoggedIn,
    isOwner,

    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingCtrl.updateRoute)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingCtrl.deleteRoute));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingCtrl.editRoute));

module.exports = router;
