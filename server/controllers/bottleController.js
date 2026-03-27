import { pool } from '../config/database.js'

const INVALID_COMBOS = [
    { material: 'Stainless Steel', color: 'Clear' },
    { material: 'Stainless Steel', color: 'Transparent Blue' },
    { material: 'Aluminum',        color: 'Clear' },
    { material: 'Aluminum',        color: 'Transparent Blue' },
]

const isInvalidCombo = (material, color) =>
    INVALID_COMBOS.some(c => c.material === material && c.color === color)

export const getBottles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bottles')
        res.json(result.rows)
    } catch (error) {
        console.error('Error fetching bottles:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


 
export const getBottleById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const result = await pool.query('SELECT * FROM bottles WHERE id = $1', [id])
        if (result.rows.length === 0) return res.status(404).json({ error: 'Bottle not found' })
        res.json(result.rows[0])
    } catch (error) {
        console.error('Error fetching bottle:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const createBottle = async (req, res) => {
    const { name, color, size, cap_type, material, price } = req.body
    if (isInvalidCombo(material, color)) {
        return res.status(400).json({
            error: `Metal bottles (${material}) cannot be "${color}" — metal is opaque and can't be clear or transparent.`
        })
    }
    try {
        const result = await pool.query(
            'INSERT INTO bottles (name, color, size, cap_type, material, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, color, size, cap_type, material, price]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error creating bottle:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const updateBottle = async (req, res) => {
    const id  = parseInt(req.params.id)
    const { name, color, size, cap_type, material, price } = req.body
    if (isInvalidCombo(material, color)) {
        return res.status(400).json({
            error: `Metal bottles (${material}) cannot be "${color}" — metal is opaque and can't be clear or transparent.`
        })
    }
    try {
        const result = await pool.query(
            'UPDATE bottles SET name = $1, color = $2, size = $3, cap_type = $4, material = $5, price = $6 WHERE id = $7 RETURNING *',
            [name, color, size, cap_type, material, price, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bottle not found' })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error('Error updating bottle:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export const deleteBottle = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const result = await pool.query('DELETE FROM bottles WHERE id = $1 RETURNING *', [id])
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bottle not found' })
        }
        res.json({ message: 'Bottle deleted successfully' })
    } catch (error) {
        console.error('Error deleting bottle:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}