const Campground = require("../models/campground"),
      Comment = require("../models/comment");

module.exports = {

    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to login to do that!");
        res.redirect("/login");
    },
    
    isCampgroundOwner: function (req, res, next) {
        if (!req.isAuthenticated()) {
            req.flash("error", "You are not logged in");
            return res.redirect("back");
        }
        Campground.findById(req.params.id, (err, campground) => {
            if (err || !campground) {
                console.log('Error retrieving campground from DB:', err);
                req.flash("error", "Couldn't retrieve campground from the database. Please contact the admin.");
                return res.redirect("back");
            }
            if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that.")
                res.redirect("back");
            }
        });
    
    },
    isCommentOwner: function(req, res, next) {
        if (!req.isAuthenticated()) {
            req.flash("error", "You need to be logged in to do that");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err || !comment) {
                console.log('Could not fetch comment from DB');
                console.log('err:', err);
                req.flash("error", "Could not fetch comment from DB. Please contact your admin");
                return res.redirect("back");
            }
            if (comment.author.id.equals(req.user.id)) {
                next();
            } else {
                req.flash("error", "You are not authorized to do that");
                res.redirect("back");
            }
        });
    },
    isAdmin: function (req, res, next) {
        if (req.user.isAdmin) {
            next();
        } else {
            req.flash("error", "This functionality is available for admin users only. Please get in touch with the site administrator.");
            res.redirect("back");
        }
    }
    
}
    
