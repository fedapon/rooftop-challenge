import express = require('express')
import {GetCouponsAction} from '../controllers/coupons/GetCouponsAction'
import {PostCouponsAction} from '../controllers/coupons/PostCouponsAction'
import { PatchCouponsAction } from '../controllers/coupons/PatchCouponsAction'
import { DeleteCouponsAction } from '../controllers/coupons/DeleteCouponsAction'

const couponsRouter = express.Router()

couponsRouter.get('/coupons', GetCouponsAction )

couponsRouter.post('/coupons', PostCouponsAction)

couponsRouter.patch('/coupons', PatchCouponsAction)
 
couponsRouter.delete('/coupons', DeleteCouponsAction)


export {couponsRouter}