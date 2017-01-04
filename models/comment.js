var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  message: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", commentSchema);
