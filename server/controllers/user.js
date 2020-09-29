const bcrypt = require("bcrypt-nodejs")
const jwt = require("jwt-simple")
const User = require("../models/user")

// function createUser(object, user) {

//     const { name, lastName, email, password, passwordConfirmation } = object

//     user.name = name
//     user.lastName = lastName
//     user.email = email
//     user.role = "admin"
//     user.active = false
// }

function signUp(req, res) {
    const user = new User()

    const {name, lastName, email, password, passwordConfirmation} = req.body
    // const { email, password, passwordConfirmation } = req.body

    // createUser(req.body, user)

    user.name = name
    user.lastName = lastName
    user.email = email
    user.role = "admin"
    user.active = false

    if (!password || !passwordConfirmation) {
        res.status(404).send({ message: "You must include a password. " })
    } else {
        if (password !== passwordConfirmation) {
            res.status(404).send({ message: "Passwords don't match" })
        } else {
            bcrypt.hash(password, null, null, (error, hash) => {
                if (error) {
                    res.status(500).send({ message: `There was an error when encrypting the password` })
                } else {
                    user.password = hash

                    user.save((error, storedUser) => {
                        if (error) {
                            res.status(500).send({ message: `Server error: ${error}` })
                        } else {
                            if (!storedUser) {
                                res.status(404).send({ message: "There was an error when attempting to create the user" })
                            } else {
                                res.status(200).send({ message: storedUser })
                            }
                        }
                    })


                    // res.status(200).send({message: `The password was created successfully: ${hash}`})
                }
            })
            // res.status(200).send({message: "User has been created."})
        }
    }

    // const {} = req.body
}

module.exports = {
    signUp
}