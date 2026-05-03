import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/DietXAuthContext'

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-dark)' }
const heroShell = {
  minHeight: '100vh',
  background: 'var(--cream)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
}
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C43.71 39.71 46.98 33.54 46.98 24.55z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.02 0 24c0 3.98.92 7.53 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

const oauthDividerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  margin: '0 0 18px',
}
const oauthDividerLine = { flex: 1, height: '1px', background: '#e8ede9' }

function oauthErrorFromUrl(search, hash) {
  const qp = new URLSearchParams(search)
  const qsErr = qp.get('error_description') || qp.get('error_code') || qp.get('error')
  if (qsErr || qp.has('error')) {
    try {
      return decodeURIComponent((qp.get('error_description') || qsErr || 'Sign-in failed').replace(/\+/g, ' '))
    } catch {
      return qp.get('error_description') || qsErr || 'Sign-in failed'
    }
  }
  const normalized = hash.replace(/^#\??/, '')
  const hp = new URLSearchParams(normalized)
  const hDesc = hp.get('error_description') || hp.get('error_code') || hp.get('error')
  if (!hDesc && !normalized.includes('error')) return ''
  try {
    return decodeURIComponent((hp.get('error_description') || hDesc || 'Sign-in failed').replace(/\+/g, ' '))
  } catch {
    return hp.get('error_description') || hDesc || 'Sign-in failed'
  }
}

const gradientBg = (
  <>
    <div style={{
      position: 'absolute', top: '-80px', right: '-80px',
      width: '280px', height: '280px', borderRadius: '50%',
      background: 'rgba(82, 183, 136, 0.12)',
      pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', bottom: '-60px', left: '-40px',
      width: '200px', height: '200px', borderRadius: '50%',
      background: 'rgba(26, 58, 42, 0.06)',
      pointerEvents: 'none',
    }} />
  </>
)

export function Login() {
  const { user, signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)

  useEffect(() => {
    const fromUrl = oauthErrorFromUrl(location.search, location.hash)
    if (fromUrl) {
      const friendly = /exchange external code/i.test(fromUrl)
        ? `${fromUrl} Usually this means Google OAuth is misconfigured (Supabase Dashboard → Authentication → Providers → Google, and Google Cloud redirect URI must include your Supabase project callback).`
        : fromUrl
      setError((prev) => (prev ? prev : friendly))
    }
    if (location.search || location.hash) {
      navigate({ pathname: '/login', search: '', hash: '' }, { replace: true })
    }
  }, [location.search, location.hash, navigate])

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      const { error: err } = await signIn(email.trim(), password)
      if (err) throw err
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setPending(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGooglePending(true)
    try {
      const { error: err } = await signInWithGoogle()
      if (err) throw err
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
      setGooglePending(false)
    }
  }

  return (
    <div style={heroShell}>
      {gradientBg}
      <div className="card fade-up" style={{ width: '100%', maxWidth: '420px', padding: '40px 36px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--green-pale)', borderRadius: '100px',
          padding: '6px 14px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px' }}>🌿</span>
          <span style={{ color: 'var(--green-mid)', fontSize: '12px', fontWeight: '600' }}>Welcome back</span>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(26px, 5vw, 32px)', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>⚡ DietX</h1>
        <p style={{ color: 'var(--text-mid)', marginBottom: '22px', fontSize: '15px', lineHeight: 1.5 }}>Sign in to save plans and pick up where you left off.</p>

        <button
          type="button"
          disabled={googlePending || pending}
          onClick={handleGoogle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 18px',
            borderRadius: '14px',
            border: '1.5px solid #e8ede9',
            background: 'var(--white)',
            cursor: googlePending || pending ? 'not-allowed' : 'pointer',
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-dark)',
            opacity: googlePending ? 0.85 : 1,
            boxSizing: 'border-box',
          }}
        >
          <GoogleLogo />
          {googlePending ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>

        <div style={{ ...oauthDividerStyle, marginTop: '22px' }}>
          <div style={oauthDividerLine} />
          <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600', flexShrink: 0 }}>or with email</span>
          <div style={oauthDividerLine} />
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" style={{ marginBottom: '16px' }} />

          <label style={labelStyle}>Password</label>
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" style={{ marginBottom: '12px' }} />

          {error && <p style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

          <button type="submit" disabled={pending} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontWeight: '600', marginTop: '4px' }}>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-mid)', fontFamily: 'Georgia, serif' }}>
          Need an account?{' '}
          <Link to="/signup" style={{ color: 'var(--green-mid)', fontWeight: '600' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export function SignUp() {
  const { user, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [googlePending, setGooglePending] = useState(false)
  const [info, setInfo] = useState('')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setPending(true)
    try {
      const { data, error: err } = await signUp(email.trim(), password)
      if (err) throw err
      if (data?.session) {
        navigate('/dashboard', { replace: true })
      } else {
        setInfo('Check your email to confirm your account, then sign in.')
      }
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setPending(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setInfo('')
    setGooglePending(true)
    try {
      const { error: err } = await signInWithGoogle()
      if (err) throw err
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
      setGooglePending(false)
    }
  }

  return (
    <div style={heroShell}>
      {gradientBg}
      <div className="card fade-up" style={{ width: '100%', maxWidth: '420px', padding: '40px 36px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--green-pale)', borderRadius: '100px',
          padding: '6px 14px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px' }}>✨</span>
          <span style={{ color: 'var(--green-mid)', fontSize: '12px', fontWeight: '600' }}>Join DietX</span>
        </div>
        <h1 className="font-display" style={{ fontSize: 'clamp(26px, 5vw, 32px)', fontWeight: '700', color: 'var(--green-dark)', marginBottom: '8px' }}>⚡ DietX</h1>
        <p style={{ color: 'var(--text-mid)', marginBottom: '22px', fontSize: '15px', lineHeight: 1.5 }}>Create an account to save meal plans and preferences.</p>

        <button
          type="button"
          disabled={googlePending || pending}
          onClick={handleGoogle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 18px',
            borderRadius: '14px',
            border: '1.5px solid #e8ede9',
            background: 'var(--white)',
            cursor: googlePending || pending ? 'not-allowed' : 'pointer',
            fontFamily: 'Georgia, serif',
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-dark)',
            opacity: googlePending ? 0.85 : 1,
            boxSizing: 'border-box',
          }}
        >
          <GoogleLogo />
          {googlePending ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>

        <div style={{ ...oauthDividerStyle, marginTop: '22px' }}>
          <div style={oauthDividerLine} />
          <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600', flexShrink: 0 }}>or with email</span>
          <div style={oauthDividerLine} />
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" style={{ marginBottom: '16px' }} />

          <label style={labelStyle}>Password</label>
          <input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="input-field" style={{ marginBottom: '12px' }} />

          {error && <p style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}
          {info && <p style={{ color: 'var(--green-mid)', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{info}</p>}

          <button type="submit" disabled={pending} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontWeight: '600', marginTop: '4px' }}>
            {pending ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-mid)', fontFamily: 'Georgia, serif' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--green-mid)', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
