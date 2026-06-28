function parseMealJson(content) {
  const clean = content.replace(/```json|```/g, '').trim()
  const jsonMatch = clean.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No meal JSON in response')
  return JSON.parse(jsonMatch[0])
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY on server' })
  }

  const { meal, reason } = req.body ?? {}
  if (!meal?.name || !meal?.type || !reason) {
    return res.status(400).json({ error: 'Missing meal or reason' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `You are a diet planner. Replace this meal with a different one.
Meal to replace: "${meal.name}" (type: ${meal.type})
Reason for replacement: "${reason}"

Return ONLY a valid JSON object with exactly these fields:
{
  "name": "meal name",
  "type": "${meal.type}",
  "description": "short description",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "prepTime": number,
  "ingredients": [{"name": "ingredient", "amount": "quantity"}]
}

Do not include any explanation, markdown, or extra text. Only return the JSON object.`,
        }],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'Groq API request failed',
      })
    }

    const text = data.choices?.[0]?.message?.content
    if (!text) return res.status(502).json({ error: 'Empty response from AI' })

    const newMeal = parseMealJson(text)
    return res.status(200).json(newMeal)
  } catch (err) {
    console.error('regenerate-meal error:', err)
    return res.status(500).json({ error: err.message || 'Failed to regenerate meal' })
  }
}
