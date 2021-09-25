import express = require('express')
import {
    GetStoresAction,
    PostStoresAction,
    DeleteStoresAction
} from '../controllers/stores'


const storesRouter = express.Router()


storesRouter.get('/stores', GetStoresAction)

storesRouter.post('/stores', PostStoresAction)

storesRouter.delete('/stores', function (req, res) {
    return res.status(422).json({ message: 'id is required as a url param' })
})

storesRouter.delete('/stores/:id', DeleteStoresAction)


export { storesRouter }