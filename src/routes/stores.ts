import 'reflect-metadata'
import { createConnection, Like } from 'typeorm'
import Store from '../entity/Store'
import express = require('express')

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

export {storesRouter}