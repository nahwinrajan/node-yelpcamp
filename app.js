// variables - backend and other app-wide modules
var express         = require('express'),
  app               = express(),
  mongoose          = require('mongoose'),
  path              = require('path'),
  methodOverride    = require('method-override'),
  expressSanitizer  = require('express-sanitizer'),
  bodyParser        = require('body-parser'),
  passport          = require('passport'),
  localStrategy     = require('passport-local').Strategy,
  expressSession    = require('express-session'),
  seedDB            = require('./seeds');

// variables - models
var Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));  // declare public / static asset directory
app.use(bodyParser.urlencoded({extended: true})); // parse html input control and access it in backend code
//methodOverride must be call after bodyParser is called
app.use(methodOverride('_method')); // enable put and delete html verb by overriding post method
app.use(expressSanitizer()); //sanitize user's html encoding input
app.use(expressSession({
  secret: "Dies ist das Geheimnis, das verwendet wird, um das Sitzungs-ID-Cookie zu signieren. Dies kann entweder ein String für ein einzelnes Geheimnis oder ein Array mit mehreren Geheimnissen sein",
  resave: false,
  saveUninitialized: false
}));
//db-config
mongoose.connect("mongodb://localhost/yelpcamp");
// seedDB();

//passport (Auth) config
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ====== ROUTES ======

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

// ===== USERS / AUTHS =====
app.get("/users/signup", (req, res) => {
  res.render("users/signup");
});
//create new user
app.post("/users", (req, res) => {
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

app.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

// log-in logic
app.post("/users/signin", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/signin"
  }), function() {
});

app.get('/users/signout', (req, res) => {
  req.logout();
  console.log("user signed out, redirecting to homepage");
  res.redirect('/');
});
// -- end of routes

// middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect("/signin");
}

app.listen(3000, function() {
  console.log("YelpCamp Server is up and running...");
});
