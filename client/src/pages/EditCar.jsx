import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBottleById, updateBottle, deleteBottle } from '../services/BottlesAPI'
import { calcPrice } from '../utilities/calprice'
import '../css/EditCar.css'

const COLORS    = ['Matte Black','Navy Blue','Forest Green','Crimson Red','Sunrise Pink','Lemon Yellow','Clear','Transparent Blue']
const SIZES     = ['Small','Medium','Large']
const CAPS      = ['Screw-top','Flip-top','Straw','Sport Cap']
const MATERIALS = ['Plastic','Glass','Aluminum','Stainless Steel']

const COLOR_HEX = {
  'Matte Black':'#1a1a1a','Navy Blue':'#1b3a6b','Forest Green':'#2d5a27',
  'Crimson Red':'#b71c1c','Sunrise Pink':'#f48fb1','Lemon Yellow':'#f9e44a',
  'Clear':'rgba(200,230,255,0.35)','Transparent Blue':'rgba(100,160,255,0.45)',
}

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [bottle, setBottle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getBottleById(id)
      .then(setBottle)
      .catch(() => navigate('/customBottles'))
      .finally(() => setLoading(false))
  }, [id])

  const set = (key, val) => {
    setError('')
    setBottle(prev => ({ ...prev, [key]: val }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!bottle.name.trim()) { setError('Name is required.'); return }
    setSaving(true)
    setError('')
    try {
      const price = calcPrice(bottle)
      await updateBottle(id, { ...bottle, price })
      navigate(`/custombottles/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this bottle?')) return
    setDeleting(true)
    try {
      await deleteBottle(id)
      navigate('/custombottles')
    } catch (err) {
      alert('Delete failed: ' + err.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="edit-loading">Loading…</div>
  if (!bottle)  return null

  const price = calcPrice(bottle)

  return (
    <div className="edit-layout">
      <button className="back-link" onClick={() => navigate(`/custombottles/${id}`)}>← Back to Details</button>
      <h2>Edit Bottle</h2>

      <form className="edit-form" onSubmit={handleUpdate}>
        <div className="field">
          <label>Bottle Name</label>
          <input type="text" value={bottle.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="field">
          <label>Color</label>
          <div className="color-grid">
            {COLORS.map(c => (
              <button key={c} type="button"
                className={`color-swatch ${bottle.color === c ? 'selected' : ''}`}
                style={{ background: COLOR_HEX[c] }}
                title={c}
                onClick={() => set('color', c)}
              >{bottle.color === c && <span className="check">✓</span>}</button>
            ))}
          </div>
          <span className="selected-label">{bottle.color}</span>
        </div>

        <div className="field">
          <label>Size</label>
          <div className="pill-group">
            {SIZES.map(s => <button key={s} type="button" className={`pill ${bottle.size === s ? 'selected' : ''}`} onClick={() => set('size', s)}>{s}</button>)}
          </div>
        </div>

        <div className="field">
          <label>Material</label>
          <div className="pill-group">
            {MATERIALS.map(m => <button key={m} type="button" className={`pill ${bottle.material === m ? 'selected' : ''}`} onClick={() => set('material', m)}>{m}</button>)}
          </div>
        </div>

        <div className="field">
          <label>Cap / Lid Type</label>
          <div className="pill-group">
            {CAPS.map(c => <button key={c} type="button" className={`pill ${bottle.cap_type === c ? 'selected' : ''}`} onClick={() => set('cap_type', c)}>{c}</button>)}
          </div>
        </div>

        <div className="edit-price">Updated price: <strong>${price}</strong></div>

        {error && <p className="error-msg">⚠ {error}</p>}

        <div className="edit-actions">
          <button type="submit" className="save-btn" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          <button type="button" className="del-btn" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete Bottle'}</button>
        </div>
      </form>
    </div>
  )
}

export default EditCar