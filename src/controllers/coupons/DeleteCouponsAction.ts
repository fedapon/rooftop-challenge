import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {Request, Response} from "express";
import Coupon from '../../entity/Coupon'
import deleteValidation from '../../validators/coupons/deleteValidation'

export function DeleteCouponsAction(req : Request, res: Response) : Response {
    //validation
    let validationResult = deleteValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        
        repository.findOne({code : req.body.code})
            .then(codeToDelete=>{
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
                repository.delete(codeToDelete)
                    .then(()=>{
                        res.status(201).json({message : 'Code successfully deleted'})
                        connection.close()
                        return
                    })
                    .catch(err=> {
                        res.status(422).json({message : err.message})
                        connection.close()
                        return
                    })

            })
            .catch(err=> {
                res.status(422).json({message : err.message})
                connection.close()
                return
            })
        
    })
    .catch(err=> {
        res.status(422).json({message : err.message})
    })
}