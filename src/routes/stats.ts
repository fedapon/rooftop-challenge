import express = require('express')
import { GetStatsAction } from '../controllers/stats/GetStatsAction'

const statsRouter = express.Router()


statsRouter.get('/stats', GetStatsAction)


export {statsRouter}