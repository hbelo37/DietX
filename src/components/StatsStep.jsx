import { useState } from 'react'

const goals = [
  { id: 'lose', label: 'Lose weight', emoji: '🔥' },
  { id: 'muscle', label: 'Gain muscle', emoji: '💪' },
  { id: 'maintain', label: 'Maintain weight', emoji: '⚖️' },
  { id: 'healthy', label: 'Eat healthier', emoji: '🥗' },
  { id: 'energy', label: 'More energy', emoji: '⚡' },
]

export default function StatsStep({ data, onUpdate, onNext }) {
  const [age, setAge] = useState(data.age || '')
  const [gender, setGender] = useState(data.gender || '')
  const [height, setHeight] = useState(data.height || '')
  const [weight, setWeight] = useState(data.weight || '')
  const [goal, setGoal] = useState(data.goal || '')

  const handleNext = () => {
    if (!age || !gender || !height || !weight || !goal) {
      alert('Please fill in all fields')
      return
    }
    onUpdate({ age, gender, height, weight, goal })
    onNext()
  }

  return (
    <div className="card" style={{ padding: '36px 32px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green-light)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Step 1 of 5
        </p>
        <h2 className="font-display" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>
          Tell us about yourself 🌱
        </h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '15px', lineHeight: '1.5' }}>
          Let's start with the basics so we can personalize your plan.
        </p>
      </div>

      {/* Age & Gender */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
            Age
          </label>
          <input
            type="number"
            placeholder="28"
            value={age}
            onChange={e => setAge(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
            Gender
          </label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="input-field"
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Height & Weight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
            Height (cm)
          </label>
          <input
            type="number"
            placeholder="175"
            value={height}
            onChange={e => setHeight(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
            Weight (kg)
          </label>
          <input
            type="number"
            placeholder="70"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Goal */}
      <div style={{ marginBottom: '36px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '12px' }}>
          What's your main goal?
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {goals.map(g => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`pill-btn ${goal === g.id ? 'selected' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{g.emoji}</span> {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleNext}>
          Continue <span>→</span>
        </button>
      </div>
    </div>
  )
}