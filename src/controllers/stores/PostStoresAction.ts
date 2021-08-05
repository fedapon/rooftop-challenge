import 'reflect-metadata'
import { createConnection } from 'typeorm'
import {Request, Response} from "express";
import Store from '../../entity/Store'
import postValidation from '../../validators/stores/postValidation';

export function PostStoresAction(req : Request, res: Response) : Response {
    //validation
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }

    createConnection().then(async connection => {
        let repository = connection.getRepository(Store)
        
        //lets add the new store
        let newStore = {
            name : req.body.name,
            address : req.body.address
        }
        repository.save(newStore)
            .then(()=> {
                res.status(201).json({message : 'Store successfully created'})
                connection.close()
                return
            })
            .catch((err) => {
                res.status(422).json({message : err.message})
                connection.close()
                return
            })
        
    })
    .catch((err) => {
        return res.status(422).json({message : err.message})
    })
}