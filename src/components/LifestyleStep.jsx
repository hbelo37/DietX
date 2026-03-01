import { useState } from 'react'

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise', emoji: '🪑' },
  { id: 'lightly', label: 'Lightly active', desc: 'Light walks, 1-2x/week', emoji: '🚶' },
  { id: 'moderately', label: 'Moderately active', desc: 'Exercise 3-4x/week', emoji: '🏃' },
  { id: 'very', label: 'Very active', desc: 'Intense exercise 5-6x/week', emoji: '💪' },
]

const cookingTimes = [
  { id: '15', label: '< 15 min', emoji: '⚡', desc: 'Super quick' },
  { id: '30', label: '15–30 min', emoji: '🍳', desc: 'Fairly quick' },
  { id: '60', label: '30–60 min', emoji: '👨‍🍳', desc: 'Moderate' },
  { id: '60+', label: '60+ min', emoji: '🎯', desc: 'I love cooking' },
]

export default function LifestyleStep({ data, onUpdate, onNext, onBack }) {
  const [activity, setActivity] = useState(data.activity || '')
  const [cookingTime, setCookingTime] = useState(data.cookingTime || '')
  const [mealsPerDay, setMealsPerDay] = useState(data.mealsPerDay || '3')

  const handleNext = () => {
    if (!activity || !cookingTime) {
      alert('Please fill in all fields')
      return
    }
    onUpdate({ activity, cookingTime, mealsPerDay })
    onNext()
  }

  return (
    <div className="card" style={{ padding: '36px 32px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green-light)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Step 2 of 5
        </p>
        <h2 className="font-display" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>
          Your lifestyle 🏠
        </h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '15px', lineHeight: '1.5' }}>
          How active are you and how much time do you have to cook?
        </p>
      </div>

      {/* Activity Level */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '12px' }}>
          Activity level
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activityLevels.map(a => (
            <button
              key={a.id}
              onClick={() => setActivity(a.id)}
              className={`option-btn ${activity === a.id ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>{a.emoji}</span>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-dark)', marginBottom: '2px' }}>
                    {a.label}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-mid)' }}>{a.desc}</p>
                </div>
                {activity === a.id && (
                  <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cooking Time */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '12px' }}>
          Max cooking time per meal
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {cookingTimes.map(t => (
            <button
              key={t.id}
              onClick={() => setCookingTime(t.id)}
              className={`option-btn ${cookingTime === t.id ? 'selected' : ''}`}
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '22px' }}>{t.emoji}</span>
                <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-dark)' }}>{t.label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-mid)' }}>{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Meals Per Day */}
      <div style={{ marginBottom: '36px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '12px' }}>
          Meals per day
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['2', '3', '4', '5'].map(n => (
            <button
              key={n}
              onClick={() => setMealsPerDay(n)}
              className={`pill-btn ${mealsPerDay === n ? 'selected' : ''}`}
              style={{ minWidth: '80px', textAlign: 'center' }}
            >
              {n} meals
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