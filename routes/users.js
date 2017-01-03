var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

//create new user
router.post("/users", (req, res) => {
  let newUser = new User({
    name: req.body.user.name,
    email: req.body.user.email
  });
  User.register(newUser, req.body.user.password, function (err, user) {
    if(err) {
      console.log(err);
      return res.render("users/signup", {usr: user});
    }
    console.log("Created user: " + user.email);

    //  passport authenticate basically invoke req.login()
    //  http://passportjs.org/docs/login
    req.login(user, function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      return res.redirect('/campgrounds');
    });
  });
});

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

// log-in logic
router.post("/users/signin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/signin"
  }), function() {
});

router.get('/users/signout', (req, res) => {
  req.logout();
  console.log("user signed out, redirecting to homepage");
  res.redirect('/');
});

module.exports = router;
