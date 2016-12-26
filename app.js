// variables - backend and other app-wide modules
var express         = require('express'),
  app               = express(),
  mongoose          = require('mongoose'),
  path              = require('path'),
  methodOverride    = require('method-override'),
  expressSanitizer  = require('express-sanitizer'),
  bodyParser        = require('body-parser');

// variables - models
var Campground = require("./models/campground");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));  // declare public / static asset directory
app.use(bodyParser.urlencoded({extended: true})); // parse html input control and access it in backend code
//methodOverride must be call after bodyParser is called
app.use(methodOverride('_method')); // enable put and delete html verb by overriding post method
app.use(expressSanitizer()); //sanitize user's html encoding input

//db-config
mongoose.connect("mongodb://localhost/yelpcamp");
// Campground.create({ name: "Salmon Creek", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg", price:"9", rating: "4", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." }, function(err, handler){});
// Campground.create({ name: "Granite Hill", image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg", price:"7.5", rating: "3.5", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."  }, function(err, handler){});
// Campground.create({ name: "Green Meadow", image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg", price:"5", rating: "3", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."  }, function(err, handler){});
// Campground.create({ name: "Dawson Creek", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg", price:"6", rating: "3", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."  }, function(err, handler){});

//routes
app.get("/", function(req, res) {
  res.redirect("/campgrounds");
});

// index / home route
app.get("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

// create a new campground
app.post("/campgrounds", function(req, res) {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  req.body.camp.price = parseFloat(req.body.camp.price).toFixed(2);
  req.body.camp.rating = parseFloat(req.body.camp.rating).toFixed(1);

  Campground.create(req.body.camp, function(err, createdData) {
    if(err) {
      console.log("Error: ", err);
      res.send("Something terrible happened, can't find any new");
    } else {
      res.redirect("campgrounds/" + createdData._id);
    }
  });
});

// show a particular campground
app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id, function(err, camp) {
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
app.get("/campgrounds/:id/edit", function(req, res) {
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
app.put("/campgrounds/:id", function(req, res) {
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
app.delete("/campgrounds/:id", function(req, res){
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

// -- end of routes

app.listen(3000, function() {
  console.log("YelpCamp Server is up and running...");
});
