import { Link } from 'react-router-dom'
import { useAuth } from '../context/DietXAuthContext'

export default function DietXDashboard() {
  const { user, signOut } = useAuth()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a3a2a 0%, #2d6a4f 60%, #52b788 100%)',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}>⚡ DietX</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
              {user?.email ? `Signed in as ${user.email}` : 'Dashboard'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              padding: '10px 20px',
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.12)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '20px' }}>Where to next?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          <Link
            to="/onboarding"
            className="btn-primary"
            style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '24px', borderRadius: '16px' }}
          >
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>✨</span>
            <span style={{ fontWeight: '700', fontSize: '17px', color: 'inherit' }}>New meal plan</span>
            <p style={{ marginTop: '8px', fontSize: '13px', opacity: 0.9 }}>Run the wizard and generate a personalized 7-day plan</p>
          </Link>

          <Link
            to="/saved-plans"
            style={{
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              padding: '24px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              color: 'var(--green-dark)',
            }}
          >
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>📋</span>
            <span style={{ fontWeight: '700', fontSize: '17px' }}>Saved plans</span>
            <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-mid)' }}>View plans you&apos;ve saved to your account</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
