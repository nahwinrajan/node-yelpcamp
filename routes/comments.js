var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

router.get("/new", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, (err, foundCamp) => {
    if(err) {
      console.log(err);
      res.send("error encountered");
    } else {
      res.render("campgrounds/comments/new", { camp: foundCamp });
    }
  });
});

router.post("/", isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, (err, foundCamp) => {
    if(err) {
      console.log(err);
      res.send("error encountered");
    } else {
      let comment = {
        message: req.sanitize(req.body.comment.message),
        author: {
          id: req.user._id,
          name: req.user.name
        }
      };

      Comment.create(comment, function (err, createdComment) {
        if (err) {
          console.log(err);
          res.send("error encountered");
        } else {
          foundCamp.comments.push(createdComment);
          foundCamp.save();

          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

// show edit form for comment_id
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err) {
      console.log(err);
      res.redirect("/campgrounds/" + req.params.id);
    } else {
      res.render("campgrounds/comments/edit", {comment: foundComment, camp_id: req.params.id});
    }
  });
});

router.put("/:comment_id", checkCommentOwnership, function(req, res) {
  req.body.comment.message = req.sanitize(req.body.comment.message);

  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      console.log(err);
      res.send("error encountered");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// delete a particular comments
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedData) {
    if (err) {
      console.log(err);
      res.send("error encountered");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/users/signin");
}

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err) {
        console.log(err);
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user.id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("users/signin");
  }
}

module.exports = router;
