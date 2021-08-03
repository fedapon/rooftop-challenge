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

        //coupons assigned grouped by day
        await repository
                .createQueryBuilder("coupons")
                //.select("DATE_TRUNC('day', coupons.assigned_at) as day, COUNT(coupons.assigned_at)")
                .select("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd') as day, COUNT(coupons.assigned_at)")
                .where("coupons.assigned_at IS NOT NULL")
                .groupBy("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd')")
                .orderBy("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd')", "ASC")
                .getRawMany()
            .then((data)=> {
                msg['coupons_assigned_by_day'] = data
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