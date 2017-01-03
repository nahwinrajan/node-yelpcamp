var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");

// index / home route
router.get("/", function(req, res) {
  Campground.find({}, function(err, camps) {
    if(err) {
      console.log("Error: ", err);
      // todo: do some proper error handling and error message
      res.send("Something terrible happened, can't find any new");
    } else {
      res.render("campgrounds/index", {campgrounds: camps});
    }
  });
});

// form to add new campground
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// create a new campground
router.post("/", isLoggedIn, function(req, res) {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  req.body.camp.price = parseFloat(req.body.camp.price).toFixed(2);
  req.body.camp.rating = parseFloat(req.body.camp.rating).toFixed(1);

  Campground.create(req.body.camp, function(err, createdData) {
    if(err) {
      console.log("Error: ", err);
      res.send("Something terrible happened, can't find any new");
    } else {
      res.redirect("/campgrounds/" + createdData._id);
    }
  });
});

// show a particular campground
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, camp) {
    if(err) {
      console.log("Error: ", err);
      // todo: do some proper error handling and error message
      res.send("Something terrible happened, can't find any new");
    } else {
      res.render("campgrounds/show", {camp: camp});
    }
  });
});

// edit a particular campground
router.get("/:id/edit", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    if(err) {
      console.log("Error: ", err);
      // todo: do some proper error handling and error message
      res.send("Something terrible happened, can't find any new");
    } else {
      res.render("campgrounds/edit", {camp: camp});
    }
  });
});

// update a particular campground
router.put("/:id", isLoggedIn, function(req, res) {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  req.body.camp.price = parseFloat(req.body.camp.price).toFixed(2);
  req.body.camp.rating = parseFloat(req.body.camp.rating).toFixed(1);

  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedData) {
    if(err) {
      console.log("Error: ", err);
      // todo: do some proper error handling and error message
      res.send("Something terrible happened, can't find any new");
    } else {
      console.log('record updated');
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// delete a particular campground
router.delete("/:id", isLoggedIn, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err, updatedData) {
    if(err) {
      console.log("Error: ", err);
      // todo: do some proper error handling and error message
      res.send("Something terrible happened, can't find any new");
    } else {
      res.redirect("/");
    }
  });
});

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/users/signin");
  }
}

module.exports= router;