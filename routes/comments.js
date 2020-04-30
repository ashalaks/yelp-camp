const express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

//==============================================/
//=================COMMENTS Routes=============/

//Additional security before uploading to heroku. Only admins can do this.
//router.get("/new", middleware.isLoggedIn, (req, res) => {
router.get("/new", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {

    Campground.findById(req.params.id)
        .exec((err, campground) => {
            if (!err && campground) {
                res.render("comments/new", {campground: campground});
            } else {
                console.log("Error retrieving campground");
                console.log(err);
                req.flash("Error retriving campgrounds. Please contact admin")
                res.redirect("/campgrounds");
            }

    });
    
});

//Additional security before uploading to heroku. Only admins can do this.
//router.get("/:comment_id/edit", middleware.isCommentOwner, (req, res) => {
router.get("/:comment_id/edit", middleware.isCommentOwner, middleware.isAdmin, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err && !campground) {
            console.log('Error fetching campground from DB');
            console.log('err:', err);
            req.flash("error", "Error fetching campground. Please contact admin");
            return res.redirect("back");
        } 
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (!err && comment) {
                res.render("comments/edit", { campground: campground, comment: comment });
            } else {
                console.log('Error fetching comment from DB');
                console.log('err:', err);
                req.flash("error", "Error fetching comment. Please contact admin");
                return res.redirect("back");
            }
        });
    });
});

//Additional security before uploading to heroku. Only admins can do this.
router.post("/", middleware.isLoggedIn,middleware.isAdmin, (req, res) => {
    
        Campground.findById(req.params.id)
            .then((campground) => {
                Comment.create({ text: req.body.text, author: {id: req.user._id, username: req.user.username  } }).then((comment) => {
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Your comment has been posted. Thank you for your feedback.");
                    res.redirect(`/campgrounds/${campground._id}`);
                }).catch((err) => {
                    console.log("Error creating comment");
                    console.log(err);
                    req.flash("error", "Error creating comment, please contact your admin");
                    res.redirect("/campgrounds");
                });
            }).catch((err) => {
                console.log("Error fetching campground");
                console.log(err);
                req.flash("error", "Error fetching campground from DB. Please contact your admin");
                res.redirect("/campgrounds");
            });
});

//Additional security before uploading to heroku. Only admins can do this.
//router.put("/:comment_id",middleware.isCommentOwner, (req, res) => {
router.put("/:comment_id",middleware.isCommentOwner,middleware.isAdmin, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, { text: req.body.text }, (err, comment) => {
        if (err) {
            console.log('err:', err);
            console.log('Error editing comment');
            req.flash("error", "Error editing comment, please get in touch with your admin");
            res.redirect(`/campgrounds/${req.params.id}`);
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
       }
    });
});

//Additional security before uploading to heroku. Only admins can do this.
router.delete("/:comment_id", middleware.isCommentOwner, middleware.isAdmin, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log('Error deleting comment');
            console.log('err:', err);
            req.flash("error", "Error deleting comment");
            res.redirect(`/campgrounds/${req.params.id}`);
        } else {
            Campground.findByIdAndUpdate(req.params.id,
                {
                    $pull: {comments:req.params.comment_id}
                }, (err, campground) => {
                    if (err) {
                        console.log('Error removing comment from campground array');
                        console.log('err:', err);
                        req.flash("error", "Error deleting comments from campground");
                    }
            });
                
                
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});



module.exports = router;