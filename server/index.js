const mongoose = require("mongoose")
const app = require("./app")
const SERVER_PORT = process.env.PORT || 3000
const { API_VERSION, SERVER_IP, DB_PORT } = require("./config")

mongoose.set("useFindAndModify", false)

mongoose.connect(`mongodb://${SERVER_IP}:${DB_PORT}/backend`,

    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },

    (error, res) => {
        if (error) {
            throw error
        } else {
            console.log("You have successfully connected to the database!")
            app.listen(SERVER_PORT, () => {
                console.log(`http://${SERVER_IP}:${SERVER_PORT}/api/${API_VERSION}/`)
            })
        }
    })