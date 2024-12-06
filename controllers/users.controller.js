const User = require("../models/users.model.js");
 


module.exports.signup_get = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup_post = async (req, res) => {
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
};

module.exports.login_get = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login_post = async (req, res) => {
  req.flash("success", "You have successfully logged in");
  res.redirect(res.locals.redirectUrl || "/listings");
};
module.exports.logout_get = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have successfully logged out");
    res.redirect("/listings");
  });
};
