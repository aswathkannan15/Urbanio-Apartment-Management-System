import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Bell, CheckSquare, Calendar, UserCheck, AlertCircle } from 'lucide-react';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [count,  setCount]  = useState(0);
  const [open,   setOpen]   = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef(null);

  const fetchCount = async () => {
    try {
      const r = await api.get('/notifications/unread-count');
      setCount(Number(r.data.count) || 0);
    } catch { }
  };

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const r = await api.get('/notifications');
      setNotifs(r.data || []);
    } catch { setNotifs([]); }
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
    const timer = setInterval(fetchCount, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      fetchNotifs();
      try {
        await api.put('/notifications/read-all');
        setCount(0);
      } catch { }
    }
  };

  const handleResponse = async (targetId, status) => {
    try {
      await api.put(`/visitors/${targetId}/respond?status=${status}`);
      fetchNotifs(); // reload to show updated status
    } catch { }
  };

  const getIcon = (type) => {
    if (type === 'BOOKING') return <CheckSquare size={12} />;
    if (type === 'EVENT') return <Calendar size={12} />;
    if (type === 'VISITOR_REQUEST') return <UserCheck size={12} />;
    return <AlertCircle size={12} />;
  };

  return (
    <div ref={dropRef} style={{ position:'relative' }}>
      <button onClick={handleOpen} style={{
        background:'transparent', border:'none', cursor:'pointer',
        fontSize:'20px', position:'relative', padding:'8px',
        lineHeight:1, display:'flex', alignItems:'center', color: count > 0 ? '#ff5f7e' : '#7b82a8',
        transition: 'color 0.3s ease'
      }}>
        <Bell size={20} className={count > 0 ? "bell-vibrate" : ""} />
        {count > 0 && (
          <span style={{
            position:'absolute', top:'4px', right:'4px',
            background:'#ff5f7e', color:'#fff', borderRadius:'50%',
            width:'16px', height:'16px', fontSize:'9px',
            display:'grid', placeItems:'center', fontWeight:'800',
            fontFamily:'sans-serif', lineHeight:1, border:'2px solid #13151f'
          }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position:'absolute', right:0, top:'48px', width:'320px',
          background:'#13151f',
          border:'1px solid #232636', borderRadius:'14px',
          zIndex:999, maxHeight:'410px', overflowY:'auto',
          boxShadow:'0 12px 40px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            padding:'14px 18px', fontWeight:'700', fontSize:'14px',
            color:'#f0f2ff',
            borderBottom:'1px solid #232636',
            display:'flex', justifyContent:'space-between', alignItems:'center'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
               <span style={{fontSize:'12px', color:'#7b82a8', fontWeight:400}}>{notifs.length} total</span>
            </div>
            <button onClick={() => { setOpen(false); navigate('/notifications'); }}
              style={{background:'rgba(108,99,255,0.1)', border:'none', color:'#6c63ff', fontSize:'11px', fontWeight:800, cursor:'pointer', padding:'4px 10px', borderRadius:'6px'}}>
              VIEW ALL
            </button>
          </div>

          {!loading && notifs.length === 0 && (
            <div style={{padding:'40px 20px',textAlign:'center'}}>
               <CheckSquare size={32} color="#22d3a0" style={{marginBottom:'12px', opacity:0.3}} />
               <p style={{color:'#7b82a8',fontSize:13}}>All caught up</p>
            </div>
          )}

          {notifs.map(n => (
            <div key={n.id} style={{
              padding:'14px 18px',
              borderBottom:'1px solid #232636',
              background: n.isRead ? 'transparent' : 'rgba(108,99,255,0.05)',
            }}>
              <div style={{fontSize:'13px',color:'#f0f2ff',marginBottom:'6px',lineHeight:1.5}}>
                {n.message}
              </div>

              {n.type === 'VISITOR_REQUEST' && n.actionStatus === 'PENDING' && (
                <div style={{display:'flex', gap:'8px', marginBottom:'10px', marginTop:'10px'}}>
                  <button onClick={() => handleResponse(n.targetId, 'APPROVED')}
                    style={{flex:1, background:'#22d3a0', color:'#0c0e14', border:'none', borderRadius:'6px', padding:'7px', fontSize:'11px', fontWeight:'800', cursor:'pointer', transition:'transform 0.1s'}}>
                    APPROVE
                  </button>
                  <button onClick={() => handleResponse(n.targetId, 'REJECTED')}
                    style={{flex:1, background:'rgba(255,95,126,0.1)', color:'#ff5f7e', border:'1px solid rgba(255,95,126,0.3)', borderRadius:'6px', padding:'7px', fontSize:'11px', fontWeight:'800', cursor:'pointer', transition:'transform 0.1s'}}>
                    REJECT
                  </button>
                </div>
              )}

              {n.type === 'VISITOR_REQUEST' && n.actionStatus !== 'PENDING' && (
                <div style={{fontSize:'11px', fontWeight:'700', color: n.actionStatus==='APPROVED'?'#22d3a0':'#ff5f7e', marginBottom:'10px', marginTop:'5px', background:'rgba(255,255,255,0.02)', padding:'4px 8px', borderRadius:'4px', display:'inline-block'}}>
                   {n.actionStatus === 'APPROVED' ? '✓ APPROVED' : '✗ REJECTED'}
                </div>
              )}

              <div style={{fontSize:'11px',color:'#7b82a8',display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{
                  background: n.type==='BOOKING'?'rgba(34,211,160,0.15)':
                              n.type==='EVENT'?'rgba(56,189,248,0.15)':'rgba(108,99,248,0.15)',
                  color: n.type==='BOOKING'?'#22d3a0':
                         n.type==='EVENT'?'#38bdf8':'#6c63ff',
                  padding:'2px 8px', borderRadius:'6px', fontWeight:700,
                  display:'flex', alignItems:'center', gap:'5px', fontSize:'10px'
                }}>
                  {getIcon(n.type)} {n.type}
                </span>
                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .bell-vibrate { animation: vibrate 0.5s linear infinite; }
        @keyframes vibrate {
          0% { transform: rotate(0); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(0); }
          75% { transform: rotate(-10deg); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
}