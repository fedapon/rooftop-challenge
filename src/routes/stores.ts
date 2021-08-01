import 'reflect-metadata'
import { createConnection, Like } from 'typeorm'
import Store from '../entity/Store'
import express = require('express')
import postValidation from '../validators/stores/postValidation'
import deleteValidation from '../validators/stores/deleteValidation'

const storesRouter = express.Router()

const connection = createConnection()

storesRouter.get('/stores', async function(req, res) {
    try {
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
        let repository = (await connection).getRepository(Store)
        repository.find(query)
            .then(data => {
                if (data == undefined) {
                    return res.status(200).json({messsaje : 'no data found'})
                }
                let payload = {
                    count : data.length,
                    stores : data.slice(startItem, endItem),
                }
                return res.status(200).json(payload)
            })
            .catch(err=> {
                return res.status(404).json({message : err.message})
            })

    }
    catch (err) {
        return res.status(404).json({message : err.message})
    }
})

storesRouter.post('/stores', async function(req, res) {
    //validation
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({message : validationResult.error.details[0].message})
    }
    try {
        //lets add the new store
        let newStore = {
            name : req.body.name,
            address : req.body.address
        }
        let repository = (await connection).getRepository(Store)
        repository.save(newStore)
            .then(()=> {
                return res.status(201).json({message : 'Store successfully created'})
            })
            .catch((err) => {
                return res.status(422).json({message : err.message})
            })

    } catch (err) {
        return res.status(422).json({message : err.message})
    }
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
    try {
        let repository = (await connection).getRepository(Store)
        let storeToDelete = await repository.findOne(req.params)

        //check if store id exist
        if (storeToDelete==undefined) {
            return res.status(422).json({message : 'Store does not exist'})
        }

        repository.delete(storeToDelete)
            .then(() => {
                return res.status(201).json({message : 'Store successfully deleted'})
            })
            .catch((err) => {
                return res.status(422).json({message : err.message})
            })

    } catch (err) {
        return res.status(422).json({message : err.message})
    }
})

export {storesRouter}