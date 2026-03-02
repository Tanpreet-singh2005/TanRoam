const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// ================= INDEX + CREATE =================
router.route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,                      // 🔥 Must come first
    upload.single("listing[image]"), // Handle image upload
    validateListing,                 // Joi validation
    wrapAsync(ListingController.createNewListing)
  );


// ================= NEW FORM =================
router.get("/new",
  isLoggedIn,
  ListingController.renderNewForm
);


// ================= SHOW + UPDATE + DELETE =================
router.route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)
  );


// ================= EDIT FORM =================
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

module.exports = router;