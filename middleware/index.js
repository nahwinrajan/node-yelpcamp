var middlewareObj = {};
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  req.flash("error", "You must be <strong><em>signed-in</em></strong> to do that");
  res.redirect("/users/signin");
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err) {
        console.log(err);
        req.flash("error", "Can't find campground");
        res.redirect("back");
      } else {
        if(foundCampground.author.id.equals(req.user.id)) {
          next();
        } else {
          req.flash("error", "You don't have <strong>permission</strong> to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be <strong><em>signed-in</em></strong> to do that");
    res.redirect("users/signin");
  }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        console.log(err);
        req.flash("error", "Can't find comment");
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user.id)) {
          next();
        } else {
          req.flash("error", "You don't have <strong>permission</strong> to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be <strong><em>signed-in</em></strong> to do that");
    res.redirect("users/signin");
  }
}

module.exports = middlewareObj;
