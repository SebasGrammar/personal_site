const fs = require("fs")
const path = require("path")
const bcrypt = require("bcrypt-nodejs")
const jwt = require("../services/jwt")
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

    console.log("PFFFFFFFFFFFFFF")

    const { name, lastName, email, password, confirmPassword } = req.body
    console.log(req.body)
    // const { email, password, passwordConfirmation } = req.body

    // createUser(req.body, user)

    // user.name = name

    // This goes to the database!
    user.lastName = lastName
    user.email = email.toLowerCase()
    user.role = "admin"
    user.active = false

    if (!password || !confirmPassword) {
        res.status(404).send({ message: "You must include a password. " })
    } else {
        if (password !== confirmPassword) {
            res.status(404).send({ message: "Passwords don't match" })
        } else {
            bcrypt.hash(password, null, null, (error, hash) => {
                if (error) {
                    res.status(500).send({ message: `There was an error when encrypting the password` })
                } else {
                    user.password = hash

                    user.save((error, storedUser) => {
                        if (error) {
                            res.status(500).send({ message: `This user already exists` })
                        } else {
                            if (!storedUser) {
                                res.status(404).send({ message: "There was an error when attempting to create the user" })
                            } else {
                                res.status(200).send({ user })
                            }
                        }
                    })


                    // res.status(200).send({message: `The password was created successfully: ${hash}`}) // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
                }
            })

            // res.status(200).send({message: "User has been created."}) // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        }
    }

    // const {} = req.body

    // TEST BELOW

    // user.save((error, storedUser) => {
    //     if (error) {
    //         console.log(error)
    //         res.status(500).send({ message: `Server error: ${error}` })
    //     } else {
    //         if (!storedUser) {
    //             res.status(404).send({ message: "There was an error when attempting to create the user" })
    //         } else {
    //             res.status(200).send({ message: storedUser })
    //         }
    //     }
    // })
}

function signIn(req, res) {
    const params = req.body

    const email = params.email.toLowerCase()
    const password = params.password

    User.findOne({ email }, (error, storedUser) => {
        if (error) {
            res.status(500).send({ message: `Server error: ${error}` })
        }

        if (!storedUser) {
            res.status(404).send({ message: `User has not been found` })
        } else {
            console.log(storedUser)
            console.log(password)
            bcrypt.compare(password, storedUser.password, (error, check) => {
                if (error) {
                    res.status(500).send({ message: `Server error: ${error}` })
                } else if (!check) {
                    res.status(404).send({ message: `The password in incorrect` })
                }

                else if (!storedUser.active) {
                    res.status(200).send({ message: `This user is not active` })
                } else {
                    res.status(200).send({
                        accessToken: jwt.createAccessToken(storedUser),
                        refreshToken: jwt.createRefreshToken(storedUser)
                    })
                }

            })
        }
    })
}

function getUsers(req, res) {
    User.find().then(users => {
        if (!users) {
            res.status(404).send({ message: "No users have been found" })
        } else {
            res.status(200).send({ users })
        }
    })
}

function getActiveUsers(req, res) {

    const query = req.query

    console.log(query)

    User.find({ active: query.active }).then(users => {
        console.log(`users: ${users}`)
        if (!users) {
            res.status(404).send({ message: "No users have been found" })
        } else {
            res.status(200).send({ users })
        }
    })
}

function uploadAvatar(req, res) {
    const params = req.params

    User.findById({ _id: params.id }, (error, userData) => {
        
        if (error) {
            res.status(500).send({message: `Server error: ${error}`})
        } else if (!userData) {
            res.status(404).send({message: "User has not been found"})
        } else {
            let user = userData
            
            if (req.files) {
                console.log(req.files)
                let filePath = req.files.avatar.path // what a mess... I know I can refactor this shit
                let splitFileName = filePath.split("\\") // this is far from dynamic... what if it's a linux-based op
                let fileName = splitFileName[2]

                console.log(fileName)

                let splitExtension = fileName.split(".")
                let fileExtension = splitExtension[1]

                if (fileExtension !== "jpg" && fileExtension !== "png") {
                    res.status(400).send({message: "File extension not allowed. Make sure you're uploading a jpg or a png image."})
                } else {
                    user.avatar = fileName
                    User.findByIdAndUpdate({_id: params.id}, user, (error, updatedUser) => {
                        if (error) {
                            res.status(500).send({message: `Server error: ${error}`})
                        } else if (!updatedUser) { // this is not even necessary 
                            res.status(404).send({message: "User has not been found"})
                        } else {
                            res.status(200).send({avatar: fileName})
                        }
                    })
                }
            }
        }
    })
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName
    const filePath = `./uploads/avatar/${avatarName}` // put this into an index file

    fs.exists(filePath, exists => { // this is deprecated... use something else
        if (!exists) {
            res.status(404).send({message: "The avatar you're looking for does not exist."})
        } else {
            res.sendFile(path.resolve(filePath))
        }
    })
}

function updateUser(req, res) {
    let userData = req.body
    userData.email = req.body.email.toLowerCase()
    const params = req.params
    
    User.findByIdAndUpdate({
        _id: params.id
    }, userData, (error, updatedUser) => {
        if (error) {
            res.status(500).send({message: `Server error: ${error}`})
        } else if (!updatedUser) {
            res.status(404).send({message: `User has not been found`})
        } else {
            res.status(200).send({message: "User has been updated successfully"})
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getActiveUsers,
    uploadAvatar,
    getAvatar,
    updateUser
}