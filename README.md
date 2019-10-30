# YelpCamp-Website
A Node.js web application project from the Udemy course
# Live Demo
To see the app in action, go to https://pacific-everglades-07067.herokuapp.com/

# Features
* Authentication:

  * User login with username and password

* Authorization:

  * One cannot manage posts and view user profile without being authenticated

  * One cannot edit or delete posts and comments created by other users

* Manage campground posts with basic functionalities:

  * Create, edit and delete posts and comments

  * Upload campground photos

  * Display campground location on Google Maps

  * Search existing campgrounds

* Flash messages responding to users' interaction with the app

* Responsive web design

# Getting Started
This app contains API secrets and passwords that have been hidden deliberately, so the app cannot be run with its features on your local machine. However, feel free to clone this repository if necessary.

## Clone or download this repository
git clone https://github.com/mihaichiciu/yelpcamp-website.git
## Install dependencies
`npm install`
## Comments in code
Some comments in the source code are course notes and therefore might not seem necessary from a developer's point of view.

# Built with
## Front-end
* ejs
* Google Maps APIs
* Bootstrap
## Back-end
* express
* mongoDB
* mongoose
* passport
* passport-local
* express-session
* method-override
* momentJS
* geocoder
* connect-flash
## Platforms
* Heroku
* Cloud9
