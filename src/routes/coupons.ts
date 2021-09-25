import express = require('express')
import { GetCouponsAction,
    PostCouponsAction,
    PatchCouponsAction,
    DeleteCouponsAction
} from '../controllers/coupons'


const couponsRouter = express.Router()

couponsRouter.get('/coupons', GetCouponsAction )

couponsRouter.post('/coupons', PostCouponsAction)

couponsRouter.patch('/coupons', PatchCouponsAction)
 
couponsRouter.delete('/coupons', DeleteCouponsAction)


export {couponsRouter}