const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

main()
  .then(() => {
    console.log("Connection Successful");
    initDB();
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  try {
    // Delete old listings
    await Listing.deleteMany({});

    // Check if user already exists
    let user = await User.findOne({ username: "Tanpreet" });

    if (!user) {
      // Create new default user
      user = await User.register(
        new User({
          username: "Tanpreet",
          email: "tanpreet@gmail.com",
        }),
        "password123"
      );

      console.log("New user created");
    } else {
      console.log("User already exists");
    }

    // Add owner field to each listing
    const listings = initData.map((obj) => ({
      ...obj,
      owner: user._id,
    }));

    // Insert listings
    await Listing.insertMany(listings);

    console.log("Database initialized successfully ✅");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};