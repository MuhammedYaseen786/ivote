import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [voterId, setVoterId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, voter } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  if (voter) {
    if (voter.hasVoted) navigate('/results');
    else navigate('/vote');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const v = await login(name.trim(), voterId.trim());
      if (v.hasVoted) navigate('/results');
      else navigate('/vote');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.grid} />

      <div style={styles.container}>
        {/* Logo / Brand */}
        <div className="fade-up" style={styles.brand}>
          <div style={styles.logoBox}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="#4f8ef7" strokeWidth="1.5" fill="rgba(79,142,247,0.1)" />
              <path d="M9 14L12.5 17.5L19 11" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={styles.logoText}>iVOTE</span>
        </div>

        <div className="card fade-up-delay-1" style={styles.card}>
          <h1 style={styles.title}>Cast Your Vote</h1>
          <p style={styles.subtitle}>Enter your credentials to access the ballot</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Voter ID</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. VTR-00123"
                value={voterId}
                onChange={e => setVoterId(e.target.value.toUpperCase())}
                required
                style={{ letterSpacing: '0.05em', fontWeight: 500 }}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8, padding: '16px' }}
              disabled={loading}
            >
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Verifying...</> : 'Enter Voting Booth →'}
            </button>
          </form>

          <p style={styles.hint}>
            Only registered voters can participate.<br />
            Contact your administrator if you have issues.
          </p>
        </div>

        <a href="/results" style={styles.resultsLink} className="fade-up-delay-2">
          View live results →
        </a>

        <a href="/admin" style={styles.adminLink} className="fade-up-delay-3">
          Admin panel
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  container: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBox: {
    width: 48,
    height: 48,
    background: 'rgba(79,142,247,0.08)',
    border: '1px solid rgba(79,142,247,0.2)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  card: {
    width: '100%',
    padding: '36px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: 'var(--text)',
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--muted)',
    marginBottom: 28,
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--muted)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  hint: {
    fontSize: 12,
    color: 'var(--muted)',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 1.6,
  },
  resultsLink: {
    color: 'var(--accent)',
    fontSize: 14,
    textDecoration: 'none',
    fontWeight: 500,
  },
  adminLink: {
    color: 'var(--muted)',
    fontSize: 13,
    textDecoration: 'none',
  },
};
