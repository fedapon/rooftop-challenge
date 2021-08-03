import 'reflect-metadata'
import { createConnection, Not, IsNull} from 'typeorm'
import Coupon from '../entity/Coupon'
import express = require('express')

const statsRouter = express.Router()

statsRouter.get('/stats', function(req, res) {
    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        let msg = {}
        //total amount of coupons in the database
        await repository.find()
            .then((data) => {
                msg['total_coupons'] = data.length    
            })
            .catch((err) => {
                return res.status(422).json({message : err.message})
            })
        
        //amount of assigned coupons   
        await repository.find( {customerEmail : Not(IsNull())} )
            .then((data) => {
                msg['consumed_coupons'] = data.length    
            })
            .catch((err) => {
                return res.status(422).json({message : err.message})
            })

        //amount of available coupons
        await repository.find({customerEmail : IsNull()})
            .then((data) => {
                msg['available_coupons'] = data.length    
            })
            .catch((err) => {
                return res.status(422).json({message : err.message})
            })
        
        connection.close()
        return  res.status(200).json(msg)
    })
    .catch(err => {
        return res.status(422).json({message : err.message})
    })
})

export {statsRouter}