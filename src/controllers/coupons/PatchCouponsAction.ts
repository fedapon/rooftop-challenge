import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {Request, Response} from "express";
import Coupon from '../../entity/Coupon'
import patchValidation from '../../validators/coupons/patchValidation'

export function PatchCouponsAction(req : Request, res: Response) : Response {
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
                //check that the code exists, is available and isn't expired
                if ( (codeAvailable == undefined) || 
                    (codeAvailable.customerEmail != null) ||
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

}