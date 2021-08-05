import 'reflect-metadata'
import { createConnection, Like } from 'typeorm'
import Store from '../entity/Store'
import express = require('express')
import postValidation from '../validators/stores/postValidation'
import deleteValidation from '../validators/stores/deleteValidation'
import { GetStoresAction } from '../controllers/stores/GetStoresAction'
import { PostStoresAction } from '../controllers/stores/PostStoresAction'

const storesRouter = express.Router()

storesRouter.get('/stores', GetStoresAction)

storesRouter.post('/stores', PostStoresAction)

storesRouter.delete('/stores', function(req, res) {
    return res.status(422).json({message : 'id is required as a url param'})
})

storesRouter.delete('/stores/:id', function(req, res) {
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
})

export {storesRouter}