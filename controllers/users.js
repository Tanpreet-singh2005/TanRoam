const User=require("../models/user.js");

module.exports.signUpForm=(req,res)=>{
  res.render("./users/signup.ejs");
};

module.exports.signUp=async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to WanderLust!");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });

  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.login= (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };
  module.exports.logOut=(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);

    }
    req.flash("success","You are logged out!!");
    res.redirect("/listings");
  })
};