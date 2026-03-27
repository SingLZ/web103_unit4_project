import express from 'express'
import { getBottles, getBottleById, createBottle, updateBottle, deleteBottle } from '../controllers/bottleController.js'


const router = express.Router()

// define routes to get, create, edit, and delete items
router.get('/bottles', getBottles)
router.get('/bottles/:id', getBottleById)
router.post('/bottles', createBottle)
router.put('/bottles/:id', updateBottle)
router.delete('/bottles/:id', deleteBottle)

export default router