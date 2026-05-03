import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { supabase } from '../lib/dietx-supabase'

const AuthContext = createContext()

function mapFormToPreferenceRow(userId, formData) {
  const n = (v, fallback = 0) => {
    const x = Number(v)
    return Number.isFinite(x) ? x : fallback
  }
  return {
    user_id: userId,
    age: n(formData.age),
    gender: formData.gender ?? '',
    height: n(formData.height),
    weight: n(formData.weight),
    goals: Array.isArray(formData.goals) ? formData.goals : [],
    activity: formData.activity ?? '',
    cooking_time: formData.cookingTime ?? '',
    meals_per_day: n(formData.mealsPerDay, 3),
    loved_foods: Array.isArray(formData.lovedFoods) ? formData.lovedFoods : [],
    disliked_foods: Array.isArray(formData.dislikedFoods) ? formData.dislikedFoods : [],
    diet_type: formData.dietType ?? '',
    allergies: Array.isArray(formData.allergies) ? formData.allergies : [],
    conditions: Array.isArray(formData.conditions) ? formData.conditions : [],
    budget: formData.budget ?? '',
    notes: typeof formData.notes === 'string' ? formData.notes : '',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const savePreferences = useCallback(async (formData) => {
    const u = (await supabase.auth.getUser()).data.user
    if (!u) throw new Error('You must be signed in to save preferences')

    const row = mapFormToPreferenceRow(u.id, formData)
    const { error } = await supabase.from('user_preferences').upsert(row, { onConflict: 'user_id' })
    if (error) throw error
  }, [])

  const saveMealPlan = useCallback(async (planName, planData) => {
    const u = (await supabase.auth.getUser()).data.user
    if (!u) throw new Error('You must be signed in to save a meal plan')

    const { error } = await supabase.from('saved_meal_plans').insert({
      user_id: u.id,
      plan_name: planName,
      plan_data: planData,
    })
    if (error) throw error
  }, [])

  const getSavedMealPlans = useCallback(async () => {
    const u = (await supabase.auth.getUser()).data.user
    if (!u) return []

    const { data, error } = await supabase
      .from('saved_meal_plans')
      .select('id, user_id, plan_name, plan_data, created_at, updated_at')
      .eq('user_id', u.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  }, [])

  const signInWithGoogle = useCallback(() => {
    // Use site root so Vercel always serves SPA + Supabase can finish PKCE / hash recovery before client routes elsewhere.
    const redirectTo = `${window.location.origin}/`
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp: (email, password) => supabase.auth.signUp({ email, password }),
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signInWithGoogle,
      signOut: () => supabase.auth.signOut(),
      savePreferences,
      saveMealPlan,
      getSavedMealPlans,
    }),
    [user, loading, signInWithGoogle, savePreferences, saveMealPlan, getSavedMealPlans]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- pairing hook with AuthProvider is intentional
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}