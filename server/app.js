const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const { API_VERSION } = require("./config");


//

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());



module.exports = app;