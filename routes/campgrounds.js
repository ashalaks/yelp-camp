const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

router.get("/", (req, res) => {
    Campground.find((err, campgrounds) => {
        if (!err && campgrounds) {   
            res.render("campgrounds/index", {campgrounds : campgrounds, page: "campgrounds"});
        } else {
            console.log('"Error retriving campgrounds from the DB"');
            console.log('err:', err);
            req.flash("error", "Error retriving campgrounds from the DB. Contact admin");
            res.redirect("back");
        }
    });
    
});

//Additional security before uploading to heroku. Only admins can do this.
//router.get("/new", middleware.isLoggedIn, (req, res) => {
router.get("/new", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
    Campground.findById( req.params.id).populate("comments").exec((err, campground) => {
        if (!err && campground) {
            res.render("campgrounds/show", { campground: campground });
            
        } else {
            console.log("Error retriving campground");
            console.log(err);
            req.flash("error", "Campground not found. Contact admin");
            res.redirect("back");
       }
    });
    
});

//Additional security before uploading to heroku. Only admins can do this.
//router.post("/", middleware.isLoggedIn, (req, res) => {
router.post("/", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Campground.create({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: { id: req.user._id, username: req.user.username }
    }, (err) => {
        if (err) {
            console.log("Error creating campground");
            console.log('err:', err)
            req.flash("error", "Unable to create campground, please contact admin");
        } else {
            req.flash("success","Campground created successfully");
        }
    });
    res.redirect("/campgrounds");
});

//Additional security before uploading to heroku. Only admins can do this.
//router.get("/:id/edit", middleware.isCampgroundOwner, (req, res) => {
router.get("/:id/edit", middleware.isCampgroundOwner, middleware.isAdmin, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (!err && campground) {
            res.render("campgrounds/edit", {campground: campground});
        } else {
            console.log('Error Retriving campground');
            console.log(err);
            req.flash("error",'Error Retriving campground' )
            res.redirect("/campgrounds");
        }   
    });
   
});

//Additional security before uploading to heroku. Only admins can do this.
//router.put("/:id", middleware.isCampgroundOwner, (req, res) => {

router.put("/:id", middleware.isCampgroundOwner, middleware.isAdmin, (req, res) => {
    
    Campground.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            description: req.body.description
        },
        (err) => {
        
            if (err) {
                console.log("Error updating campground");   
                console.log('err:', err);
                req.flash("error", "Error updating campground information. Please contact admin");
                
            }
            res.redirect(`/campgrounds/${req.params.id}`); 
        });
});
//Additional security before uploading to heroku. Only admins can do this.
//router.delete("/:id", middleware.isCampgroundOwner,  (req, res) => {
router.delete("/:id", middleware.isCampgroundOwner, middleware.isAdmin, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campground) => {
        if (err) {
            console.log('Error deleting campground');
            console.log('err:', err);  
            req.flash("error", "Error deleting campground. Please contact admin");
           // res.redirect("/campgrounds");
        } else {
            Comment.deleteMany( {_id: { $in: campground.comments } }, (err) => {
                if (err) {
                    console.log('Error Deleting Comments for Campground');
                    console.log(err);
                    req.flash("error", 'Error Deleting Comments for Campground. Please contact admin');
                }
               // res.redirect("/campgrounds");
            });
            res.redirect("/campgrounds");
        }
        
    });
});


module.exports = router;
