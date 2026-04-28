import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const { voter, logout, setVoter } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/candidates')
      .then(res => setCandidates(res.data))
      .catch(() => setError('Failed to load candidates'))
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async () => {
    if (!selected) return;
    setVoting(true);
    setError('');
    try {
      await API.post('/vote', { candidateId: selected });
      setVoter(v => ({ ...v, hasVoted: true }));
      navigate('/thankyou');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote.');
      setVoting(false);
    }
  };

  const selectedCandidate = candidates.find(c => c._id === selected);

  return (
    <div style={styles.page}>
      <div style={styles.grid} />

      <div style={styles.layout}>
        {/* Header */}
        <header style={styles.header} className="fade-up">
          <div style={styles.headerLeft}>
            <span style={styles.logo}>iVOTE</span>
            <span style={styles.electionTag}>General Election</span>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.voterBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {voter?.name}
            </span>
            <button className="btn btn-outline" style={{padding:'8px 14px',fontSize:13}} onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        {/* Title section */}
        <div style={styles.titleSection} className="fade-up-delay-1">
          <h1 style={styles.title}>Select Your Candidate</h1>
          <p style={styles.subtitle}>Choose one candidate. Your vote is final and cannot be changed.</p>
        </div>

        {/* Candidates grid */}
        {loading ? (
          <div style={styles.centerLoad}><div className="spinner" style={{width:36,height:36}} /></div>
        ) : candidates.length === 0 ? (
          <div style={{textAlign:'center',color:'var(--muted)',padding:'60px 0'}}>No candidates have been added yet.</div>
        ) : (
          <div style={styles.grid2} className="fade-up-delay-2">
            {candidates.map((c, i) => (
              <div
                key={c._id}
                style={{
                  ...styles.card,
                  borderColor: selected === c._id ? c.color || 'var(--accent)' : 'var(--border)',
                  background: selected === c._id ? `${c.color || '#4f8ef7'}0d` : 'var(--surface)',
                  animationDelay: `${i * 0.08}s`,
                }}
                className="fade-up"
                onClick={() => setSelected(c._id)}
              >
                {/* Avatar */}
                <div style={{...styles.avatar, background: `${c.color || '#4f8ef7'}22`, borderColor: `${c.color || '#4f8ef7'}44`}}>
                  <span style={{...styles.avatarText, color: c.color || 'var(--accent)'}}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div style={styles.cardBody}>
                  <div style={styles.candidateName}>{c.name}</div>
                  <div style={{...styles.party, color: c.color || 'var(--accent)'}}>{c.party}</div>
                  {c.position && <div style={styles.position}>{c.position}</div>}
                  {c.bio && <p style={styles.bio}>{c.bio}</p>}
                </div>

                {/* Radio indicator */}
                <div style={{
                  ...styles.radio,
                  borderColor: selected === c._id ? c.color || 'var(--accent)' : 'var(--border)',
                  background: selected === c._id ? c.color || 'var(--accent)' : 'transparent',
                }}>
                  {selected === c._id && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom vote bar */}
        <div style={{
          ...styles.voteBar,
          opacity: selected ? 1 : 0,
          transform: selected ? 'translate(-50%, 0)' : 'translate(-50%, 20px)',
          pointerEvents: selected ? 'auto' : 'none'
        }}>
          <span style={styles.selectedInfo}>
            {selectedCandidate && <>You selected: <strong>{selectedCandidate.name}</strong> — {selectedCandidate.party}</>}
          </span>
          {error && <span style={{color:'#fca5a5',fontSize:14}}>{error}</span>}
          <button
            className="btn"
            style={{
              padding:'14px 32px',
              background: 'white',
              color: '#4f46e5',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              animation: selected ? 'pulse-glow 2s infinite' : 'none',
              borderRadius: '12px'
            }}
            onClick={handleVote}
            disabled={!selected || voting}
          >
            {voting ? <><div className="spinner" style={{width:18,height:18,borderTopColor:'#4f46e5'}} /> Submitting...</> : 'Confirm Vote →'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', position: 'relative' },
  grid: {
    position: 'fixed', inset: 0,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  layout: { maxWidth: 960, margin: '0 auto', padding: '24px 20px 120px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  logo: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' },
  electionTag: { background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  voterBadge: { display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14 },
  titleSection: { marginBottom: 40 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 },
  centerLoad: { display: 'flex', justifyContent: 'center', padding: '80px 0' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: {
    padding: '24px', borderRadius: 'var(--radius)', border: '1px solid',
    cursor: 'pointer', transition: 'all 0.2s ease',
    display: 'flex', flexDirection: 'column', gap: 16, position: 'relative',
  },
  avatar: { width: 60, height: 60, borderRadius: 16, border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 },
  cardBody: { flex: 1 },
  candidateName: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 4 },
  party: { fontSize: 13, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' },
  position: { fontSize: 13, color: 'var(--muted)', marginBottom: 8 },
  bio: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 },
  radio: { position: 'absolute', top: 20, right: 20, width: 22, height: 22, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
  voteBar: {
    position: 'fixed', bottom: 32, left: '50%',
    width: '90%', maxWidth: 720,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white',
    borderRadius: 20,
    padding: '20px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    boxShadow: '0 20px 40px rgba(79, 70, 229, 0.25)',
    border: '1px solid rgba(255,255,255,0.2)',
    zIndex: 100,
  },
  selectedInfo: { fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.9)' },
};
