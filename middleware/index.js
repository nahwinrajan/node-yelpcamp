var middlewareObj = {};
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/users/signin");
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
        console.log(err);
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user.id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("users/signin");
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        console.log(err);
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user.id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("users/signin");
  }
}

module.exports = middlewareObj;
