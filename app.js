const express = require('express');
const pass = 'PassMongo1234DB';
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

//requiring routes
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

mongoose.connect('mongodb+srv://webdev:' + pass + '@clusterwebdev-ikbcq.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
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

app.listen(process.env.PORT, process.env.IP, () =>{
	console.log('server listening on port 3000');
});