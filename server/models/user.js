const mongoose = require("mongoose")
const {Schema} = mongoose
const UserSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    active: Boolean
})

module.exports = mongoose.model("User", UserSchema);