import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBottle } from '../services/BottlesAPI'
import { calcPrice } from '../utilities/calprice'
import '../css/CreateCar.css'

const COLORS = [
  { label: 'Matte Black',      hex: '#1a1a1a' },
  { label: 'Navy Blue',        hex: '#1b3a6b' },
  { label: 'Forest Green',     hex: '#2d5a27' },
  { label: 'Crimson Red',      hex: '#b71c1c' },
  { label: 'Sunrise Pink',     hex: '#f48fb1' },
  { label: 'Lemon Yellow',     hex: '#f9e44a' },
  { label: 'Clear',            hex: 'rgba(200,230,255,0.25)' },
  { label: 'Transparent Blue', hex: 'rgba(100,160,255,0.35)' },
]

const SIZES     = ['Small', 'Medium', 'Large']
const CAPS      = ['Screw-top', 'Flip-top', 'Straw', 'Sport Cap']
const MATERIALS = ['Plastic', 'Glass', 'Aluminum', 'Stainless Steel']

const SIZE_HEIGHT = { Small: 120, Medium: 155, Large: 190 }
const CAP_SHAPE = {
  'Screw-top': { height: 18, borderRadius: '6px 6px 0 0' },
  'Flip-top':  { height: 28, borderRadius: '4px 4px 0 0' },
  'Straw':     { height: 10, borderRadius: '50% 50% 0 0' },
  'Sport Cap': { height: 22, borderRadius: '10px 10px 0 0' },
}
const MATERIAL_STYLE = {
  'Plastic':         { opacity: 0.82, border: '2px solid rgba(255,255,255,0.4)' },
  'Glass':           { opacity: 0.55, border: '2px solid rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)' },
  'Aluminum':        { opacity: 1,    border: '2px solid rgba(180,180,200,0.6)', background: 'linear-gradient(135deg, var(--bottle-color) 60%, rgba(255,255,255,0.25) 100%)' },
  'Stainless Steel': { opacity: 1,    border: '2px solid rgba(200,200,220,0.8)', background: 'linear-gradient(135deg, var(--bottle-color) 40%, rgba(255,255,255,0.35) 70%, var(--bottle-color) 100%)' },
}

const CreateCar = () => {
  const navigate = useNavigate()
  const [bottle, setBottle] = useState({
    name: '',
    color: 'Navy Blue',
    size: 'Medium',
    cap_type: 'Screw-top',
    material: 'Plastic',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const price = calcPrice(bottle)
  const colorHex = COLORS.find(c => c.label === bottle.color)?.hex ?? '#1b3a6b'
  const bottleHeight = SIZE_HEIGHT[bottle.size]
  const capStyle = CAP_SHAPE[bottle.cap_type]
  const matStyle = MATERIAL_STYLE[bottle.material]

  const set = (key, val) => {
    setError('')
    setBottle(prev => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!bottle.name.trim()) { setError('Please give your bottle a name.'); return }
    setSubmitting(true)
    setError('')
    try {
      await createBottle({ ...bottle, price })
      navigate('/custombottles')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-layout">
      <div className="preview-panel">
        <p className="preview-label">Preview</p>
        <div className="bottle-scene">
          <div className="bottle-cap" style={{
            height: capStyle.height,
            borderRadius: capStyle.borderRadius,
            background: colorHex,
            width: bottle.size === 'Small' ? 38 : bottle.size === 'Medium' ? 46 : 54,
            border: matStyle.border,
            opacity: matStyle.opacity,
          }} />
          <div className="bottle-body" style={{
            '--bottle-color': colorHex,
            height: bottleHeight,
            width: bottle.size === 'Small' ? 60 : bottle.size === 'Medium' ? 74 : 88,
            background: matStyle.background ?? colorHex,
            opacity: matStyle.opacity,
            border: matStyle.border,
            backdropFilter: matStyle.backdropFilter ?? 'none',
          }}>
            {bottle.cap_type === 'Straw' && <div className="straw" />}
          </div>
        </div>
        <div className="price-display">
          <span className="price-tag">${price}</span>
          <span className="price-sub">estimated price</span>
        </div>
        <div className="bottle-summary">
          {bottle.size} · {bottle.material} · {bottle.cap_type}
        </div>
      </div>

      <form className="customize-form" onSubmit={handleSubmit}>
        <h2>Customize Your Bottle</h2>

        <div className="field">
          <label>Bottle Name</label>
          <input type="text" placeholder="e.g. Alpine Flask" value={bottle.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="field">
          <label>Color</label>
          <div className="color-grid">
            {COLORS.map(c => (
              <button key={c.label} type="button"
                className={`color-swatch ${bottle.color === c.label ? 'selected' : ''}`}
                style={{ background: c.hex }} title={c.label}
                onClick={() => set('color', c.label)}>
                {bottle.color === c.label && <span className="check">✓</span>}
              </button>
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

        {error && <p className="error-msg">⚠ {error}</p>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Bottle →'}
        </button>
      </form>
    </div>
  )
}

export default CreateCar