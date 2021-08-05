import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {Request, Response} from "express";
import Store from '../../entity/Store'
import deleteValidation from '../../validators/stores/deleteValidation';

export function DeleteStoresAction(req : Request, res: Response) : Response {
    //validation
    let validationResult = deleteValidation.validate(req.params)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    createConnection().then(async connection => {
        let repository = connection.getRepository(Store)
        let storeToDelete = await repository.findOne(req.params)

        //check if store id exist
        if (storeToDelete==undefined) {
            res.status(422).json({message : 'Store does not exist'})
            connection.close()
            return
        }

        await repository.delete(storeToDelete)
            .then(() => {
                res.status(201).json({message : 'Store successfully deleted'})
            })
            .catch((err) => {
                res.status(422).json({message : err.message})
            })

        connection.close()
        return
    })
    .catch((err) => {
        return res.status(422).json({message : err.message})
    })
}