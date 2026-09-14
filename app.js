if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStratergy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dbUrl=process.env.ATLASDB_URL;

main()
  .then((res) => {
    console.log("Connection Successful");
  }).catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create ({
  mongoUrl: dbUrl,
  crypto: {
    secret : process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions =  {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookies: {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("listings/home.ejs")
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page not found !"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`Listning to port no ${port}`);
});
