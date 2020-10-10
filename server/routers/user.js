const express = require("express")
const UserController = require("../controllers/user")
const auth_middleware = require("../middleware/authenticate")
const connect_multiparty = require("connect-multiparty")
const upload_middleware = connect_multiparty({
    uploadDir: "./uploads/avatar"
})

const api = express.Router()

api.post("/signup", UserController.signUp)

api.post("/signin", UserController.signIn)


// middleware to prevent non-admin users to access this url
api.get("/users", [auth_middleware.ensureAuth], UserController.getUsers)
api.get("/active-users", [auth_middleware.ensureAuth], UserController.getActiveUsers)


//
api.get("/upload-avatar", UserController.uploadAvatar)
// api.get("/upload-avatar/lol", UserController.getAvatar)
api.put("/upload-avatar/:id", [auth_middleware.ensureAuth, upload_middleware], UserController.uploadAvatar)

api.get("/get-avatar/:avatarName", UserController.getAvatar)
api.put("/update-user/:id", [auth_middleware.ensureAuth], UserController.updateUser)

module.exports = api