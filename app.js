const express = require("express"),
      bodyParser = require("body-parser"),
    mongoose     = require("mongoose"),
    seedDB = require("./seeds"),
    User = require("./models/User"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    app = express(),
    flash = require("connect-flash"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

require('dotenv').config();

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false });

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/yelp_camp";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Connected to DB successfully");
    }).catch((err) => {
        console.log('Error connecting to Atlas MongoDB');
        console.log('err:', err);
        
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();  //use this to seed the DB for initial tests.

app.use(require("express-session")({
    secret: "Mia is a cutie pie",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.errorMessages = req.flash("error");
    res.locals.successMessages = req.flash("success");
    next();
 });

app.use(authRoutes); 
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, () => {
    console.log("Yelp Camp App has started!!!!");
});





