export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end()
  
    const { meal, reason } = req.body
  
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
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
  
  Do not include any explanation, markdown, or extra text. Only return the JSON object.`
        }],
        temperature: 0.7
      })
    })
  
    const data = await response.json()
    const text = data.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    const newMeal = JSON.parse(clean)
  
    res.status(200).json(newMeal)
  }