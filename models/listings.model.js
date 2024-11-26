const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model.js");

const listingSchema = new Schema({
  title: String,
  description: String,
  // image: {
  //   type: String,
  //   default:
  //     "https://images.unsplash.com/photo-1729180801744-c26a031be578?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   set: (v) =>
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  //       : v,
  // },
  image: {
    filename: String,
    url: {
      type: String,
      default:"https://images.unsplash.com/photo-1441260038675-7329ab4cc264?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  // image: {
  //   type: String,
  //   set: (v) =>
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1729180801744-c26a031be578?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  //       : v,
  // },
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
  ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
