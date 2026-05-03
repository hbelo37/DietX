import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()?.replace(/\/+$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User profile type
export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// User preferences - comprehensive storage for your onboarding data
export interface UserPreferences {
  id: string
  user_id: string
  
  // Stats Step
  age: number
  gender: string
  height: number // cm
  weight: number // kg
  goals: string[] // lose, muscle, maintain, healthy, energy
  
  // Lifestyle Step
  activity: string // sedentary, lightly, moderately, very
  cookingTime: string // 15, 30, 60, 60+
  mealsPerDay: number
  
  // Foods Step
  lovedFoods: string[]
  dislikedFoods: string[]
  
  // Diet Step
  dietType: string // none, vegetarian, vegan, keto, paleo, mediterranean
  allergies: string[]
  
  // Health Step
  conditions: string[] // health conditions
  budget: string // budget, moderate, nolimit
  notes: string
  
  created_at: string
  updated_at: string
}

// Saved meal plans
export interface SavedMealPlan {
  id: string
  user_id: string
  plan_name: string
  plan_data: any // Your meal plan JSON
  created_at: string
  updated_at: string
}