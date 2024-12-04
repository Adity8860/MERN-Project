const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.model.js");

const MONGODB_URI = "mongodb://localhost:27017/wanderlust2";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGODB_URI);
}
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "674987686976e019e40de9c8",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data initialized successfully");
};
initDB();
