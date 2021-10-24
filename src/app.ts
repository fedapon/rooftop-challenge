import express = require('express')
import dotenv = require('dotenv')
import { couponsRouter } from './routes/coupons'
import { storesRouter } from './routes/stores'
import { statsRouter } from './routes/stats'

import { createConnection } from 'typeorm'

dotenv.config()
const app = express()
const connection = createConnection()

//middlewares
app.use( express.json() )
app.use( express.urlencoded({extended : false}))

//endPoint => '/coupons'
app.use(couponsRouter)

//endPoint => '/stores'
app.use(storesRouter)

//endPoint => '/stats'
app.use(statsRouter)


const server = app.listen(process.env.EXPRESS_PORT,function (){
    console.log(`Server started on port: ${process.env.EXPRESS_PORT}`)
})

export {app, server, connection}