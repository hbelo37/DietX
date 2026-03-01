import { useState } from 'react'

const dietTypes = [
  { id: 'none', label: 'No restrictions', emoji: '🍽️', desc: 'I eat everything' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗', desc: 'No meat or fish' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱', desc: 'No animal products' },
  { id: 'keto', label: 'Keto', emoji: '🥑', desc: 'Low carb, high fat' },
  { id: 'paleo', label: 'Paleo', emoji: '🥩', desc: 'Whole foods only' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒', desc: 'Balanced & heart healthy' },
]

const allergies = [
  { id: 'Gluten', emoji: '🌾' },
  { id: 'Dairy', emoji: '🥛' },
  { id: 'Nuts', emoji: '🥜' },
  { id: 'Soy', emoji: '🫘' },
  { id: 'Eggs', emoji: '🥚' },
  { id: 'Shellfish', emoji: '🦐' },
  { id: 'Fish', emoji: '🐟' },
  { id: 'Sesame', emoji: '🌰' },
  { id: 'Corn', emoji: '🌽' },
  { id: 'Wheat', emoji: '🌾' },
]

export default function DietStep({ data, onUpdate, onNext, onBack }) {
  const [dietType, setDietType] = useState(data.dietType || '')
  const [selectedAllergies, setSelectedAllergies] = useState(data.allergies || [])

  const toggleAllergy = (a) => {
    setSelectedAllergies(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  const handleNext = () => {
    if (!dietType) { alert('Please select a diet type'); return }
    onUpdate({ dietType, allergies: selectedAllergies })
    onNext()
  }

  return (
    <div className="card" style={{ padding: '36px 32px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green-light)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Step 4 of 5
        </p>
        <h2 className="font-display" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>
          Dietary restrictions 🌎
        </h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '15px', lineHeight: '1.5' }}>
          Any dietary preferences or allergies we should know about?
        </p>
      </div>

      {/* Diet Type */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '12px' }}>
          Diet type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {dietTypes.map(d => (
            <button
              key={d.id}
              onClick={() => setDietType(d.id)}
              className={`option-btn ${dietType === d.id ? 'selected' : ''}`}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{d.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-dark)', marginBottom: '2px' }}>
                    {d.label}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-mid)' }}>{d.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div style={{ marginBottom: '36px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
          Allergies & intolerances
        </label>
        <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginBottom: '12px' }}>
          Tap all that apply — we'll strictly avoid these.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allergies.map(a => (
            <button
              key={a.id}
              onClick={() => toggleAllergy(a.id)}
              style={{
                padding: '8px 18px', borderRadius: '100px',
                border: '1.5px solid',
                fontSize: '14px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s ease',
                borderColor: selectedAllergies.includes(a.id) ? '#dc2626' : '#e8ede9',
                background: selectedAllergies.includes(a.id) ? '#fee2e2' : 'white',
                color: selectedAllergies.includes(a.id) ? '#991b1b' : 'var(--text-mid)',
                fontWeight: selectedAllergies.includes(a.id) ? '600' : '400'
              }}
            >
              <span>{a.emoji}</span> {a.id}
              {selectedAllergies.includes(a.id) && <span style={{ fontSize: '12px' }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={handleNext}>Continue →</button>
      </div>
    </div>
  )
}