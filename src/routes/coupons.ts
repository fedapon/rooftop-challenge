import 'reflect-metadata'
import { Any, createConnection } from 'typeorm'
import Coupon from '../entity/Coupon'
import express = require('express')
import getValidation from '../validators/coupons/getValidation'
import postValidation from '../validators/coupons/postValidation'
import patchValidation from '../validators/coupons/patchValidation'
import deleteValidation from '../validators/coupons/deleteValidation'


const couponsRouter = express.Router()

const connection = createConnection()

couponsRouter.get('/coupons', (async function(req, res) {
    //validation
    let validationResult = getValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(404).json({message : validationResult.error.details[0].message})
    }
    
    try {
        let repository = (await connection).getRepository(Coupon)
        //try to find code and email match
        repository.findOne({code : req.body.code, customerEmail : req.body.customer_email})
            .then(data => {
                if (data == undefined) {
                    return res.status(404).json({message : 'Coupon code and email was not found'})
                }
                return res.status(200).json({message : 'Coupon and email match was found'})
            })
            .catch(err => {
                return res.status(404).json({message : err.message})
            })

    } catch (err) {
        return res.status(404).json({message : err.message})
    }

}))

couponsRouter.post('/coupons', async function (req, res) {
    //validation
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }
    
    try {
        let repository = (await connection).getRepository(Coupon)
        
        //check if code already exists
        let searchedCode = await repository.findOne({code : req.body.code})
        if (searchedCode != undefined) {
            return res.status(422).json({message : 'Coupon code already exists'})
        }

        //lets add the new code to the repository
        let coupon : any = {
            code : req.body.code,
            expiresAt : req.body.expires_at
        }
        repository.save(coupon)
            .then(()=>{
                return res.status(201).json({message : 'Coupon successfully created'})
            })
            .catch(err => {
                return res.status(422).json({message : err.message})
            })

    } catch (err) {
        return res.status(422).json({message : err.message})
    }
    
})

couponsRouter.patch('/coupons', async function (req, res) {
    //validation
    let validationResult = patchValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    try {
        let repository = (await connection).getRepository(Coupon)
        //check that the email wasn't already used
        let emailAvailable = await repository.findOne({customerEmail : req.body.customer_email})
        if (emailAvailable) {
            return res.status(422).json({message : 'Email was already been used'})
        }

        //check that the code exists and isn't expired
        let codeAvailable = await repository.findOne({code : req.body.code})
        let currentTime = new Date()
        if ( (codeAvailable == undefined) || 
            ( (codeAvailable.expiresAt != null) && (codeAvailable.expiresAt < currentTime) ) 
            ) {
            return res.status(422).json({message : 'Coupon is not available'})
        }

        codeAvailable.customerEmail = req.body.customer_email
        codeAvailable.assignedAt = currentTime
        repository.save(codeAvailable)
            .then(() => {
                return res.status(201).json({message : 'Coupon successfully consumed'})
            })
            .catch(err => {
                return res.status(422).json({message : err.message})
            })
        }

    catch (err) {
        return res.status(422).json({message : err.message})
    }

})

couponsRouter.delete('/coupons', async function(req, res) {
    //validation
    let validationResult = deleteValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    try {
        let repository = (await connection).getRepository(Coupon)
        let codeToDelete = await repository.findOne({code : req.body.code})

        //check if code exist or has been used by an email
        if (codeToDelete==undefined) {
            return res.status(422).json({message : 'Code does not exist'})
        }
        if (codeToDelete.customerEmail != null) {
            return res.status(422).json({message : 'Code was already been used'})
        }

        //everything checked, let's delete
        repository.delete(codeToDelete)
            .then(()=>{
                return res.status(201).json({message : 'Code successfully deleted'})
            })
            .catch(err=> {
                return res.status(422).json({message : err.message})
            })

    } catch (err) {
        return res.status(422).json({message : err.message})
    }

})

export {couponsRouter}