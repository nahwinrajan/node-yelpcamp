var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
//we don't need to specify file name for the middleware due to we used index.js
//index.js is a special file name for node as it treated as entry point when loading files/directory
//anything stated there will be loaded (like if you put import directive there it will follow it)
var middlewareObj     = require('../middleware');

// index / home route
router.get("/", function(req, res) {
  Campground.find({}, function(err, camps) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("campgrounds/index", {campgrounds: camps});
    }
  });
});

// form to add new campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// create a new campground
router.post("/", middlewareObj.isLoggedIn, function (req, res) {
  let campground = {
    name: req.body.camp.name,
    image: req.body.camp.image,
    description: req.sanitize(req.body.camp.description),
    price: parseFloat(req.body.camp.price).toFixed(2),
    rating: parseFloat(req.body.camp.rating).toFixed(1),
    author: {
      id: req.user._id,
      name: req.user.name
    }
  };

  Campground.create(campground, function (err, createdCamp) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      console.log("----- new campground ------");
      console.log(createdCamp);
      res.redirect("/campgrounds/" + createdCamp._id);
    }
  });
});

// show a particular campground
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, camp) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("campgrounds/show", {camp: camp});
    }
  });
});

// edit a particular campground
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("campgrounds/edit", {camp: camp});
    }
  });
});

// update a particular campground
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res) {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  req.body.camp.price = parseFloat(req.body.camp.price).toFixed(2);
  req.body.camp.rating = parseFloat(req.body.camp.rating).toFixed(1);

  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedData) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      console.log('record updated');
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// delete a particular campground
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err, updatedData) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/");
    }
  });
});

module.exports= router;
