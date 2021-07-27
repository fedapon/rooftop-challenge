import express = require('express')
import dotenv = require('dotenv')

dotenv.config()
const app = express()

//middlewares
app.use( express.json() )
app.use( express.urlencoded({extended : false}))

app.listen(process.env.EXPRESS_PORT, function() {
    console.log("Server started")
} )