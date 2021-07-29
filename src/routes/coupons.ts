import 'reflect-metadata'
import { Any, createConnection } from 'typeorm'
import Coupon from '../entity/Coupon'
import express = require('express')

const couponsRouter = express.Router()

const connection = createConnection()

couponsRouter.get('/coupons', async function(req, res) {
    let repository = (await connection).getRepository(Coupon)

    if (!(req.query.code && req.query.customer_email)) {
        res.status(404).json({message : 'code and customer_email fields are required.'})
    }

    let query : any = {
        code : req.query.code,
        customerEmail : req.query.customer_email
    }

    repository.findOne(query)
        .then(data => {
            if (data == undefined) {
                res.status(404).json({message : 'Coupon code and email were not found.'})
            }
            res.status(200).json({message : 'Match found.'})
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({message : err.message})
        })
})

export {couponsRouter}