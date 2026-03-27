import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBottleById, deleteBottle } from '../services/BottlesAPI'
import '../css/CarDetails.css'

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

const SIZE_HEIGHT = { Small: 120, Medium: 155, Large: 190 }

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bottle, setBottle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getBottleById(id)
      .then(setBottle)
      .catch(() => navigate('/custombottles'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Delete this bottle permanently?')) return
    setDeleting(true)
    try {
      await deleteBottle(id)
      navigate('/custombottles')
    } catch (err) {
      alert('Delete failed: ' + err.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="detail-loading">Loading…</div>
  if (!bottle)  return null

  const hex = COLOR_MAP[bottle.color] ?? '#555'
  const bodyH = SIZE_HEIGHT[bottle.size] ?? 155
  const bodyW = bottle.size === 'Small' ? 60 : bottle.size === 'Medium' ? 74 : 88
  const capW  = bodyW * 0.62

  return (
    <div className="detail-layout">
      <button className="back-link" onClick={() => navigate('/custombottles')}>← All Bottles</button>

      <div className="detail-card">
        {/* Visual */}
        <div className="detail-visual">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: capW, height: 20, background: hex, borderRadius: '6px 6px 0 0', border: '2px solid rgba(255,255,255,0.3)' }} />
            <div style={{ width: bodyW, height: bodyH, background: hex, borderRadius: '6px 6px 12px 12px', border: '2px solid rgba(255,255,255,0.25)', opacity: bottle.material === 'Glass' ? 0.55 : 0.9 }} />
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <h2>{bottle.name}</h2>
          <table className="spec-table">
            <tbody>
              <tr><td>Color</td><td><span className="color-dot" style={{ background: hex }} />{bottle.color}</td></tr>
              <tr><td>Size</td><td>{bottle.size}</td></tr>
              <tr><td>Material</td><td>{bottle.material}</td></tr>
              <tr><td>Cap Type</td><td>{bottle.cap_type}</td></tr>
              <tr><td>Price</td><td className="detail-price">${Number(bottle.price).toFixed(2)}</td></tr>
            </tbody>
          </table>

          <div className="detail-actions">
            <button className="edit-btn" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
            <button className="del-btn" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails