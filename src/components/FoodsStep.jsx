import { useState, useCallback } from 'react'

const indianFoods = [
  'Paneer', 'Dal', 'Roti', 'Biryani', 'Rajma', 'Chole',
  'Idli', 'Dosa', 'Sambar', 'Poha', 'Upma', 'Khichdi',
  'Palak Paneer', 'Butter Chicken', 'Tandoori Chicken',
  'Methi', 'Bhindi', 'Moong Dal', 'Chana', 'Paratha'
]

const westernFoods = [
  'Chicken', 'Salmon', 'Eggs', 'Oats', 'Broccoli',
  'Avocado', 'Rice', 'Pasta', 'Greek Yogurt', 'Quinoa'
]

function TagInput({ tags, setTags, placeholder, color }) {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (query) => {
    if (query.length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=6&api_key=${import.meta.env.VITE_USDA_API_KEY}`
      )
      const data = await res.json()
      const foods = data.foods?.map(f => f.description.split(',')[0].trim()) || []
      setResults([...new Set(foods)].slice(0, 6))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    setInput(e.target.value)
    search(e.target.value)
  }

  const addTag = (food) => {
    if (!tags.includes(food) && food.trim()) {
      setTags([...tags, food.trim()])
    }
    setInput('')
    setResults([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) addTag(input.trim())
  }

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag))

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="input-field"
          style={{ paddingRight: loading ? '44px' : '18px' }}
        />
        {loading && (
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{
              width: '16px', height: '16px',
              border: '2px solid var(--green-pale)',
              borderTopColor: 'var(--green-mid)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {results.length > 0 && (
        <div className="dropdown-menu">
          {results.map((food, i) => (
            <button key={i} className="dropdown-item" onClick={() => addTag(food)}>
              <span style={{ marginRight: '8px' }}>🔍</span> {food}
            </button>
          ))}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: color === 'love' ? 'var(--green-pale)' : '#fee2e2',
              color: color === 'love' ? 'var(--green-dark)' : '#991b1b',
              borderRadius: '100px', padding: '6px 14px',
              fontSize: '13px', fontWeight: '500'
            }}>
              {tag}
              <button
                onClick={() => removeTag(tag)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', lineHeight: 1, padding: 0, color: 'inherit', opacity: 0.7 }}
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FoodsStep({ data, onUpdate, onNext, onBack }) {
  const [lovedFoods, setLovedFoods] = useState(data.lovedFoods || [])
  const [dislikedFoods, setDislikedFoods] = useState(data.dislikedFoods || [])
  const [activeTab, setActiveTab] = useState('indian')

  const quickAdd = (food, list, setList) => {
    if (!list.includes(food)) setList([...list, food])
  }

  const handleNext = () => {
    onUpdate({ lovedFoods, dislikedFoods })
    onNext()
  }

  const displayFoods = activeTab === 'indian' ? indianFoods : westernFoods

  return (
    <div className="card" style={{ padding: '36px 32px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green-light)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Step 3 of 5
        </p>
        <h2 className="font-display" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>
          Foods you love & hate
        </h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '15px', lineHeight: '1.5' }}>
          Search any food or pick from quick suggestions below.
        </p>
      </div>

      {/* Love */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '16px' }}>❤️</span> Foods you love
        </label>
        <TagInput
          tags={lovedFoods}
          setTags={setLovedFoods}
          placeholder="Search any food and press Enter..."
          color="love"
        />
      </div>

      {/* Dislike */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ fontSize: '16px' }}>🚫</span> Foods you dislike
        </label>
        <TagInput
          tags={dislikedFoods}
          setTags={setDislikedFoods}
          placeholder="Search any food and press Enter..."
          color="dislike"
        />
      </div>

      {/* Quick picks */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>
            Quick add to loved foods
          </label>
          {/* Tab Toggle */}
          <div style={{
            display: 'flex', gap: '4px',
            background: '#f0f4f1', borderRadius: '100px', padding: '4px'
          }}>
            {['indian', 'western'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '4px 14px', borderRadius: '100px', border: 'none',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                  background: activeTab === tab ? 'var(--green-dark)' : 'transparent',
                  color: activeTab === tab ? 'white' : 'var(--text-mid)',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'indian' ? '🇮🇳 Indian' : '🌍 Western'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {displayFoods.map(food => (
            <button
              key={food}
              onClick={() => quickAdd(food, lovedFoods, setLovedFoods)}
              style={{
                padding: '7px 16px', borderRadius: '100px', border: '1.5px solid',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s ease',
                borderColor: lovedFoods.includes(food) ? 'var(--green-mid)' : '#e8ede9',
                background: lovedFoods.includes(food) ? 'var(--green-pale)' : 'white',
                color: lovedFoods.includes(food) ? 'var(--green-dark)' : 'var(--text-mid)',
                fontWeight: lovedFoods.includes(food) ? '600' : '400'
              }}
            >
              {lovedFoods.includes(food) ? '✓ ' : '+ '}{food}
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