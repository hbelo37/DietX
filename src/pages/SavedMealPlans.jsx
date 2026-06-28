import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/DietXAuthContext'
import MealPlan from './MealPlan'

export default function SavedMealPlans() {
  const { getSavedMealPlans, saveMealPlan } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewingPlan, setViewingPlan] = useState(null)

  const loadPlans = useCallback(async () => {
    try {
      const data = await getSavedMealPlans()
      setPlans(data || [])
    } catch (err) {
      console.error('Error loading plans:', err)
    } finally {
      setLoading(false)
    }
  }, [getSavedMealPlans])

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  if (viewingPlan) {
    return (
      <MealPlan
        plan={viewingPlan.plan_data}
        onBack={() => setViewingPlan(null)}
        onSave={async (currentPlan) => {
          const planName = `${viewingPlan.plan_name} (updated ${new Date().toLocaleDateString()})`
          await saveMealPlan(planName, currentPlan)
          await loadPlans()
          setViewingPlan(null)
        }}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 60%, #52b788 100%)',
        padding: '40px 24px',
      }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>
          📋 Your Saved Meal Plans
        </h1>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-mid)', marginBottom: '16px' }}>
              No saved plans yet. Create your first one!
            </p>
            <Link to="/onboarding" className="btn-primary">
              ✨ Create Meal Plan
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {plans.map(plan => (
              <div key={plan.id} style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ color: 'var(--green-dark)', marginBottom: '8px' }}>
                  {plan.plan_name}
                </h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '13px' }}>
                  Created {new Date(plan.created_at).toLocaleDateString()}
                </p>
                <button
                  type="button"
                  onClick={() => setViewingPlan(plan)}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--green-mid)',
                    background: 'white',
                    color: 'var(--green-mid)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  View Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
