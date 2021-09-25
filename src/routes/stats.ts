import express = require('express')
import { GetStatsAction } from '../controllers/stats'

const statsRouter = express.Router()


statsRouter.get('/stats', GetStatsAction)


export {statsRouter}