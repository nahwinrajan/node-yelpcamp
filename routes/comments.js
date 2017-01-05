var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
//we don't need to specify file name for the middleware due to we used index.js
//index.js is a special file name for node as it treated as entry point when loading files/directory
//anything stated there will be loaded (like if you put import directive there it will follow it)
var middlewareObj     = require('../middleware');

router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, (err, foundCamp) => {
    if(err) {
      console.log(err);
      req.flash("error", "Can't find campground");
      res.redirect("back");
    } else {
      res.render("campgrounds/comments/new", { camp: foundCamp });
    }
  });
});

router.post("/", middlewareObj.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, (err, foundCamp) => {
    if(err) {
      console.log(err);
      req.flash("error", "Can't find campground");
      res.redirect("back");
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
          req.flash("error", "Can't submit comment");
          res.redirect("back");
        } else {
          foundCamp.comments.push(createdComment);
          foundCamp.save();
          req.flash("success", "Comment submitted");
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

// show edit form for comment_id
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err) {
      console.log(err);
      req.flash("error", "Can't find comment");
      res.redirect("/campgrounds/" + req.params.id);
    } else {
      res.render("campgrounds/comments/edit", {comment: foundComment, camp_id: req.params.id});
    }
  });
});

router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
  req.body.comment.message = req.sanitize(req.body.comment.message);

  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      console.log(err);
      req.flash("error", "Can't update comment");
      res.redirect("back");
    } else {
      req.flash("success", "Comment updated");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// delete a particular comments
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedData) {
    if (err) {
      console.log(err);
      req.flash("error", "Can't delete comment");
      res.redirect("back");
    } else {
      req.flash("success", "Comment removed");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
