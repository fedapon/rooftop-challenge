import 'reflect-metadata'
import { createConnection, Not, IsNull} from 'typeorm'
import {Request, Response} from "express";
import Coupon from '../../entity/Coupon'


export function GetStatsAction(req : Request, res: Response) {
    createConnection().then(async connection => {
        let repository = connection.getRepository(Coupon)
        let msg = {}
        //total amount of coupons in the database
        await repository.find()
            .then((data) => {
                msg['total_coupons'] = data.length    
            })
            .catch((err) => {
                connection.close()
                res.status(422).json({message : err.message})
                return
            })
        
        //amount of assigned coupons   
        await repository.find( {customerEmail : Not(IsNull())} )
            .then((data) => {
                msg['consumed_coupons'] = data.length    
            })
            .catch((err) => {
                connection.close()
                res.status(422).json({message : err.message})
                return
            })

        //amount of available coupons
        await repository.find({customerEmail : IsNull()})
            .then((data) => {
                msg['available_coupons'] = data.length    
            })
            .catch((err) => {
                connection.close()
                res.status(422).json({message : err.message})
                return
            })

        //coupons assigned grouped by day
        repository
                .createQueryBuilder("coupons")
                .select("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd') as day, COUNT(coupons.assigned_at)")
                .where("coupons.assigned_at IS NOT NULL")
                .groupBy("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd')")
                .orderBy("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd')", "ASC")
                .getRawMany()
            .then((data)=> {
                msg['consumed_coupons_by_day'] = data
                connection.close()
                res.status(200).json(msg)
                return  
            })
            .catch((err) => {
                connection.close()
                res.status(422).json({message : err.message})
                return
            })

    })
    .catch(err => {
        return res.status(422).json({message : err.message})
    })
}