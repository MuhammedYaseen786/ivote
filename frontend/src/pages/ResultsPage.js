import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResults = () => {
    API.get('/results')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const winner = data?.results?.[0];

  return (
    <div style={styles.page}>
      <div style={styles.grid} />
      <div style={styles.layout}>

        {/* Header */}
        <header style={styles.header} className="fade-up">
          <span style={styles.logo}>iVOTE</span>
          <div style={styles.headerRight}>
            <span style={styles.liveTag}>
              <span style={styles.liveDot} />
              Live Results
            </span>
            <button className="btn btn-outline" style={{padding:'8px 16px',fontSize:13}} onClick={() => navigate('/')}>
              ← Back
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'100px 0'}}><div className="spinner" style={{width:40,height:40}}/></div>
        ) : !data ? (
          <p style={{textAlign:'center',color:'var(--muted)'}}>Could not load results.</p>
        ) : (
          <>
            {/* Stats row */}
            <div style={styles.statsRow} className="fade-up-delay-1">
              {[
                { label: 'Total Voters', value: data.stats.totalVoters },
                { label: 'Votes Cast', value: data.stats.totalVoted },
                { label: 'Turnout', value: `${data.stats.turnout}%` },
                { label: 'Total Votes', value: data.stats.totalVotes },
              ].map(s => (
                <div key={s.label} className="card" style={styles.statCard}>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Winner highlight */}
            {winner && winner.votes > 0 && (
              <div style={{...styles.winnerCard, borderColor: winner.color || 'var(--accent)'}} className="fade-up-delay-2">
                <div style={{...styles.winnerAvatar, background: `${winner.color || '#4f8ef7'}22`}}>
                  <span style={{color: winner.color || 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22}}>
                    {winner.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </span>
                </div>
                <div>
                  <div style={{fontSize:12,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Leading</div>
                  <div style={styles.winnerName}>{winner.name}</div>
                  <div style={{color: winner.color || 'var(--accent)', fontSize:13, fontWeight:600}}>{winner.party}</div>
                </div>
                <div style={styles.winnerStats}>
                  <div style={styles.winnerVotes}>{winner.votes}</div>
                  <div style={{color:'var(--muted)',fontSize:13}}>votes · {winner.percentage}%</div>
                </div>
              </div>
            )}

            {/* Bar chart */}
            <div style={{display:'flex',flexDirection:'column',gap:12}} className="fade-up-delay-3">
              <h2 style={styles.sectionTitle}>All Candidates</h2>
              {data.results.map((c, i) => (
                <div key={c.id} className="card" style={{padding:'20px 24px', animationDelay:`${i*0.06}s`}}>
                  <div style={styles.barHeader}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <span style={{...styles.rank, color: i===0?'#fbbf24':'var(--muted)'}}>{i === 0 ? '🏆' : `#${i+1}`}</span>
                      <div>
                        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16}}>{c.name}</div>
                        <div style={{fontSize:12,color:c.color||'var(--accent)',fontWeight:600}}>{c.party}</div>
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:20}}>{c.votes}</div>
                      <div style={{fontSize:12,color:'var(--muted)'}}>{c.percentage}%</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={styles.barBg}>
                    <div style={{
                      ...styles.barFill,
                      width: `${c.percentage}%`,
                      background: c.color || 'var(--accent)',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <p style={{textAlign:'center',color:'var(--muted)',fontSize:12,marginTop:20}}>
              Auto-refreshes every 10 seconds · Last updated: {new Date().toLocaleTimeString()}
            </p>
          </>
        )}
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
  layout: { maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' },
  header: { display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:40 },
  logo: { fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,letterSpacing:'-0.02em' },
  headerRight: { display:'flex',alignItems:'center',gap:12 },
  liveTag: { display:'flex',alignItems:'center',gap:8,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',color:'#10b981',padding:'6px 14px',borderRadius:20,fontSize:13,fontWeight:500 },
  liveDot: { width:8,height:8,borderRadius:'50%',background:'#10b981',animation:'pulse-glow 1.5s infinite' },
  statsRow: { display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24 },
  statCard: { textAlign:'center',padding:'20px 12px' },
  statValue: { fontFamily:'var(--font-display)',fontWeight:800,fontSize:28,letterSpacing:'-0.02em' },
  statLabel: { fontSize:12,color:'var(--muted)',marginTop:4,textTransform:'uppercase',letterSpacing:'0.04em' },
  winnerCard: { display:'flex',alignItems:'center',gap:20,padding:'24px 28px',background:'var(--surface)',border:'1px solid',borderRadius:'var(--radius)',marginBottom:24 },
  winnerAvatar: { width:64,height:64,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 },
  winnerName: { fontFamily:'var(--font-display)',fontWeight:700,fontSize:22,letterSpacing:'-0.01em' },
  winnerStats: { marginLeft:'auto',textAlign:'right' },
  winnerVotes: { fontFamily:'var(--font-display)',fontWeight:800,fontSize:36,letterSpacing:'-0.02em' },
  sectionTitle: { fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,marginBottom:4 },
  barHeader: { display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 },
  rank: { fontSize:18,width:28 },
  barBg: { height:8,background:'var(--surface2)',borderRadius:4,overflow:'hidden' },
  barFill: { height:'100%',borderRadius:4,transition:'width 1s ease' },
};
