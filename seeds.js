var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var seeds = [
    {
        name: "Manasasarovar", 
        image: "https://source.unsplash.com/m1PFxGQ-5x0/400x300",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Gomukh", 
        image: "https://source.unsplash.com/0AV7XLABuZk/400x300",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Prayag", 
        image: "https://source.unsplash.com/m1PFxGQ-5x0/400x300",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
async function seedDB(){
    try {
        await Campground.deleteMany({});
        console.log("removed campgrounds!");
        await Comment.deleteMany({});
        console.log("removed comments!");
    
        // for (const seed of seeds) {
        //     let campground = await Campground.create(seed);
        //     console.log("Campground created");
        //     let comment = await Comment.create(
        //         {
        //             text: "This place is great, but I wish there was internet",
        //             author: "Homer"
        //         });
        //     console.log("Comment created");
        //     campground.comments.push(comment);
        //     campground.save();
        //     console.log("Comment added to campground");
        // }
    } catch (err) {
        console.log(err);
    }
}
 
module.exports = seedDB;