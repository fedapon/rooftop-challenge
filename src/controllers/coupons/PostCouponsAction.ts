import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {Request, Response} from "express";
import Coupon from '../../entity/Coupon'
import postValidation from '../../validators/coupons/postValidation'

export function PostCouponsAction(req : Request, res: Response) : Response {
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
        
    }