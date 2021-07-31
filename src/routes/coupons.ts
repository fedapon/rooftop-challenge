import 'reflect-metadata'
import { Any, createConnection } from 'typeorm'
import Coupon from '../entity/Coupon'
import express = require('express')
import getValidation from '../validators/coupons/getValidation'
import postValidation from '../validators/coupons/postValidation'
import patchValidation from '../validators/coupons/patchValidation'


const couponsRouter = express.Router()

const connection = createConnection()

couponsRouter.get('/coupons', (async function(req, res) {
    let validationResult = getValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(404).json({message : validationResult.error.details[0].message})
    }
    
    try {
        let query : any = {
            code : req.body.code,
            customerEmail : req.body.customer_email
        }

        let repository = (await connection).getRepository(Coupon)
        //try to find code and email match
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

    } catch (err) {
        return res.status(404).json({message : err.message})
    }

}))

couponsRouter.post('/coupons', async function (req, res) {
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    let coupon = new Coupon()
    coupon.code = req.body.code
    if (req.body.expires_at) {
        coupon.expiresAt = req.body.expires_at
    }
    
    try {
        let repository = (await connection).getRepository(Coupon)
        repository.save(coupon)
            .then(()=>{
                return res.status(201).json({message : 'Code successfully created'})
            })
            .catch(err => {
                return res.status(422).json({message : err.message})
            })

    } catch (err) {
        return res.status(422).json({message : err.message})
    }
    
})

couponsRouter.patch('/coupons', async function (req, res) {
    let validationResult = patchValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    try {
        let repository = (await connection).getRepository(Coupon)
        //check that the email wasn't already used
        let emailAvailable = await repository.findOne({customerEmail : req.body.customer_email})
        if (emailAvailable) {
            return res.status(422).json({message : 'email was already used'})
        }

        //check that the code exists and isn't expired
        let codeAvailable = await repository.findOne({code : req.body.code})
        let currentTime = new Date()
        if ( (codeAvailable == undefined) || 
            ( (codeAvailable.expiresAt != null) && (codeAvailable.expiresAt < currentTime) ) 
            ) {
            return res.status(422).json({message : 'code is not available'})
        }

        codeAvailable.customerEmail = req.body.customer_email
        codeAvailable.assignedAt = currentTime
        repository.save(codeAvailable)
            .then(() => {
                return res.status(201).json({message : 'Code successfully used'})
            })
            .catch(err => {
                return res.status(422).json({message : err.message})
            })
        }

    catch (err) {
        return res.status(422).json({message : err.message})
    }

})

export {couponsRouter}