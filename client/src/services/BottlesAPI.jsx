export const getBottles = async () => {
    try {
        const response = await fetch('/api/bottles')
        if (!response.ok) {
            throw new Error('Failed to fetch bottles')
        }
        return await response.json()
    } catch (error) {
        console.error('Error fetching bottles:', error)
        throw error
    }
}

export const getBottleById = async (id) => {
    const response = await fetch(`/api/bottles/${id}`)
    if (!response.ok) throw new Error('Failed to fetch bottle')
    return response.json()
}


export const createBottle = async (bottleData) => {
    try {
        const response = await fetch('/api/bottles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bottleData)
        })
        if (!response.ok) {
            throw new Error('Failed to create bottle, not valid combo')
        }
        return await response.json()
    } catch (error) {
        console.error('Error creating bottle:', error)
        throw error
    }
}

export const updateBottle = async (id, bottleData) => {
    try {
        const response = await fetch(`/api/bottles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bottleData)
        })
        if (!response.ok) {
            throw new Error('Failed to update bottle, not valid combo')
        }
        return await response.json()
    } catch (error) {
        console.error('Error updating bottle:', error)
        throw error
    }
}

export const deleteBottle = async (id) => {
    try {
        const response = await fetch(`/api/bottles/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            throw new Error('Failed to delete bottle')
        }
        return await response.json()
    } catch (error) {
        console.error('Error deleting bottle:', error)
        throw error
    }
}