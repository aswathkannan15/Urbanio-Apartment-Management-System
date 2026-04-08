import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { Bell, CheckSquare, Calendar, UserCheck, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const r = await api.get('/notifications');
      setNotifs(r.data || []);
    } catch { 
      toast.error('Failed to load notifications');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
    // Mark as read when page opens
    api.put('/notifications/read-all').catch(()=>{});
  }, []);

  const handleResponse = async (targetId, status) => {
    try {
      await api.put(`/visitors/${targetId}/respond?status=${status}`);
      toast.success(`Request ${status.toLowerCase()}ed`);
      fetchNotifs(); 
    } catch {
      toast.error('Action failed');
    }
  };

  const getIcon = (type) => {
    if (type === 'BOOKING') return <CheckSquare size={18} />;
    if (type === 'EVENT') return <Calendar size={18} />;
    if (type === 'VISITOR_REQUEST') return <UserCheck size={18} />;
    return <AlertCircle size={18} />;
  };

  return (
    <div style={{maxWidth:'800px', margin:'0 auto', padding:'40px 20px'}}>
      <h2 style={{fontSize:'28px', fontWeight:'800', marginBottom:'32px', display:'flex', alignItems:'center', gap:'16px'}}>
        <Bell size={32} color="#6c63ff" /> Notification Dashboard
      </h2>

      {loading ? (
        <p style={{color:'#7b82a8'}}>Loading notifications...</p>
      ) : notifs.length === 0 ? (
        <div style={{textAlign:'center', padding:'80px 20px', background:'#13151f', borderRadius:'20px', border:'1px dashed #2e3248'}}>
           <div style={{opacity:0.2, marginBottom:'20px'}}><Bell size={64} /></div>
           <h3 style={{color:'#f0f2ff'}}>No notifications yet</h3>
           <p style={{color:'#7b82a8'}}>When you have visitor requests or booking updates, they will appear here.</p>
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          {notifs.map(n => (
            <div key={n.id} style={{
              background:'#13151f', border:'1px solid #232636', borderRadius:'16px', padding:'24px',
              display:'flex', gap:'20px', alignItems:'flex-start',
              boxShadow:'0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                 padding:'12px', borderRadius:'12px', background:'rgba(108,99,255,0.1)', color:'#6c63ff'
              }}>
                {getIcon(n.type)}
              </div>
              
              <div style={{flex:1}}>
                <div style={{fontSize:'16px', color:'#f0f2ff', fontWeight:'600', marginBottom:'8px', lineHeight:1.5}}>
                  {n.message}
                </div>
                
                <div style={{display:'flex', alignItems:'center', gap:'16px', fontSize:'12px', color:'#7b82a8'}}>
                   <span style={{display:'flex', alignItems:'center', gap:'6px'}}><Clock size={14} /> {new Date(n.createdAt).toLocaleString()}</span>
                   <span style={{background:'rgba(255,255,255,0.05)', padding:'2px 8px', borderRadius:'6px', fontWeight:'700', fontSize:'10px'}}>
                      {n.type}
                   </span>
                </div>

                {n.type === 'VISITOR_REQUEST' && n.actionStatus === 'PENDING' && (
                  <div style={{display:'flex', gap:'12px', marginTop:'20px'}}>
                    <button onClick={() => handleResponse(n.targetId, 'APPROVED')}
                      style={{background:'#22d3a0', color:'#0c0e14', border:'none', borderRadius:'10px', padding:'10px 24px', fontSize:'13px', fontWeight:'800', cursor:'pointer', transition:'transform 0.1s'}}>
                      APPROVE ENTRY
                    </button>
                    <button onClick={() => handleResponse(n.targetId, 'REJECTED')}
                      style={{background:'rgba(255,95,126,0.1)', color:'#ff5f7e', border:'1px solid rgba(255,95,126,0.3)', borderRadius:'10px', padding:'10px 24px', fontSize:'13px', fontWeight:'800', cursor:'pointer', transition:'transform 0.1s'}}>
                      DENY ACCESS
                    </button>
                  </div>
                )}

                {n.type === 'VISITOR_REQUEST' && n.actionStatus !== 'PENDING' && (
                  <div style={{marginTop:'16px', display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.03)', padding:'6px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:'700', color: n.actionStatus==='APPROVED'?'#22d3a0':'#ff5f7e'}}>
                     {n.actionStatus === 'APPROVED' ? '✓ REQUEST APPROVED' : '✗ REQUEST REJECTED'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
