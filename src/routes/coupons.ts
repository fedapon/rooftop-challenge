import 'reflect-metadata'
import { Any, createConnection } from 'typeorm'
import Coupon from '../entity/Coupon'
import express = require('express')
import newCoupon from '../validators/newCoupon'

const couponsRouter = express.Router()

const connection = createConnection()

couponsRouter.get('/coupons', async function(req, res) {
    let repository = (await connection).getRepository(Coupon)

    if (!(req.query.code && req.query.customer_email)) {
        return res.status(404).json({message : 'code and customer_email fields are required.'})
    }

    let query : any = {
        code : req.query.code,
        customerEmail : req.query.customer_email
    }

    repository.findOne(query)
        .then(data => {
            if (data == undefined) {
                return res.status(404).json({message : 'Coupon code and email were not found.'})
            }
            return res.status(200).json({message : 'Match found.'})
        })
        .catch(err => {
            return res.status(404).json({message : err.message})
        })
})

couponsRouter.post('/coupons', async function (req, res) {
    let result = newCoupon.validate(req.body)
    if (result.error) {
        return res.status(422).json({message : result.error.details[0].message})
    }

    let coupon = new Coupon()
    coupon.code = req.body.code
    if (req.body.expires_at) {
        coupon.expiresAt = req.body.expires_at
    }
    
    let repository = (await connection).getRepository(Coupon)
    repository.save(coupon)
        .then(()=>{
            return res.status(201).json({message : 'Code successfully created'})
        })
        .catch(err => {
            return res.status(422).json({message : err.message})
        })
})

export {couponsRouter}