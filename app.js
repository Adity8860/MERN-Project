const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.model.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMates = require("ejs-mate");

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

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});
//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, {
    ...req.body.listing
  });
  res.redirect(`/listings/${id}`);
});
//Delete Route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

/**/ /* */
// app.get("/testListings", async (req, res) => {
//   let sampleListings = new Listing({
//     title: "Sample Listing",
//     description: "This is a sample listing",
//     image:
//       "https://images.unsplash.com/photo-1729180801744-c26a031be578?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: 100,
//     location: "Sample Location",
//     country: "Sample Country",
//   });

//   await sampleListings.save();
//   console.log("successfully saved sample listing");
//   res.send("test successful");
// });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
