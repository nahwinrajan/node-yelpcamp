// variables - backend and other app-wide modules
var express         = require('express'),
  app               = express(),
  mongoose          = require('mongoose'),
  path              = require('path'),
  methodOverride    = require('method-override'),
  expressSanitizer  = require('express-sanitizer'),
  bodyParser        = require('body-parser'),
  seedDB            = require('./seeds');

// variables - models
var Campground = require("./models/campground");
var Comment = require("./models/comment");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));  // declare public / static asset directory
app.use(bodyParser.urlencoded({extended: true})); // parse html input control and access it in backend code
//methodOverride must be call after bodyParser is called
app.use(methodOverride('_method')); // enable put and delete html verb by overriding post method
app.use(expressSanitizer()); //sanitize user's html encoding input

//db-config
mongoose.connect("mongodb://localhost/yelpcamp");
// seedDB();

//routes

// ===== CAMPGROUNDS =====
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

// ===== COMMENTS =====
app.get("/campgrounds/:id/comments/new", function(req, res) {
  Campground.findById(req.params.id, (err, camp) => {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/comments/new", {camp: camp});
    }
  });
});

app.post("/campgrounds/:id/comments", function(req, res){
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

// -- end of routes

app.listen(3000, function() {
  console.log("YelpCamp Server is up and running...");
});
