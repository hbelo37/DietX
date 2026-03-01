import { useState } from 'react'
import Groq from 'groq-sdk'

const healthConditions = [
  { id: 'Diabetes', emoji: '🩸' },
  { id: 'High blood pressure', emoji: '❤️' },
  { id: 'High cholesterol', emoji: '🫀' },
  { id: 'PCOS', emoji: '🌸' },
  { id: 'IBS', emoji: '🫁' },
  { id: 'Thyroid issues', emoji: '🦋' },
  { id: 'Heart disease', emoji: '💗' },
  { id: 'None', emoji: '✅' },
]

const budgets = [
  { id: 'budget', label: 'Budget-friendly', desc: 'Keep it affordable', emoji: '💰' },
  { id: 'moderate', label: 'Moderate', desc: 'Balance of quality & cost', emoji: '💳' },
  { id: 'nolimit', label: 'No limit', desc: 'Best ingredients, no restrictions', emoji: '✨' },
]

export default function HealthStep({ data, onUpdate, onBack, setMealPlan }) {
  const [conditions, setConditions] = useState(data.conditions || [])
  const [budget, setBudget] = useState(data.budget || '')
  const [notes, setNotes] = useState(data.notes || '')
  const [loading, setLoading] = useState(false)

  const toggleCondition = (c) => {
    if (c === 'None') { setConditions(['None']); return }
    setConditions(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev.filter(x => x !== 'None'), c]
    )
  }

  const generatePlan = async () => {
    if (!budget) { alert('Please select a budget'); return }
    setLoading(true)
    onUpdate({ conditions, budget, notes })

    try {
      const client = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      })

      const userProfile = `
        Age: ${data.age}, Gender: ${data.gender}, Height: ${data.height}cm, Weight: ${data.weight}kg
        Goal: ${data.goal}, Activity: ${data.activity}
        Max cooking time: ${data.cookingTime} mins, Meals per day: ${data.mealsPerDay}
        Foods they love: ${data.lovedFoods?.join(', ') || 'none'}
        Foods they dislike: ${data.dislikedFoods?.join(', ') || 'none'}
        Diet type: ${data.dietType}, Allergies: ${data.allergies?.join(', ') || 'none'}
        Health conditions: ${conditions.join(', ')}, Budget: ${budget}
        Additional notes: ${notes || 'none'}
      `

      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert nutritionist. Generate a personalized 7-day meal plan.
            Return ONLY valid JSON in this exact format with no extra text:
            {
              "summary": "2-3 sentence explanation of why this plan works for this person",
              "groceryList": [{"item": "Chicken breast", "amount": "500g"}, ...]
              "days": [
                {
                  "day": "Monday",
                  "totalCalories": 1800,
                  "protein": 120,
                  "carbs": 180,
                  "fat": 60,
                  "meals": [
                    {
                      "type": "BREAKFAST",
                      "name": "Meal name",
                      "description": "Brief cooking instructions",
                      "ingredients": [{"name": "ingredient name", "amount": "150g"}],
                      "calories": 400,
                      "protein": 30,
                      "carbs": 45,
                      "fat": 12,
                      "prepTime": 10
                    }
                  ],
                  "whyThisWorks": "One sentence explanation for this day"
                }
              ]
            }
              IMPORTANT: Keep descriptions concise (max 20 words each). Keep ingredient lists to max 6 items per meal. This is critical to avoid response cutoff.
              STRICT RULES:
              - Use grams (g) for all ingredients that are weighed: meats, vegetables, grains, dairy, oils, spices, powders, liquids.
              - Use whole numbers (count) for countable items like eggs (e.g. "2 eggs"), roti ("2 rotis"), bread slices ("2 slices"), fruits like banana ("1 banana"), apple ("1 apple").
              - Never use cups, bowls, tablespoons, teaspoons, or any volumetric measurement.
              - Example: "Oats — 80g", "Milk — 150g", "Eggs — 2", "Roti — 2", "Chicken breast — 150g", "Olive oil — 10g", "Banana — 1"
              - Grocery list must follow the same rules.
            Include breakfast, lunch, dinner and snacks based on meals per day. Strictly avoid disliked foods and allergens. Incorporate loved foods.`
            
          },
          { role: 'user', content: `Generate a 7-day meal plan for: ${userProfile}` }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      })

      const content = response.choices[0].message.content
console.log('Raw response:', content)

try {
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    let jsonStr = jsonMatch[0]
    // Fix truncated JSON by removing incomplete last entries
    jsonStr = jsonStr
      .replace(/,\s*\]/, ']')
      .replace(/,\s*\}/, '}')
    const plan = JSON.parse(jsonStr)
    setMealPlan(plan)
  } else {
    throw new Error('No JSON found in response')
  }
} catch (parseErr) {
  console.error('Parse error:', parseErr)
  alert('Error parsing meal plan. Trying again may help!')
}
    } catch (err) {
      console.error('Error generating plan:', err)
      alert('Error generating plan. Please check your Groq API key.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ padding: '36px 32px' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green-light)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Step 5 of 5
        </p>
        <h2 className="font-display" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>
          Almost done! 🎉
        </h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '15px', lineHeight: '1.5' }}>
          Last details to make your plan absolutely perfect.
        </p>
      </div>

      {/* Health Conditions */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
          Health conditions
        </label>
        <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginBottom: '12px' }}>
          We'll tailor your nutrition around these.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {healthConditions.map(c => (
            <button
              key={c.id}
              onClick={() => toggleCondition(c.id)}
              style={{
                padding: '8px 18px', borderRadius: '100px',
                border: '1.5px solid',
                fontSize: '14px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s ease',
                borderColor: conditions.includes(c.id) ? 'var(--green-mid)' : '#e8ede9',
                background: conditions.includes(c.id) ? 'var(--green-pale)' : 'white',
                color: conditions.includes(c.id) ? 'var(--green-dark)' : 'var(--text-mid)',
                fontWeight: conditions.includes(c.id) ? '600' : '400'
              }}
            >
              <span>{c.emoji}</span> {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '12px' }}>
          Weekly grocery budget
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {budgets.map(b => (
            <button
              key={b.id}
              onClick={() => setBudget(b.id)}
              className={`option-btn ${budget === b.id ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>{b.emoji}</span>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-dark)', marginBottom: '2px' }}>
                    {b.label}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-mid)' }}>{b.desc}</p>
                </div>
                {budget === b.id && (
                  <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '36px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
          Anything else? <span style={{ fontWeight: '400', color: 'var(--text-mid)' }}>(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="E.g., I'm training for a marathon, I meal prep on Sundays, I prefer Indian cuisine..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="input-field"
          style={{ resize: 'none', lineHeight: '1.6' }}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          background: 'var(--green-pale)', borderRadius: '16px',
          padding: '20px', marginBottom: '20px', textAlign: 'center'
        }}>
          <p style={{ color: 'var(--green-dark)', fontWeight: '600', marginBottom: '6px' }}>
            🧠 Crafting your personalized plan...
          </p>
          <p style={{ color: 'var(--text-mid)', fontSize: '13px' }}>
            This takes about 10-15 seconds
          </p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-ghost" onClick={onBack} disabled={loading}>← Back</button>
        <button className="btn-primary" onClick={generatePlan} disabled={loading}>
          {loading ? (
            <><div className="spinner" /> Generating...</>
          ) : (
            <>✨ Generate My Plan</>
          )}
        </button>
      </div>
    </div>
  )
}