const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userCtrl = require("../controllers/users.controller.js");

router
  .route("/signup")
  .get(userCtrl.signup_get)
  .post(wrapAsync(userCtrl.signup_post));

router
  .route("/login")
  .get(userCtrl.login_get)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userCtrl.login_post
  );

// router.get("/signup", userCtrl.signup_get);

// router.post("/signup", wrapAsync(userCtrl.signup_post));

// router.get("/login", userCtrl.login_get);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userCtrl.login_post
// );

router.get("/logout", userCtrl.logout_get);

module.exports = router;
