const Listing = require("../models/listings.model.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
module.exports.newRoute = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.showRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("failed", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
module.exports.createRoute = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
module.exports.editRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("failed", "Listing not found");
    return res.redirect("/listings");
  }
  let originalUrl = listing.image.url.replace("/upload", "/upload/w_300,h_250");
  res.render("listings/edit.ejs", { listing , originalUrl});
};
module.exports.updateRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = { url, filename };
    listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
