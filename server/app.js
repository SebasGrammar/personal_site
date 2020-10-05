const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const { API_VERSION } = require("./config");

// Load routes

const authRoutes = require("./routers/auth")

const userRoutes = require("./routers/user")

const UserController = require("./controllers/user")



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