import 'reflect-metadata'
import { createConnection, Like } from 'typeorm'
import {Request, Response} from "express";
import Store from '../../entity/Store'

export function GetStoresAction(req : Request, res: Response) {
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
        repository.find(query)
            .then(data => {
                if (data == undefined) {
                    res.status(200).json({messsaje : 'no data found'})
                    connection.close()
                    return
                }
                let msg = {
                    count : data.length,
                    stores : data.slice(startItem, endItem),
                }
                res.status(200).json(msg)
                connection.close()
                return
            })
            .catch(err=> {
                res.status(404).json({message : err.message})
                connection.close()
                return
            })

    })
    .catch(err=> {
        return res.status(404).json({message : err.message})
    })
}