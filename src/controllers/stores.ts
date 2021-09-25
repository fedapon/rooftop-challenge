import 'reflect-metadata'
import { Like } from 'typeorm'
import { connection } from '../app';
import { Request, Response } from "express";
import Store from '../entity/Store'
import postValidation from '../validators/stores/postValidation';
import deleteValidation from '../validators/stores/deleteValidation';

function errorResponse(res: Response, err: any, status: number) {
    res.status(status).json({ message: err.message })
    return
}

export async function GetStoresAction(req: Request, res: Response) {
    let repository = (await connection).getRepository(Store)

    //pagination calculation
    let startItem = 0
    let endItem = 10
    if (req.query.hasOwnProperty('page')) {
        if (Number(req.query.page) > 0) {
            startItem = Number(req.query.page) * 10
            endItem = startItem + 10
        }
    }

    //create query if name attribute is present
    let query = {}
    if (req.query.hasOwnProperty('name')) {
        query['name'] = Like('%' + req.query.name + '%')
    }

    //lets find stores
    await repository.find(query)
        .then(data => {
            if (data == undefined) {
                res.status(200).json({ messsaje: 'no data found' })
                return
            }
            let msg = {
                count: data.length,
                stores: data.slice(startItem, endItem),
            }
            res.status(200).json(msg)
            return
        })
        .catch((err) => { errorResponse(res, err, 404) })
}


export async function PostStoresAction(req: Request, res: Response) {
    let repository = (await connection).getRepository(Store)
    //validation
    let validationResult = postValidation.validate(req.body)
    if (validationResult.error) {
        return res.status(422).json({ message: validationResult.error.details[0].message })
    }

    //lets add the new store
    let newStore = {
        name: req.body.name,
        address: req.body.address
    }
    await repository.save(newStore)
        .then((data) => {
            let msg = {
                message: 'Store successfully created',
                store: data
            }
            res.status(201).json(msg)
            return
        })
        .catch((err) => { errorResponse(res, err, 404) })
}


export async function DeleteStoresAction(req: Request, res: Response) {
    //validation
    let validationResult = deleteValidation.validate(req.params)
    if (validationResult.error) {
        return res.status(422).json({ message: validationResult.error.details[0].message })
    }

    let repository = (await connection).getRepository(Store)
    let storeToDelete = await repository.findOne(req.params)

    //check if store id exist
    if (storeToDelete == undefined) {
        res.status(422).json({ message: 'Store does not exist' })
        return
    }

    await repository.delete(storeToDelete)
        .then(() => {
            res.status(201).json({ message: 'Store successfully deleted' })
            return
        })
        .catch((err) => { errorResponse(res, err, 404) })
}