const express = require("express")
const UserController = require("../controllers/user")

const api = express.Router()

// api.get("/signup", (req, res) => {
//     res.send("there")
// })

api.post("/signup", UserController.signUp)

// api.get("/signup", function(req, res) {
//     res.send("AHHAHHA")
// })

module.exports = api