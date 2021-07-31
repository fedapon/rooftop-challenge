import express = require('express')
import dotenv = require('dotenv')
import { couponsRouter } from './routes/coupons'
import { storesRouter } from './routes/stores'

dotenv.config()
const app = express()

//middlewares
app.use( express.json() )
app.use( express.urlencoded({extended : false}))

//endPoint => '/coupons'
app.use(couponsRouter)

//endPoint => '/stores'
app.use(storesRouter)

app.listen(process.env.EXPRESS_PORT, function() {
    console.log("Server started")
} )