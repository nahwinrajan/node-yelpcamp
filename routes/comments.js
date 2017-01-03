var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, (err, camp) => {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/comments/new", {camp: camp});
    }
  });
});

router.post("/", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, (err, camp) => {
    if(err) {
      console.log(err);
      render("campgrounds/comments/new");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          camp.comments.push(comment);
          camp.save();
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  })
});

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect("/users/signin");
}

module.exports = router;
