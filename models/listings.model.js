const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model.js");

const listingSchema = new Schema({
  title: String,
  description: String,
 
  image: {
    filename: String,
    url: {
      type: String,
      default:"https://images.unsplash.com/photo-1441260038675-7329ab4cc264?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  price: {
    type: Number,
    default: 0
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
