import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const CATEGORIES = ['PLUMBING','ELECTRICAL','CLEANING','CARPENTRY','OTHER'];
const STATUS_COLORS = {
  OPEN:        {color:'#f5a623',bg:'rgba(245,166,35,0.1)'},
  IN_PROGRESS: {color:'#38bdf8',bg:'rgba(56,189,248,0.1)'},
  RESOLVED:    {color:'#22d3a0',bg:'rgba(34,211,160,0.1)'},
};

export default function MaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category:'PLUMBING', title:'', description:'' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/maintenance/my').then(r => setRequests(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/maintenance', form);
      toast.success('Request submitted!');
      setShowForm(false);
      setForm({ category:'PLUMBING', title:'', description:'' });
      load();
    } catch { toast.error('Failed to submit'); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg,#0c0e14)'}}>
      <div style={{maxWidth:'720px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <div>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'var(--txt,#f0f2ff)'}}>🔧 Maintenance</h2>
            <p style={{color:'var(--mut,#7b82a8)',fontSize:'14px'}}>Report an issue in your flat or common area</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={newBtn}>
            {showForm ? 'Cancel' : '+ New Request'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{background:'var(--sur,#13151f)',border:'1px solid var(--bor,#232636)',borderRadius:'14px',padding:'22px',marginBottom:'20px'}}>
            <div style={{display:'grid',gap:'14px'}}>
              <div>
                <label style={lbl}>Category</label>
                <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={inp}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Issue Title</label>
                <input value={form.title} onChange={e => setForm({...form,title:e.target.value})}
                  placeholder="e.g. Leaking tap in bathroom" style={inp} required />
              </div>
              <div>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})}
                  placeholder="Describe the issue in detail..." rows={3} style={{...inp,resize:'vertical'}} />
              </div>
              <button type="submit" disabled={loading} style={submitBtn}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}

        {requests.map(r => {
          const sc = STATUS_COLORS[r.status] || STATUS_COLORS.OPEN;
          return (
            <div key={r.id} style={{background:'var(--sur,#13151f)',border:'1px solid var(--bor,#232636)',borderRadius:'12px',padding:'16px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                <div>
                  <div style={{fontWeight:'700',color:'var(--txt,#f0f2ff)',marginBottom:'3px'}}>{r.title}</div>
                  <div style={{fontSize:'12px',color:'var(--mut,#7b82a8)',marginBottom:'6px'}}>{r.category}</div>
                  {r.description && <div style={{fontSize:'13px',color:'var(--mut,#7b82a8)'}}>{r.description}</div>}
                </div>
                <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 10px',borderRadius:'6px',flexShrink:0,background:sc.bg,color:sc.color}}>
                  {r.status}
                </span>
              </div>
            </div>
          );
        })}
        {requests.length===0 && <p style={{color:'var(--mut,#7b82a8)',textAlign:'center',padding:'40px'}}>No requests yet</p>}
      </div>
    </div>
  );
}
const newBtn   = {background:'#6c63ff',color:'#fff',border:'none',borderRadius:'8px',padding:'9px 16px',cursor:'pointer',fontWeight:'700',fontSize:'13px'};
const submitBtn= {background:'#22d3a0',color:'#0c0e14',border:'none',borderRadius:'8px',padding:'11px',fontWeight:'800',fontSize:'14px',cursor:'pointer'};
const lbl      = {display:'block',fontSize:'12px',fontWeight:'600',marginBottom:'5px',color:'var(--txt,#f0f2ff)'};
const inp      = {width:'100%',background:'var(--sur2,#1a1d2a)',border:'1px solid var(--bor2,#2e3248)',borderRadius:'8px',padding:'9px 12px',color:'var(--txt,#f0f2ff)',fontSize:'14px',outline:'none',boxSizing:'border-box'};