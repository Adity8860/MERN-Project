const express = require("express");
const router = express.Router();
const User = require("../models/users.model.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "You have successfully signed up");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("failed", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "You have successfully logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have successfully logged out");
    res.redirect("/listings");
  });
});
module.exports = router;
