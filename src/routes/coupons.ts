import 'reflect-metadata'
import { Any, createConnection } from 'typeorm'
import Coupon from '../entity/Coupon'
import express = require('express')
import getValidation from '../validators/coupons/getValidation'
import postValidation from '../validators/coupons/postValidation'
import patchValidation from '../validators/coupons/patchValidation'
import deleteValidation from '../validators/coupons/deleteValidation'


const couponsRouter = express.Router()

couponsRouter.get('/coupons', function(req, res) {
    //validation
    let validationResult = getValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(404).json({message : validationResult.error.details[0].message})
    }
    
    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        //try to find code and email match
        repository.findOne({  code : req.body.code, customerEmail : req.body.customer_email})
            .then(data => {
                if (data == undefined) {
                    res.status(404).json({message : 'Coupon code and email was not found'})
                    connection.close()
                    return
                }
                res.status(200).json({message : 'Coupon and email match was found'})
                connection.close()
                return
            })
            .catch(err => {
                res.status(404).json({message : err.message})
                connection.close()
                return
            })
    }) 
    .catch(err => {
        return res.status(404).json({message : err.message})
    })

})

couponsRouter.post('/coupons', function (req, res) {
    //validation
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }
    
    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        //check if code already exists
        try {
            let searchedCode = await repository.findOne({code : req.body.code})
            if (searchedCode != undefined) {
                res.status(422).json({message : 'Coupon code already exists'})
                connection.close()
                return
            }
        }
        catch (err) {
            res.status(422).json({message : err.message})
            connection.close()
            return
        }

        //lets add the new code to the repository
        let newCoupon = new Coupon
        newCoupon.code = req.body.code
        newCoupon.expiresAt = req.body.expires_at
        
        repository.save(newCoupon)
            .then(()=>{
                res.status(201).json({message : 'Coupon successfully created'})
                connection.close()
                return
            })
            .catch(err => {
                res.status(422).json({message : err.message})
                connection.close()
                return
            })

    })
    .catch(err => {
        res.status(422).json({message : err.message})
    })
    
})

couponsRouter.patch('/coupons', function (req, res) {
    //validation
    let validationResult = patchValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        //check that the email wasn't already used
        try {
            let emailAvailable = await repository.findOne({customerEmail : req.body.customer_email})
            if (emailAvailable) {
                res.status(422).json({message : 'Email has already been used'})
                connection.close()
                return
            }
        }
        catch (err) {
            res.status(422).json({message : err.message})
            connection.close()
            return
        }

        repository.findOne({code : req.body.code})
            .then(codeAvailable=>{
                let currentTime = new Date()
                //check that the code exists and isn't expired
                if ( (codeAvailable == undefined) || 
                    ( (codeAvailable.expiresAt != null) && (codeAvailable.expiresAt < currentTime) ) ) {
                    res.status(422).json({message : 'Coupon is not available'})
                    connection.close()
                    return
                }
                //update de available code with te customer email and timestamp
                codeAvailable.customerEmail = req.body.customer_email
                codeAvailable.assignedAt = currentTime
                //save the entity in database
                repository.save(codeAvailable)
                    .then(() => {
                        res.status(201).json({message : 'Coupon successfully consumed'})
                        connection.close()
                        return
                    })
                    .catch(err => {
                        res.status(422).json({message : err.message})
                        connection.close()
                        return
                    })
            })
            .catch(err=>{
                return res.status(422).json({message : err.message})
            })

    })
    .catch(err => {
        return res.status(422).json({message : err.message})
    })

})

couponsRouter.delete('/coupons', function(req, res) {
    //validation
    let validationResult = deleteValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        let codeToDelete = await repository.findOne({code : req.body.code})

        //check if code exist or has been used by an email
        if (codeToDelete==undefined) {
            res.status(422).json({message : 'Code does not exist'})
            connection.close()
            return
        }
        if (codeToDelete.customerEmail != null) {
            res.status(422).json({message : 'Code has already been used'})
            connection.close()
            return
        }

        //everything checked, let's delete
        await repository.delete(codeToDelete)
            .then(()=>{
                res.status(201).json({message : 'Code successfully deleted'})
            })
            .catch(err=> {
                res.status(422).json({message : err.message})
            })

        connection.close()
        return
    })
    .catch(err=> {
        res.status(422).json({message : err.message})
    })
})

export {couponsRouter}