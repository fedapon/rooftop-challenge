import express = require('express')
import dotenv = require('dotenv')
import { couponsRouter } from './routes/coupons'
import { storesRouter } from './routes/stores'
import { statsRouter } from './routes/stats'

dotenv.config()
const app = express()


//middlewares
app.use( express.json() )
app.use( express.urlencoded({extended : false}))

//endPoint => '/coupons'
app.use(couponsRouter)

//endPoint => '/stores'
app.use(storesRouter)

//endPoint => '/stats'
app.use(statsRouter)


app.listen(process.env.EXPRESS_PORT)