const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require('./api/routes/user');
const callRoutes = require('./api/routes/call');
const requestRoutes = require('./api/routes/request');
var admin = require("firebase-admin");
var serviceAccount = require("./wakemeup-fb-account.json");

mongoose.connect(
  process.env.MONGO_URL, { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wakemeup-948d3.firebaseio.com"
});

app.use('/user', userRoutes);
app.use('/call', callRoutes);
app.use('/request', requestRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;