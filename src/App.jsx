import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

const initialForm = {
  email: '',
  password: '',
}

function App() {
  const [session, setSession] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [mode, setMode] = useState('signin')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          })
        : await supabase.auth.signUp({
            email: form.email,
            password: form.password,
          })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage(
      mode === 'signin'
        ? 'Signed in successfully.'
        : 'Account created. Check your email if Supabase confirmation is enabled.',
    )
    setForm(initialForm)
    setLoading(false)
  }

  async function handleSignOut() {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signOut()

    setMessage(error ? error.message : 'Signed out.')
    setLoading(false)
  }

  const signedInEmail = session?.user?.email

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">XPS</p>
        <h1>Budget tracking without the noise.</h1>
        <p className="hero-copy">
          Start with auth, land on a simple overview, and build the rest when the
          data model is ready.
        </p>
        <div className="theme-note">
          <span className="swatch light" aria-hidden="true" />
          <span className="swatch dark" aria-hidden="true" />
          <p>Light mode stays white and black. Dark mode switches to orange and black.</p>
        </div>
      </section>

      <section className="card">
        {!session ? (
          <>
            <div className="card-header">
              <div>
                <p className="section-label">Authentication</p>
                <h2>{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() =>
                  setMode((current) => (current === 'signin' ? 'signup' : 'signin'))
                }
              >
                {mode === 'signin' ? 'Need an account?' : 'Already have an account?'}
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </label>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading
                  ? 'Working...'
                  : mode === 'signin'
                    ? 'Sign in'
                    : 'Create account'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="card-header">
              <div>
                <p className="section-label">Overview</p>
                <h2>Signed in</h2>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={handleSignOut}
                disabled={loading}
              >
                Sign out
              </button>
            </div>

            <div className="budget-grid">
              <article className="budget-tile">
                <span>Account</span>
                <strong>{signedInEmail}</strong>
              </article>
              <article className="budget-tile">
                <span>Monthly budget</span>
                <strong>$0.00</strong>
              </article>
              <article className="budget-tile">
                <span>Spent</span>
                <strong>$0.00</strong>
              </article>
            </div>
            <p className="helper-text">
              This is intentionally minimal: auth is live, and the dashboard is just a
              placeholder for the next step.
            </p>
          </>
        )}

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  )
}

export default App
