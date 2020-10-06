const jwt = require("../services/jwt")
const moment = require("moment")
const User = require("../models/user")

function checkTokenExpiration(token) {
    const { exp } = jwt.decodedToken(token)
    const currentDate = moment.unix()
    return currentDate > exp ? true : false
}

function refreshAccessToken(req, res) {
    const {refreshToken} = req.body
    const hasTokenExpired = checkTokenExpiration(refreshToken)
    
    if (hasTokenExpired) {
        res.status(404).send({message: "refreshToken has expired"})
    } else {
        const {id: _id} = jwt.decodedToken(refreshToken)
        User.findOne({_id}, (error, storedUser) => {
            if (error) {
                res.status(500).send({message: `Server error: ${error}`})
            } else if (!storedUser) {
                res.status(404).send({message: "User has not been found"})
            } else {
                res.status(200).send({
                    accessToken: jwt.createAccessToken(storedUser),
                    refreshToken
                })
            }
        })
    }
}

module.exports = { refreshAccessToken }