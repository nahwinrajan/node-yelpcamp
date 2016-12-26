var mongoose = require('mongoose');

var campgroundSchema = mongoose.Schema({
  name: String,
  description: String,
  rating: Number,
  price: Number,
  image: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Campground", campgroundSchema);
