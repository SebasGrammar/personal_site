const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const { API_VERSION } = require("./config");

// Load routes

const authRoutes = require("./routers/auth")

const userRoutes = require("./routers/user")

const UserController = require("./controllers/user")

// HEADER

// Configure Header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

//

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Router

app.use(`/api/${API_VERSION}`, authRoutes)
app.use(`/api/${API_VERSION}`, userRoutes)

app.get("/", (req, res) => {
    res.send("LOLL")
})

module.exports = app;