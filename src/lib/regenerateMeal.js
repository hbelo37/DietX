import Groq from 'groq-sdk'

function parseMealJson(content) {
  const clean = content.replace(/```json|```/g, '').trim()
  const jsonMatch = clean.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No meal JSON in response')
  return JSON.parse(jsonMatch[0])
}

export async function regenerateMeal(meal, reason) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('Missing Groq API key. Add VITE_GROQ_API_KEY to your .env file.')

  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.chat.completions.create({
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
  })

  const text = response.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from AI')

  return parseMealJson(text)
}
