import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const ADMIN_PWD = 'admin123'; // Must match .env ADMIN_PASSWORD

export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState('');

  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [electionOpen, setElectionOpen] = useState(true);
  const [tab, setTab] = useState('candidates');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // New candidate form
  const [cForm, setCForm] = useState({ name:'', position:'', party:'', bio:'', color:'#4f8ef7' });
  // New voter form
  const [vForm, setVForm] = useState({ name:'', voterId:'', email:'' });

  const headers = { 'x-admin-token': ADMIN_PWD };

  const load = () => {
    API.get('/candidates').then(r => setCandidates(r.data));
    API.get('/admin/voters', { headers }).then(r => setVoters(r.data));
    API.get('/admin/election/status', { headers }).then(r => setElectionOpen(r.data.isOpen));
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  const flash = (type, text) => {
    if (type === 'ok') { setMsg(text); setError(''); }
    else { setError(text); setMsg(''); }
    setTimeout(() => { setMsg(''); setError(''); }, 4000);
  };

  const handleLogin = () => {
    if (pwd === ADMIN_PWD) { setAuthed(true); setPwdError(''); }
    else setPwdError('Incorrect password');
  };

  const addCandidate = async () => {
    if (!cForm.name || !cForm.party || !cForm.position) return flash('err', 'Fill all candidate fields');
    try {
      await API.post('/admin/candidates', cForm, { headers });
      setCForm({ name:'', position:'', party:'', bio:'', color:'#4f8ef7' });
      load();
      flash('ok', 'Candidate added!');
    } catch(e) { flash('err', e.response?.data?.message || 'Error'); }
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    await API.delete(`/admin/candidates/${id}`, { headers });
    load(); flash('ok', 'Candidate removed');
  };

  const addVoter = async () => {
    if (!vForm.name || !vForm.voterId || !vForm.email) return flash('err', 'Fill name, voter ID, and email');
    try {
      const res = await API.post('/admin/voters', vForm, { headers });
      setVForm({ name:'', voterId:'', email:'' });
      load(); 
      flash('ok', res.data.message);
    } catch(e) { flash('err', e.response?.data?.message || 'Voter ID may already exist'); }
  };

  const deleteVoter = async (id) => {
    if (!window.confirm('Delete this voter?')) return;
    await API.delete(`/admin/voters/${id}`, { headers });
    load(); flash('ok', 'Voter removed');
  };

  const toggleElection = async () => {
    const r = await API.post('/admin/election/toggle', {}, { headers });
    setElectionOpen(r.data.isOpen);
    flash('ok', r.data.message);
  };

  const resetVotes = async () => {
    if (!window.confirm('RESET all votes? This cannot be undone!')) return;
    await API.post('/admin/reset', {}, { headers });
    load(); flash('ok', 'All votes reset');
  };

  // ─── Login screen ───────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{...styles.page, display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={styles.grid}/>
      <div className="card fade-up" style={{width:380,padding:36, position:'relative'}}>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{position:'absolute', top:24, right:24, padding:'6px 12px', fontSize:12}}>← Back</button>
        <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,marginBottom:4}}>iVOTE</div>
        <div style={{color:'var(--muted)',fontSize:14,marginBottom:28}}>Admin Panel — Restricted Access</div>
        <label style={styles.label}>Admin Password</label>
        <input className="input" type="password" placeholder="Enter password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} style={{marginBottom:12}} />
        {pwdError && <div className="alert alert-error" style={{marginBottom:12}}>{pwdError}</div>}
        <button className="btn btn-primary" style={{width:'100%'}} onClick={handleLogin}>Enter Admin Panel</button>
      </div>
    </div>
  );

  // ─── Main admin UI ───────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.grid}/>
      <div style={styles.layout}>

        {/* Header */}
        <header style={styles.header} className="fade-up">
          <div style={{display:'flex', alignItems:'center'}}>
            <button className="btn btn-outline" style={{padding:'6px 12px', fontSize:12, marginRight:16}} onClick={() => navigate('/')}>
              ← Back
            </button>
            <span style={styles.logo}>iVOTE</span>
            <span style={{color:'var(--muted)',fontSize:13,marginLeft:12}}>Admin Panel</span>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <span style={{...styles.electionBadge, background: electionOpen?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color: electionOpen?'#10b981':'#ef4444', borderColor: electionOpen?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}}>
              {electionOpen ? '🟢 Election Open' : '🔴 Election Closed'}
            </span>
            <button className="btn btn-outline" style={{padding:'8px 14px',fontSize:13}} onClick={toggleElection}>
              {electionOpen ? 'Close Election' : 'Open Election'}
            </button>
            <button className="btn btn-danger" style={{padding:'8px 14px',fontSize:13}} onClick={resetVotes}>
              Reset Votes
            </button>
          </div>
        </header>

        {/* Flash messages */}
        {msg && <div className="alert alert-success fade-up">{msg}</div>}
        {error && <div className="alert alert-error fade-up">{error}</div>}

        {/* Tabs */}
        <div style={styles.tabs}>
          {['candidates','voters'].map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{...styles.tab, ...(tab===t?styles.tabActive:{})}}>
              {t === 'candidates' ? `Candidates (${candidates.length})` : `Voters (${voters.length})`}
            </button>
          ))}
        </div>

        {/* ── Candidates tab ─────────────────────────────── */}
        {tab === 'candidates' && (
          <div style={styles.twoCol}>
            {/* Form */}
            <div className="card" style={{padding:24,height:'fit-content'}}>
              <h3 style={styles.formTitle}>Add Candidate</h3>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name *</label>
                  <input className="input" placeholder="e.g. Jane Smith" value={cForm.name} onChange={e=>setCForm({...cForm,name:e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Position *</label>
                  <input className="input" placeholder="e.g. President" value={cForm.position} onChange={e=>setCForm({...cForm,position:e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Party *</label>
                  <input className="input" placeholder="e.g. Progressive Party" value={cForm.party} onChange={e=>setCForm({...cForm,party:e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Accent Color</label>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="color" value={cForm.color} onChange={e=>setCForm({...cForm,color:e.target.value})} style={{width:48,height:40,border:'none',background:'none',cursor:'pointer',borderRadius:8}} />
                    <span style={{fontSize:13,color:'var(--muted)'}}>{cForm.color}</span>
                  </div>
                </div>
                <div style={{...styles.field,gridColumn:'1/-1'}}>
                  <label style={styles.label}>Bio (optional)</label>
                  <textarea className="input" placeholder="Short description..." value={cForm.bio} onChange={e=>setCForm({...cForm,bio:e.target.value})} style={{resize:'vertical',minHeight:80}} />
                </div>
              </div>
              <button className="btn btn-primary" style={{width:'100%',marginTop:8}} onClick={addCandidate}>+ Add Candidate</button>
            </div>

            {/* List */}
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {candidates.length === 0 ? (
                <div style={{textAlign:'center',color:'var(--muted)',padding:'60px 20px'}}>No candidates yet.</div>
              ) : candidates.map(c => (
                <div key={c._id} className="card" style={{padding:'18px 20px',display:'flex',alignItems:'center',gap:16}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${c.color||'#4f8ef7'}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{color:c.color||'var(--accent)',fontFamily:'var(--font-display)',fontWeight:700,fontSize:16}}>
                      {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:15}}>{c.name}</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>{c.party} · {c.position}</div>
                  </div>
                  <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,color:'var(--accent)'}}>{c.votes}</div>
                  <button className="btn btn-danger" style={{padding:'6px 14px',fontSize:12}} onClick={()=>deleteCandidate(c._id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Voters tab ──────────────────────────────────── */}
        {tab === 'voters' && (
          <div style={styles.twoCol}>
            {/* Form */}
            <div className="card" style={{padding:24,height:'fit-content'}}>
              <h3 style={styles.formTitle}>Register Voter</h3>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={styles.field}>
                  <label style={styles.label}>Full Name *</label>
                  <input className="input" placeholder="e.g. John Doe" value={vForm.name} onChange={e=>setVForm({...vForm,name:e.target.value})} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Voter ID *</label>
                  <input className="input" placeholder="e.g. VTR-00123" value={vForm.voterId} onChange={e=>setVForm({...vForm,voterId:e.target.value.toUpperCase()})} style={{letterSpacing:'0.05em',fontWeight:500}} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Email ID *</label>
                  <input className="input" type="email" placeholder="e.g. voter@example.com" value={vForm.email} onChange={e=>setVForm({...vForm,email:e.target.value})} />
                </div>
                <button className="btn btn-primary" onClick={addVoter}>+ Register Voter</button>
              </div>
            </div>

            {/* Voter list */}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {voters.length === 0 ? (
                <div style={{textAlign:'center',color:'var(--muted)',padding:'60px 20px'}}>No voters registered.</div>
              ) : voters.map(v => (
                <div key={v._id} className="card" style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:500,fontSize:14}}>{v.name}</div>
                    <div style={{fontSize:12,color:'var(--muted)',letterSpacing:'0.04em'}}>{v.voterId}</div>
                  </div>
                  <span style={{
                    fontSize:11,fontWeight:600,padding:'4px 10px',borderRadius:20,border:'1px solid',
                    background: v.hasVoted?'rgba(16,185,129,0.1)':'rgba(107,114,128,0.1)',
                    color: v.hasVoted?'#10b981':'var(--muted)',
                    borderColor: v.hasVoted?'rgba(16,185,129,0.3)':'rgba(107,114,128,0.2)',
                  }}>
                    {v.hasVoted ? '✓ Voted' : 'Not voted'}
                  </span>
                  <button className="btn btn-danger" style={{padding:'6px 14px',fontSize:12,marginLeft:8}} onClick={()=>deleteVoter(v._id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', position:'relative' },
  grid: {
    position:'fixed', inset:0,
    backgroundImage:`linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
    backgroundSize:'60px 60px', pointerEvents:'none',
  },
  layout: { maxWidth:1000, margin:'0 auto', padding:'24px 20px 60px' },
  header: { display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28 },
  logo: { fontFamily:'var(--font-display)',fontWeight:800,fontSize:22,letterSpacing:'-0.02em' },
  electionBadge: { fontSize:12,fontWeight:600,padding:'6px 14px',borderRadius:20,border:'1px solid' },
  tabs: { display:'flex',gap:4,marginBottom:24,background:'var(--surface)',borderRadius:'var(--radius-sm)',padding:4,width:'fit-content' },
  tab: { padding:'8px 20px',borderRadius:8,border:'none',background:'transparent',color:'var(--muted)',cursor:'pointer',fontSize:13,fontFamily:'var(--font-display)',fontWeight:600,transition:'all 0.2s' },
  tabActive: { background:'var(--surface2)',color:'var(--text)' },
  twoCol: { display:'grid',gridTemplateColumns:'320px 1fr',gap:20,alignItems:'start' },
  formTitle: { fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:18 },
  formGrid: { display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 },
  field: { display:'flex',flexDirection:'column',gap:8 },
  label: { fontSize:12,fontWeight:500,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.04em' },
};
