const jwt = require("jwt-simple"),
    moment = require("moment");

const SECRET_KEY = "CDU3Mpn2dKkzox1m9OPNB9LzOMnEx8Aol8oDQczA" // MAKE SURE TO HIDE THIS!

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        res.header(403).send({message: "the request doesn't contain an authorization header"})
    }
    const token = req.headers.authorization.replace(/['"]+/g, "")

    try {
        var payload = jwt.decode(token, SECRET_KEY)
        if (payload.exp <= moment.unix()) {
            return res.status(404).send({message: "The token has expired"})
        }
    } catch(ex) {
        return res.status(404).send({message: "Invalid token"})
    }

    req.user = payload
    next()
}