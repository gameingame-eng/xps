import { useEffect, useState } from 'react'
import './App.css'
import {
  appCopy,
  dashboardStats,
  goalCards,
  insightCards,
  navItems,
  transactionRows,
} from './data/appData'
import { supabase } from './lib/supabase'

const initialForm = {
  email: '',
  password: '',
}

function getPageFromHash() {
  if (typeof window === 'undefined') {
    return 'dashboard'
  }

  const hash = window.location.hash.replace('#', '')
  return navItems.some((item) => item.id === hash) ? hash : 'dashboard'
}

function App() {
  const [session, setSession] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [mode, setMode] = useState('signin')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [activePage, setActivePage] = useState(getPageFromHash)

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

  useEffect(() => {
    function handleHashChange() {
      setActivePage(getPageFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
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

  function handleNavigate(page) {
    window.location.hash = page
    setActivePage(page)
  }

  const signedInEmail = session?.user?.email

  return !session ? (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-top">
          <p className="eyebrow">{appCopy.publicShell.eyebrow}</p>
          <div className="hero-badge">{appCopy.publicShell.badge}</div>
        </div>

        <div className="hero-copy-block">
          <h1>{appCopy.publicShell.headline}</h1>
          <p className="hero-copy">{appCopy.publicShell.copy}</p>
        </div>

        <div className="spotlight-grid" aria-label="Product highlights">
          {appCopy.publicShell.metrics.map((metric) => (
            <article key={metric.label} className="spotlight-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>

        <div className="hero-lower">
          <div className="theme-note">
            <span className="swatch light" aria-hidden="true" />
            <span className="swatch dark" aria-hidden="true" />
            <p>{appCopy.publicShell.themeNote}</p>
          </div>

          <div className="plan-card">
            <p className="section-label">{appCopy.publicShell.planLabel}</p>
            <ul className="plan-list">
              {appCopy.publicShell.planSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="card auth-card">
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

        <div className="side-note">
          <p className="section-label">{appCopy.publicShell.sideNoteLabel}</p>
          <p>{appCopy.publicShell.sideNoteCopy}</p>
        </div>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  ) : (
    <main className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="brand-lockup">
          <p className="eyebrow">{appCopy.workspace.brand}</p>
          <h2>{appCopy.workspace.title}</h2>
          <p className="helper-text">{appCopy.workspace.copy}</p>
        </div>

        <nav className="workspace-nav" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activePage ? 'nav-item active' : 'nav-item'}
              onClick={() => handleNavigate(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <p className="section-label">Account</p>
          <strong>{signedInEmail}</strong>
          <p>{appCopy.workspace.profileCopy}</p>
          <button
            type="button"
            className="ghost-button"
            onClick={handleSignOut}
            disabled={loading}
          >
            Sign out
          </button>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="section-label">Overview</p>
            <h1>{getPageTitle(activePage)}</h1>
          </div>
          <div className="header-meta">
            {appCopy.workspace.headerPills.map((pill) => (
              <div
                key={pill.label}
                className={pill.subtle ? 'header-pill subtle' : 'header-pill'}
              >
                {pill.label}
              </div>
            ))}
          </div>
        </header>

        {activePage === 'dashboard' ? <DashboardPage email={signedInEmail} /> : null}
        {activePage === 'transactions' ? <TransactionsPage /> : null}
        {activePage === 'goals' ? <GoalsPage /> : null}
        {activePage === 'insights' ? <InsightsPage /> : null}

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  )
}

function DashboardPage({ email }) {
  return (
    <div className="page-stack">
      <section className="card intro-band">
        <div>
          <p className="section-label">{appCopy.dashboard.introLabel}</p>
          <h3>{email}</h3>
        </div>
        <p className="helper-text">{appCopy.dashboard.introCopy}</p>
      </section>

      <div className="budget-grid">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="budget-tile">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.detail}</p>
          </article>
        ))}
      </div>

      <section className="card activity-panel">
        <div className="activity-header">
          <div>
            <p className="section-label">{appCopy.dashboard.activityLabel}</p>
            <h3>{appCopy.dashboard.activityTitle}</h3>
          </div>
          <p className="helper-text">{appCopy.dashboard.activityCopy}</p>
        </div>

        <div className="activity-list">
          {appCopy.dashboard.activityFeed.map((item) => (
            <article key={item.title} className="activity-item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <span>{item.amount}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function TransactionsPage() {
  return (
    <div className="page-stack">
      <section className="card split-card">
        <div>
          <p className="section-label">{appCopy.transactions.label}</p>
          <h3>{appCopy.transactions.title}</h3>
        </div>
        <p className="helper-text">{appCopy.transactions.copy}</p>
      </section>

      <section className="card table-card">
        <div className="table-head">
          <span>Merchant</span>
          <span>Category</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        <div className="table-body">
          {transactionRows.map((row) => (
            <article key={`${row.merchant}-${row.date}`} className="table-row">
              <strong>{row.merchant}</strong>
              <span>{row.category}</span>
              <span>{row.date}</span>
              <span>{row.amount}</span>
              <span className="status-chip">{row.status}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function GoalsPage() {
  return (
    <div className="page-stack">
      <section className="card split-card">
        <div>
          <p className="section-label">{appCopy.goals.label}</p>
          <h3>{appCopy.goals.title}</h3>
        </div>
        <p className="helper-text">{appCopy.goals.copy}</p>
      </section>

      <div className="goal-grid">
        {goalCards.map((goal) => (
          <article key={goal.name} className="card goal-card">
            <div>
              <p className="section-label">{goal.progress} funded</p>
              <h3>{goal.name}</h3>
            </div>
            <div className="goal-meter" aria-hidden="true">
              <div className="goal-meter-fill" style={{ width: goal.progress }} />
            </div>
            <strong>{goal.amount}</strong>
            <p className="helper-text">{goal.note}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function InsightsPage() {
  return (
    <div className="page-stack">
      <section className="card split-card">
        <div>
          <p className="section-label">{appCopy.insights.label}</p>
          <h3>{appCopy.insights.title}</h3>
        </div>
        <p className="helper-text">{appCopy.insights.copy}</p>
      </section>

      <div className="insight-grid">
        {insightCards.map((card) => (
          <article key={card.title} className="card insight-card">
            <p className="section-label">Signal</p>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function getPageTitle(page) {
  return navItems.find((item) => item.id === page)?.label ?? 'Dashboard'
}

export default App
