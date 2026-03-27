import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBottles, deleteBottle } from '../services/BottlesAPI'
import '../css/ViewCars.css'

const COLOR_MAP = {
  'Matte Black':      '#1a1a1a',
  'Navy Blue':        '#1b3a6b',
  'Forest Green':     '#2d5a27',
  'Crimson Red':      '#b71c1c',
  'Sunrise Pink':     '#f48fb1',
  'Lemon Yellow':     '#f9e44a',
  'Clear':            'rgba(200,230,255,0.35)',
  'Transparent Blue': 'rgba(100,160,255,0.45)',
}

const BottleChip = ({ color, size }) => {
  const h = size === 'Small' ? 36 : size === 'Medium' ? 46 : 56
  const w = size === 'Small' ? 22 : size === 'Medium' ? 28 : 34
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div style={{ width: w * 0.7, height: 8, background: COLOR_MAP[color] ?? '#555', borderRadius: '3px 3px 0 0', opacity: 0.9 }} />
      <div style={{ width: w, height: h, background: COLOR_MAP[color] ?? '#555', borderRadius: '4px 4px 8px 8px', border: '1.5px solid rgba(255,255,255,0.2)' }} />
    </div>
  )
}

const ViewCars = () => {
  const navigate = useNavigate()
  const [bottles, setBottles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    getBottles()
      .then(setBottles)
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this bottle?')) return
    setDeletingId(id)
    try {
      await deleteBottle(id)
      setBottles(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="view-loading">Loading bottles…</div>

  return (
    <div className="view-layout">
      <div className="view-header">
        <h2>Your Custom Bottles</h2>
        <button className="new-btn" onClick={() => navigate('/')}>+ New Bottle</button>
      </div>

      {bottles.length === 0 ? (
        <div className="empty-state">
          <p>No bottles yet.</p>
          <button className="new-btn" onClick={() => navigate('/')}>Create your first</button>
        </div>
      ) : (
        <div className="bottle-grid">
          {bottles.map(b => (
            <div key={b.id} className="bottle-card" onClick={() => navigate(`/custombottles/${b.id}`)}>
              <div className="card-visual">
                <BottleChip color={b.color} size={b.size} />
              </div>
              <div className="card-info">
                <h3>{b.name}</h3>
                <p>{b.color} · {b.size}</p>
                <p>{b.material} · {b.cap_type}</p>
                <span className="card-price">${Number(b.price).toFixed(2)}</span>
              </div>
              <div className="card-actions">
                <button className="edit-btn" onClick={e => { e.stopPropagation(); navigate(`/edit/${b.id}`) }}>Edit</button>
                <button className="del-btn" onClick={e => handleDelete(e, b.id)} disabled={deletingId === b.id}>
                  {deletingId === b.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewCars