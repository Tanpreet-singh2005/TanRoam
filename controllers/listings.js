const Listing = require("../models/listing.js");


// ================= INDEX =================
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


// ================= NEW FORM =================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


// ================= CREATE =================
module.exports.createNewListing = async (req, res) => {

  // If image not uploaded
  if (!req.file) {
    req.flash("error", "Please upload an image!");
    return res.redirect("/listings/new");
  }

  const { path: url, filename } = req.file;

  // Create new listing
  const newListing = new Listing(req.body.listing);

  // Add image
  newListing.image = { url, filename };

  // Add owner (VERY IMPORTANT)
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};


// ================= SHOW =================
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};


// ================= EDIT FORM =================
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const editListing = await Listing.findById(id);

  if (!editListing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = editListing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { editListing, originalImageUrl });
};


// ================= UPDATE =================
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  // If new image uploaded
  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};


// ================= DELETE =================
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};