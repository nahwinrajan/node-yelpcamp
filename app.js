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

// variables - ROUTES
var indexRoutes     = require("./routes/index"),
    campgroundRoutes= require("./routes/campgrounds"),
    commentRoutes   = require("./routes/comments"),
    userRoutes      = require("./routes/users");

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
// seedDB();  //populate db with some sample data; todo: update the sample data to incorporate user model and it's association

//passport (Auth) config
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set currentUser local variabel on each route; it will be null if user hasn't been authenticated
app.use(function(req, res, next) {
  // req.user is property set by passport
  // req.locals.variableName => this how we set local variable on view for the route
  res.locals.currentUser = req.user;
  next();
});

// ====== ROUTES ======
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(userRoutes);

app.listen(3000, function() {
  console.log("YelpCamp Server is up and running...");
});
