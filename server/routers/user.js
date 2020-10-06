const express = require("express")
const UserController = require("../controllers/user")
const auth_middleware = require("../middleware/authenticate")

const api = express.Router()

api.post("/signup", UserController.signUp)

api.post("/signin", UserController.signIn)


// middleware to prevent non-admin users to access this url
api.get("/users", [auth_middleware.ensureAuth], UserController.getUsers)
api.get("/active-users", [auth_middleware.ensureAuth], UserController.getActiveUsers)

module.exports = api