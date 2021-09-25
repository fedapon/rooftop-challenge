import 'reflect-metadata'
import { createConnection, Not, IsNull } from 'typeorm'
import { connection } from '../app';
import { Request, Response } from "express";
import Coupon from '../entity/Coupon'

function errorResponse(res: Response, err: any, status: number) {
    res.status(status).json({ message: err.message })
    return
}

export async function GetStatsAction(req: Request, res: Response) {
    let repository = (await connection).getRepository(Coupon)
    let msg = {}
    //total amount of coupons in the database
    await repository.find()
        .then((data) => {
            msg['totalCoupons'] = data.length
        })
        .catch((err) => { errorResponse(res, err, 422) })

    //amount of assigned coupons   
    await repository.find({ customerEmail: Not(IsNull()) })
        .then((data) => {
            msg['consumedCoupons'] = data.length
        })
        .catch((err) => { errorResponse(res, err, 422) })

    //amount of available coupons
    await repository.find({ customerEmail: IsNull() })
        .then((data) => {
            msg['availableCoupons'] = data.length
        })
        .catch((err) => { errorResponse(res, err, 422) })

    //coupons assigned grouped by day
    await repository
        .createQueryBuilder("coupons")
        .select("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd') as day, COUNT(coupons.assigned_at)")
        .where("coupons.assigned_at IS NOT NULL")
        .groupBy("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd')")
        .orderBy("TO_CHAR(coupons.assigned_at, 'yyyy-mm-dd')", "ASC")
        .getRawMany()
        .then((data) => {
            msg['consumedCouponsByDay'] = data
            res.status(200).json(msg)
            return
        })
        .catch((err) => { errorResponse(res, err, 422) })
}