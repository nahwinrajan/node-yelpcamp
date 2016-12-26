var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");

app.use( bodyParser.urlencoded({extended: true})); //to access element in view/body
app.set("view engine", "ejs");  //set the view engine to ejs

//routes

var campgrounds = [
  { name: "Salmon Creek", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg" },
  { name: "Granite Hill", image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg" },
  { name: "Green Meadow", image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg" },
  { name: "Dawson Creek", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg" },
  { name: "Orange Tree Hill", image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg" },
  { name: "Goat Meadow", image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg" },
];

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/campnew", function(req, res) {
  res.render("campnew");
});

app.post("/campcreate", function(req, res) {
  let name = req.body.name;
  let imgUrl = req.body.imgUrl;
  campgrounds.push({name: name, image: imgUrl});

  res.redirect("campgrounds");
});

app.get("/campgrounds", function(req, res) {
  res.render("campgrounds", {campgrounds: campgrounds});
})

// -- end of routes

app.listen(3000, function() {
  console.log("YelpCamp Server is up and running...");
});
