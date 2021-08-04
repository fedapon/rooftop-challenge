import 'reflect-metadata'
import { createConnection, Like } from 'typeorm'
import Store from '../entity/Store'
import express = require('express')
import postValidation from '../validators/stores/postValidation'
import deleteValidation from '../validators/stores/deleteValidation'

const storesRouter = express.Router()

storesRouter.get('/stores', function(req, res) {
    createConnection().then(async connection => {
        //pagination calculation
        let startItem = 0
        let endItem = 10
        if (req.query.hasOwnProperty('page')) {
            if (Number(req.query.page)>0) {
                startItem = Number(req.query.page) * 10
                endItem = startItem + 10
            }
        }

        //create query if name attribute is present
        let query = {}
        if (req.query.hasOwnProperty('name')) {
            query['name'] = Like('%'+ req.query.name + '%')
        }

        //lets find stores
        let repository = connection.getRepository(Store)
        await repository.find(query)
            .then(data => {
                if (data == undefined) {
                    res.status(200).json({messsaje : 'no data found'})
                }
                let msg = {
                    count : data.length,
                    stores : data.slice(startItem, endItem),
                }
                res.status(200).json(msg)
            })
            .catch(err=> {
                res.status(404).json({message : err.message})
            })

        connection.close()
        return
    })
    .catch(err=> {
        return res.status(404).json({message : err.message})
    })
})

storesRouter.post('/stores', async function(req, res) {
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
        await repository.save(newStore)
            .then(()=> {
                res.status(201).json({message : 'Store successfully created'})
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

storesRouter.delete('/stores', function(req, res) {
    return res.status(422).json({message : 'id is required as a url param'})
})

storesRouter.delete('/stores/:id', async function(req, res) {
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