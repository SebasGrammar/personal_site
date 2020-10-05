const express = require("express"),
    authController = require("../controllers/auth");

const api = express.Router();

api.post("/refresh-access-token", authController.refreshAccessToken)

module.exports = api