var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

router.get("/new", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, (err, camp) => {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/comments/new", {camp: camp});
    }
  });
});

router.post("/", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, (err, camp) => {
    if(err) {
      console.log(err);
      render("campgrounds/comments/new");
    } else {
      let comment = {
        message: req.sanitize(req.body.comment.message),
        author: {
          id: req.user._id,
          name: req.user.name
        }
      };

      Comment.create(comment, function (err, createdComment) {
        if (err) {
          console.log(err);
        } else {
          camp.comments.push(createdComment);
          camp.save();

          console.log("----- new comment ------");
          console.log(createdComment);

          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/users/signin");
}

module.exports = router;
