import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {Request, Response} from "express";
import Coupon from '../../entity/Coupon'
import getValidation from '../../validators/coupons/getValidation'

export function GetCouponsAction(req : Request, res: Response) : Response {
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

}