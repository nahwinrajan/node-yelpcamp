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
  User.register(newUser, req.body.user.password, function (err, createdUser) {
    if(err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("back");
    }
    console.log("Created user: " + user.email);

    //  passport authenticate basically invoke req.login()
    //  http://passportjs.org/docs/login
    req.login(user, function(err) {
      if (err) {
        console.log(err);
        req.flash("error", "Can't sign-in user");
        return next(err);
      }
      req.flash("success", "Welcome back, " + user.name + "!");
      return res.redirect('/campgrounds');
    });
  });
});

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

// log-in logic
// router.post("/users/signin", passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/users/signin"
//   }), function() {
// });

router.post('/users/signin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      req.flash("error", "Unexpected error encountered");
      return next(err);
    }
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect('/users/signin');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
      delete req.session.redirectTo;

      req.flash("success", "Welcome back, " + user.name + "!!");
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

router.get('/users/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
