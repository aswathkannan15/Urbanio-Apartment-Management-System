// src/pages/resident/CommunityBoard.jsx
import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const CATS = ['GENERAL','NOTICE','SALE','LOST_FOUND','HELP'];
const CAT_COLORS = {NOTICE:'#f5a623',SALE:'#22d3a0',LOST_FOUND:'#ff5f7e',HELP:'#38bdf8',GENERAL:'#6c63ff'};

export default function CommunityBoard() {
  const [posts, setPosts]   = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({category:'GENERAL',title:'',content:''});

  const load = () => api.get('/community').then(r => setPosts(r.data));
  useEffect(() => { load(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/community', form);
      toast.success('Posted!');
      setShowForm(false);
      setForm({category:'GENERAL',title:'',content:''});
      load();
    } catch { toast.error('Failed to post'); }
  };

  const filtered = filter==='ALL' ? posts : posts.filter(p => p.category===filter);

  return (
    <div style={{minHeight:'100vh',background:'var(--bg,#0c0e14)'}}>
      <div style={{maxWidth:'760px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <div>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'var(--txt,#f0f2ff)'}}>💬 Community Board</h2>
            <p style={{color:'var(--mut,#7b82a8)',fontSize:'14px'}}>Notices, sales, lost & found — all in one place</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{background:'#6c63ff',color:'#fff',border:'none',borderRadius:'8px',padding:'9px 16px',cursor:'pointer',fontWeight:'700',fontSize:'13px'}}>
            {showForm ? 'Cancel' : '+ Post'}
          </button>
        </div>

        {/* Category filter */}
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'20px'}}>
          {['ALL',...CATS].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{padding:'6px 13px',borderRadius:'20px',border:'1px solid',cursor:'pointer',fontSize:'12px',fontWeight:'600',
                     background:filter===c?(CAT_COLORS[c]||'#6c63ff'):'transparent',
                     color:filter===c?'#fff':'var(--mut,#7b82a8)',
                     borderColor:filter===c?(CAT_COLORS[c]||'#6c63ff'):'var(--bor2,#2e3248)'}}>
              {c}
            </button>
          ))}
        </div>

        {showForm && (
          <form onSubmit={handlePost} style={{background:'var(--sur,#13151f)',border:'1px solid var(--bor,#232636)',borderRadius:'14px',padding:'20px',marginBottom:'20px'}}>
            <div style={{display:'grid',gap:'12px'}}>
              <select value={form.category} onChange={e => setForm({...form,category:e.target.value})} style={iS}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Title" style={iS} required />
              <textarea value={form.content} onChange={e => setForm({...form,content:e.target.value})} placeholder="What's on your mind?" rows={3} style={{...iS,resize:'vertical'}} />
              <button type="submit" style={{background:'#6c63ff',color:'#fff',border:'none',borderRadius:'8px',padding:'10px',fontWeight:'700',cursor:'pointer'}}>Post</button>
            </div>
          </form>
        )}

        {filtered.map(p => (
          <div key={p.id} style={{background:'var(--sur,#13151f)',border:'1px solid var(--bor,#232636)',borderRadius:'12px',padding:'18px',marginBottom:'10px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
              <span style={{fontSize:'11px',fontWeight:'700',padding:'2px 9px',borderRadius:'5px',
                            background:(CAT_COLORS[p.category]||'#6c63ff')+'20',
                            color:CAT_COLORS[p.category]||'#6c63ff'}}>
                {p.category}
              </span>
              <span style={{fontSize:'12px',color:'var(--mut,#7b82a8)'}}>
                {p.author?.name} · {new Date(p.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div style={{fontWeight:'700',color:'var(--txt,#f0f2ff)',marginBottom:'6px'}}>{p.title}</div>
            <div style={{fontSize:'13px',color:'var(--mut,#7b82a8)',lineHeight:1.7}}>{p.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
const iS = {width:'100%',background:'var(--sur2,#1a1d2a)',border:'1px solid var(--bor2,#2e3248)',borderRadius:'8px',padding:'9px 12px',color:'var(--txt,#f0f2ff)',fontSize:'14px',outline:'none',boxSizing:'border-box'};