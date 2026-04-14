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

const goalLabels = {
  lose: 'Lose weight',
  muscle: 'Gain muscle',
  maintain: 'Maintain weight',
  healthy: 'Eat healthier',
  energy: 'More energy',
}

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

      // Handle both old single goal (string) and new multi goals (array)
      const goalsArray = Array.isArray(data.goals)
        ? data.goals
        : data.goal
          ? [data.goal]
          : []
      const goalsText = goalsArray.map(g => goalLabels[g] || g).join(', ') || 'General health'

      const userProfile = `
        Age: ${data.age}, Gender: ${data.gender}, Height: ${data.height}cm, Weight: ${data.weight}kg
        Goals: ${goalsText}, Activity: ${data.activity}
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
            content: `You are an expert nutritionist and professional chef. Generate a highly varied, creative and detailed 7-day meal plan.

VARIETY RULES - STRICTLY FOLLOW:
- Every single meal across all 7 days must be UNIQUE - never repeat the same dish twice
- Use loved foods in different preparations each day. Example: if they love chicken → Monday=Grilled Chicken Bowl, Tuesday=Chicken Curry, Wednesday=Chicken Stir Fry, Thursday=Lemon Herb Baked Chicken, Friday=Chicken Soup
- Vary cooking styles daily: grilling, baking, stir-frying, steaming, slow cooking, sauteing
- Vary cuisines across the week: Indian, Mediterranean, Asian, Mexican, Middle Eastern, Continental
- Breakfast must never repeat: rotate between egg dishes, porridges, smoothie bowls, parathas, toasts, idli, upma, omelettes, pancakes

GOAL-BASED NUTRITION RULES:
- If goals include "Lose weight": calorie deficit, high fiber, low refined carbs, lean proteins
- If goals include "Gain muscle": calorie surplus, high protein (2g per kg bodyweight), complex carbs around workouts
- If goals include "Maintain weight": balanced macros, maintenance calories
- If goals include "Eat healthier": whole foods, minimal processed ingredients, rich in micronutrients
- If goals include "More energy": complex carbs, iron-rich foods, B-vitamin sources, avoid sugar spikes
- If multiple goals selected, balance the nutrition approach to serve all goals simultaneously

RECIPE RULES - BE VERY SPECIFIC:
- Description must be a clear step-by-step mini recipe of 3-4 sentences
- Always mention exact cooking technique, time and temperature
- Good example: "Heat 10g oil in pan over medium heat. Add 5g minced garlic, sauté 30 seconds. Add 150g chicken breast cubed, season with 3g cumin and 2g paprika, cook 8 minutes until golden. Serve over 120g cooked rice garnished with fresh coriander."
- Bad example (never do this): "Cook chicken with spices and serve with rice"

STRICT MEASUREMENT RULES:
- Use grams for all weighed ingredients: meats, vegetables, grains, dairy, oils, spices, liquids
- Use whole numbers for countable items: eggs ("2 eggs"), roti ("2 rotis"), banana ("1 banana")
- Never use cups, bowls, tablespoons, teaspoons or any volumetric measurement
- Grocery list must follow same rules

IMPORTANT FOR JSON VALIDITY:
- Keep descriptions to max 4 sentences to avoid response cutoff
- Keep ingredient lists to max 7 items per meal
- Return ONLY valid JSON, no extra text before or after

Return ONLY valid JSON in this exact format:
{
  "summary": "2-3 sentence explanation of why this plan works for this person",
  "groceryList": [{"item": "Chicken breast", "amount": "500g"}],
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
          "description": "Step by step cooking instructions here minimum 3 sentences",
          "ingredients": [{"name": "ingredient", "amount": "150g"}],
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
Include breakfast, lunch, dinner and snacks based on meals per day. Strictly avoid disliked foods and allergens. Incorporate loved foods creatively.`
          },
          { role: 'user', content: `Generate a 7-day meal plan for: ${userProfile}` }
        ],
        temperature: 0.8,
        max_tokens: 8000,
      })

      const content = response.choices[0].message.content
      console.log('Raw response:', content)

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          let jsonStr = jsonMatch[0]
          jsonStr = jsonStr
            .replace(/,\s*\]/g, ']')
            .replace(/,\s*\}/g, '}')
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