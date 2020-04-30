const express = require("express"),
    router = express.Router(),
    User = require("../models/User"),
    passport = require("passport");


router.get("/", (req, res) => {
    res.render("landing");
    
});

//======================================
//=======Auth Routes===============

router.get("/register", (req, res) => {
    res.render("register", {page: "register"});
});

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    if ((process.env.ADMIN_CODE) &&  (req.body.adminCode === process.env.ADMIN_CODE)) {
      newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
           // return res.render("register", {errorMessages: err.message});
        } 
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds"); 
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login", {page: "login"});
});


router.post("/login", function (req, res, next) {
    passport.authenticate("local",
      {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
      })(req, res);
});
  
// router.post("/login", passport.authenticate("local", {
//         successRedirect: "/campgrounds",
//     failureRedirect: "/login",
//     failureFlash: true,
//     successFlash: "Welcome to YelpCamp, " + req.body.username + "!" 
//     }), (req,res) => {

// });
    
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have logged out");
    res.redirect("/campgrounds");
});



module.exports = router;