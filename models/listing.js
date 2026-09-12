const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title : {
    type: String,
    required: true,
  },
  description : {
    type:String,
  },
  image : { 
    url:String,
    filename:String,
    // type : String,
    // default : "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwc2NlbmV8ZW58MHx8MHx8fDA%3D",
    // set : (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwc2NlbmV8ZW58MHx8MHx8fDA%3D" : v,
  },
  price : {
    type:Number,
  },
  location : {
    type:String,
  },
  country : {
    type:String,
  },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review",
    },
  ],
  Owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  }
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id : {$in :listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;