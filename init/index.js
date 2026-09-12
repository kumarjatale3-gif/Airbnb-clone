const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

const mongoURL = "mongodb://127.0.0.1:27017/wanderlust"

main()
  .then(async () => {
    console.log("Connection Successful");
    await initDB();
  }).catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoURL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const updateData = data.data.map((obj) => ({ ...obj, 
    Owner:"6aa2ed088b83f2e5042137f5"
  }));
  await Listing.insertMany(updateData);
  console.log("data was initialize");
}