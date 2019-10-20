const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const seedDB = require('./seeds')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const port = process.env.PORT || 8080;
const ip = process.env.IP || "127.0.0.1";

//requiring routes
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
 }).then(() => {
 	console.log('connected to DB');
 }).catch(err => {
 	console.log('Error:', err.message);
 });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//Passport Config
app.use(require("express-session")({
	secret: "Everything you want to know can be found under this section",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, () =>{
	console.log('server listening on port ' + port);
});