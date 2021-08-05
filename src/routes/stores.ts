import express = require('express')
import { GetStoresAction } from '../controllers/stores/GetStoresAction'
import { PostStoresAction } from '../controllers/stores/PostStoresAction'
import { DeleteStoresAction } from '../controllers/stores/DeleteStoresAction'

const storesRouter = express.Router()


storesRouter.get('/stores', GetStoresAction)

storesRouter.post('/stores', PostStoresAction)

storesRouter.delete('/stores', function(req, res) {
    return res.status(422).json({message : 'id is required as a url param'})
})

storesRouter.delete('/stores/:id', DeleteStoresAction)


export {storesRouter}