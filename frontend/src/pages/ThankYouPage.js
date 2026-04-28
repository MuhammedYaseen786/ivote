import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ThankYouPage() {
  const { voter, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.grid} />
      <div style={styles.container}>
        {/* Checkmark animation */}
        <div style={styles.checkCircle} className="fade-up">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="25" stroke="#10b981" strokeWidth="1.5" fill="rgba(16,185,129,0.08)" />
            <path d="M15 26l8 8 14-14" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="fade-up-delay-1" style={{textAlign:'center'}}>
          <h1 style={styles.title}>Vote Recorded!</h1>
          <p style={styles.name}>{voter?.name}</p>
          <p style={styles.subtitle}>
            Your vote has been securely submitted and counted.<br/>
            Thank you for participating in democracy.
          </p>
        </div>

        {/* Voter ID badge */}
        <div style={styles.badge} className="fade-up-delay-2">
          <span style={styles.badgeLabel}>Voter ID</span>
          <span style={styles.badgeId}>{voter?.voterId}</span>
          <span style={{...styles.badgePill, background:'rgba(16,185,129,0.1)', color:'#10b981', borderColor:'rgba(16,185,129,0.3)'}}>
            ✓ Voted
          </span>
        </div>

        <div style={styles.actions} className="fade-up-delay-3">
          <button className="btn btn-primary" onClick={() => navigate('/results')}>
            View Live Results →
          </button>
          <button className="btn btn-outline" onClick={logout} style={{marginTop: 8}}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(rgba(16,185,129,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.02) 1px, transparent 1px)`,
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: 20, maxWidth: 480, textAlign: 'center' },
  checkCircle: { animation: 'pulse-glow 2s infinite' },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: 500, color: 'var(--accent)', marginBottom: 12, fontFamily: 'var(--font-display)' },
  subtitle: { color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 },
  badge: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '20px 32px',
    display: 'flex', alignItems: 'center', gap: 16,
  },
  badgeLabel: { fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  badgeId: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' },
  badgePill: { fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: '1px solid' },
  actions: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 300 },
};
