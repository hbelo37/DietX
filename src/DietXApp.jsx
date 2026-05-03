import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/DietXAuthContext'
import { Login, SignUp } from './components/auth/DietXAuthComponents'
import StatsStep from './components/StatsStep'
import LifestyleStep from './components/LifestyleStep'
import FoodsStep from './components/FoodsStep'
import DietStep from './components/DietStep'
import HealthStep from './components/HealthStep'
import MealPlan from './pages/MealPlan'
import SavedMealPlans from './pages/SavedMealPlans'
import Dashboard from './pages/DietXDashboard'

const steps = ['Stats', 'Lifestyle', 'Foods', 'Diet', 'Health']

function OnboardingWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [mealPlan, setMealPlan] = useState(null)
  const { savePreferences, saveMealPlan } = useAuth()

  const updateFormData = (data) => setFormData(prev => ({ ...prev, ...data }))
  const next = async () => {
    // Save preferences when completing the wizard
    if (currentStep === steps.length - 1) {
      try {
        await savePreferences(formData)
      } catch (err) {
        console.error('Failed to save preferences:', err)
      }
    }
    setCurrentStep(prev => prev + 1)
  }
  const back = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  if (mealPlan) {
    return (
      <MealPlan
        plan={mealPlan}
        onBack={() => {
          setMealPlan(null)
          // Reset wizard to start
          setCurrentStep(0)
          setFormData({})
        }}
        onSave={async () => {
          try {
            const planName = `Meal Plan - ${new Date().toLocaleDateString()}`
            await saveMealPlan(planName, mealPlan)
            navigate('/dashboard', { replace: true })
          } catch (err) {
            console.error('Failed to save meal plan:', err)
            alert('Failed to save your meal plan. Please try again.')
          }
        }}
        formData={formData}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 60%, #52b788 100%)',
        padding: '48px 24px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />

        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.12)', borderRadius: '100px',
            padding: '6px 16px', marginBottom: '20px'
          }}>
            <span style={{ fontSize: '16px' }}>🌿</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: '500' }}>
              AI-Powered Nutrition
            </span>
          </div>
          <h1 className="font-display" style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: '700', color: 'white',
            lineHeight: '1.1', marginBottom: '12px'
          }}>
            ⚡ DietX
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: '1.6' }}>
            Your personalized meal plan, crafted around<br />what you love to eat
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ maxWidth: '600px', margin: '-32px auto 0', padding: '0 16px' }}>
        <div className="card fade-up" style={{ padding: '20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '10px' }}>
            {steps.map((step, i) => (
              <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {i > 0 && (
                    <div style={{
                      flex: 1, height: '2px',
                      background: i <= currentStep ? 'var(--green-light)' : '#e8ede9',
                      transition: 'background 0.4s ease'
                    }} />
                  )}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '600',
                    transition: 'all 0.3s ease',
                    background: i < currentStep ? 'var(--green-light)' : i === currentStep ? 'var(--green-dark)' : '#e8ede9',
                    color: i <= currentStep ? 'white' : 'var(--text-light)',
                    flexShrink: 0
                  }}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1, height: '2px',
                      background: i < currentStep ? 'var(--green-light)' : '#e8ede9',
                      transition: 'background 0.4s ease'
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {steps.map((step, i) => (
              <div key={step} style={{
                flex: 1, textAlign: 'center',
                fontSize: '11px', fontWeight: i === currentStep ? '600' : '400',
                color: i === currentStep ? 'var(--green-dark)' : 'var(--text-light)',
                transition: 'all 0.3s ease'
              }}>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: '600px', margin: '20px auto 40px', padding: '0 16px' }}>
        <div className="fade-up">
          {currentStep === 0 && <StatsStep data={formData} onUpdate={updateFormData} onNext={next} />}
          {currentStep === 1 && <LifestyleStep data={formData} onUpdate={updateFormData} onNext={next} onBack={back} />}
          {currentStep === 2 && <FoodsStep data={formData} onUpdate={updateFormData} onNext={next} onBack={back} />}
          {currentStep === 3 && <DietStep data={formData} onUpdate={updateFormData} onNext={next} onBack={back} />}
          {currentStep === 4 && <HealthStep data={formData} onUpdate={updateFormData} onBack={back} setMealPlan={setMealPlan} />}
        </div>
      </div>
    </div>
  )
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

export default function DietXApp() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingWizard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-plans"
        element={
          <ProtectedRoute>
            <SavedMealPlans />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  )
}