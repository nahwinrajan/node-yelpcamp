var mongoose = require('mongoose');

var campgroundSchema = mongoose.Schema({
  name: String,
  description: String,
  rating: Number,
  price: Number,
  image: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Campground", campgroundSchema);
