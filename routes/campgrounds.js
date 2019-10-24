const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);

//INDEX - show all campgrounds
router.get("/", (req, res) => {
	
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const desc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		const lat = data[0].latitude;
		const lng = data[0].longitude;
		const location = data[0].formattedAddress;
		const newCampground = {name: name, price: price, image: image, description: desc, location: location, lat: lat, lng: lng, author: author};
		Campground.create(newCampground, (err, newlyCreated) => {
			if(err) {
				console.log(err);
			} else {
				res.redirect("/campgrounds");
			}
		});
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found!");
			return res.redirect("back");
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT - edit a specific campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE - save the edits to the DB
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, udatedCampground) => {
			if(err) {
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});
});

//DELETE route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    })
});

module.exports = router;