const express=require("express");
const router = express.Router();
const User=require("../models/user.js");
const passport=require("passport");

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {saveRedirectUrl}=require("../middleware.js");
const UserController=require("../controllers/users.js");
router.route("/signup").get(UserController.signUpForm).post(wrapAsync(UserController.signUp));

router.route("/login")
.get((req,res)=>{
  res.render("./users/login.ejs");
}).post(
  saveRedirectUrl,
  passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
 UserController.login
);



router.get("/logout",UserController.logOut)
module.exports=router;