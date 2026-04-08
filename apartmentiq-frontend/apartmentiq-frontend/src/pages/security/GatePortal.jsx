import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, User, LogOut, FileEdit, ClipboardList, 
  Camera, CheckCircle, Phone, Home, Car, LogIn, Hourglass, XCircle
} from 'lucide-react';

const inp = {
  width: '100%',
  background: '#1a1d2a',
  border: '1px solid #2e3248',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#f0f2ff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default function GatePortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]       = useState('checkin');
  const [visitors, setVisitors] = useState([]);
  const [photo, setPhoto]   = useState(null); // base64
  const [pendingVisitor, setPendingVisitor] = useState(null);
  const [form, setForm]     = useState({
    visitorName: '', phone: '', flatToVisit: '', vehicleNumber: ''
  });

  const loadToday = () =>
    api.get('/visitors/today').then(r => setVisitors(r.data)).catch(()=>{});

  useEffect(() => { 
    loadToday(); 
  }, []);

  // Polling for pending approval
  useEffect(() => {
    let timer;
    if (tab === 'approval' && pendingVisitor) {
      timer = setInterval(async () => {
        try {
          const r = await api.get(`/visitors/${pendingVisitor.id}/status`);
          if (r.data.status === 'APPROVED' || r.data.status === 'ENTERED') {
             toast.success(`RESIDENT APPROVED: ${r.data.visitorName} can enter!`);
             setPendingVisitor(null);
             setTab('log');
             loadToday();
          } else if (r.data.status === 'REJECTED') {
             toast.error(`ENTRY DENIED: Resident rejected ${r.data.visitorName}.`);
             setPendingVisitor(null);
             setTab('checkin');
          }
        } catch { }
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [tab, pendingVisitor]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('/visitors/checkin', { ...form, photoBase64: photo });
      toast.success('Resident notified! Waiting for approval...', { duration: 4000 });
      setPendingVisitor(r.data);
      setForm({ visitorName: '', phone: '', flatToVisit: '', vehicleNumber: '' });
      setPhoto(null);
      setTab('approval'); 
      loadToday();
    } catch { toast.error('Check-in failed'); }
  };

  const handleCheckout = async (id) => {
    await api.put('/visitors/' + id + '/checkout');
    toast.success('Visitor checked out'); 
    loadToday();
  };

  return (
    <div style={{minHeight:'100vh',background:'#0c0e14', color:'#f0f2ff'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                   padding:'16px 24px',background:'#13151f',borderBottom:'1px solid #232636'}}>
        <span style={{fontSize:'18px',fontWeight:'800',color:'#38bdf8', display:'flex', alignItems:'center', gap:'10px'}}>
          <ShieldCheck size={24} /> Urbanio Security Portal
        </span>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <span style={{fontSize:'12px',color:'#7b82a8', display:'flex', alignItems:'center', gap:'6px'}}>
            <User size={14} /> {user?.name}
          </span>
          <button onClick={() => { logout(); navigate('/login'); }}
            style={{background:'rgba(255,95,126,0.1)',border:'1px solid rgba(255,95,126,0.3)',
                    color:'#ff5f7e',borderRadius:'7px',padding:'6px 12px',cursor:'pointer',fontSize:'12px',
                    display:'flex', alignItems:'center', gap:'6px'}}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'28px 20px'}}>
        {/* Tabs */}
        <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
          {[
            { id:'checkin',  label:'Visitor Check-in', icon: <FileEdit size={16} /> },
            { id:'approval', label:'Waiting Approval', icon: <Hourglass size={16} /> },
            { id : 'log',     label:"Today's Log",     icon: <ClipboardList size={16} /> }
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{padding:'9px 18px',borderRadius:'8px',border:'1px solid',cursor:'pointer',
                      fontWeight:'600',fontSize:'13px', display:'flex', alignItems:'center', gap:'8px',
                      background: tab===t.id ? '#38bdf8' : 'transparent',
                      color:      tab===t.id ? '#0c0e14' : '#7b82a8',
                      borderColor: tab===t.id ? '#38bdf8' : '#2e3248'}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Manual Check-in Form */}
        {tab==='checkin' && (
          <div style={{background:'#13151f',border:'1px solid #232636',borderRadius:'14px',padding:'24px', maxWidth:'600px'}}>
            <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'18px', display:'flex', alignItems:'center', gap:'10px'}}>
              <LogIn size={20} /> Register Visitor Entry
            </h3>
            <form onSubmit={handleCheckin}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                {[
                  {key:'visitorName',label:'Visitor Name',ph:'John Doe'},
                  {key:'phone',     label:'Phone Number', ph:'+91 9999999999'},
                  {key:'flatToVisit',label:'Visiting Flat',ph:'A-204'},
                  {key:'vehicleNumber',label:'Vehicle No. (optional)',ph:'TN-01-AB-1234'},
                ].map(f => (
                  <div key={f.key}>
                    <label style={{display:'block',fontSize:'12px',fontWeight:'600',marginBottom:'5px',color:'#f0f2ff'}}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})}
                      placeholder={f.ph} style={inp} required={f.key !== 'vehicleNumber'} />
                  </div>
                ))}
              </div>
              <div style={{marginTop:'14px'}}>
                <label style={{display:'block',fontSize:'12px',fontWeight:'600',marginBottom:'5px',color:'#f0f2ff', display:'flex', alignItems:'center', gap:'6px'}}>
                  <Camera size={16} /> Take Visitor Photo
                </label>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{color:'#7b82a8',fontSize:'13px'}} />
                {photo && <img src={photo} alt="preview" style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'8px',marginTop:'8px',border:'2px solid #38bdf8'}} />}
              </div>
              <button type="submit" style={{marginTop:'18px',background:'#38bdf8',color:'#0c0e14',border:'none', borderRadius:'9px',padding:'11px 24px',fontWeight:'800',fontSize:'14px',cursor:'pointer', display:'flex', alignItems:'center', gap:'8px'}}>
                <CheckCircle size={18} /> Request Resident Approval
              </button>
            </form>
          </div>
        )}

        {/* Pending Approval Status */}
        {tab==='approval' && (
          <div style={{background:'#13151f',border:'1px solid #232636',borderRadius:'14px',padding:'48px', textAlign:'center', maxWidth:'500px', margin:'10px auto'}}>
            {!pendingVisitor ? (
               <p style={{color:'#7b82a8'}}>No pending requests. Log a new visitor first.</p>
            ) : (
              <>
                <Hourglass size={48} color="#f5a623" style={{marginBottom:'24px', animation:'spin 2s linear infinite'}} />
                <h3 style={{color:'#f0f2ff',marginBottom:'12px', fontSize:'20px'}}>Waiting For Resident...</h3>
                <p style={{color:'#7b82a8',fontSize:'14px',marginBottom:'32px', lineHeight:1.6}}>
                  Sent approval request to <strong>Flat {pendingVisitor.flatToVisit}</strong> for <strong>{pendingVisitor.visitorName}</strong>. 
                  <br />Ask visitor to wait while the resident approves.
                </p>
                <div style={{padding:'16px', background:'rgba(245,166,35,0.08)', border:'1px solid rgba(245,166,35,0.2)', borderRadius:'12px', color:'#f5a623', fontSize:'14px', fontWeight:'700', letterSpacing:'1px'}}>
                   STATUS: {(pendingVisitor.status || 'PENDING').toUpperCase()}
                </div>
                <button onClick={() => setPendingVisitor(null)} style={{marginTop:'32px', background:'transparent', color:'rgba(255,95,126,0.6)', border:'none', fontSize:'13px', cursor:'pointer', textDecoration:'underline'}}>
                  Cancel And Restart
                </button>
              </>
            )}
          </div>
        )}

        {/* Today's Log */}
        {tab==='log' && (
          <div>
            <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>
               <ClipboardList size={22} /> Today's Visitor Entries
            </h3>
            {visitors.map(v => (
              <div key={v.id} style={{background:'#13151f',border:'1px solid #232636', borderRadius:'14px',padding:'18px',marginBottom:'12px', display:'flex',gap:'16px',alignItems:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
                {v.photoUrl ? <img src={v.photoUrl} alt="V" style={{width:'64px',height:'64px',borderRadius:'10px',objectFit:'cover',flexShrink:0}} /> : <div style={{width:'64px',height:'64px',borderRadius:'10px',background:'#1a1d2a', display:'grid',placeItems:'center',flexShrink:0}}><User size={36} color="#7b82a8" /></div>}
                <div style={{flex:1}}>
                  <div style={{fontWeight:'800',color:'#f0f2ff',marginBottom:'4px', fontSize:'15px'}}>{v.visitorName}</div>
                  <div style={{fontSize:'12px',color:'#7b82a8', display:'flex', flexWrap:'wrap', gap:'12px'}}>
                    <span style={{display:'flex', alignItems:'center', gap:'5px'}}><Home size={14} /> Flat {v.flatToVisit}</span>
                    <span style={{display:'flex', alignItems:'center', gap:'5px', color: (v.status==='APPROVED' || v.status==='ENTERED') ? '#22d3a0' : '#7b82a8', fontWeight:'700'}}>
                       {(v.status === 'APPROVED' || v.status === 'ENTERED') ? <CheckCircle size={14} /> : <XCircle size={14} />}
                       {(v.status || 'PENDING').toUpperCase()}
                    </span>
                  </div>
                  <div style={{fontSize:'11px',color:'#7b82a8',marginTop:'6px', background:'rgba(255,255,255,0.03)', padding:'4px 8px', borderRadius:'6px', display:'inline-block'}}>
                    ENTRY: {v.inTime ? new Date(v.inTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'} &nbsp;·&nbsp; EXIT: {v.outTime ? new Date(v.outTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Still inside'}
                  </div>
                </div>
                {!v.outTime && v.inTime && (
                  <button onClick={() => handleCheckout(v.id)} style={{background:'rgba(34,211,160,0.1)',border:'1px solid rgba(34,211,160,0.3)', color:'#22d3a0',borderRadius:'8px',padding:'8px 16px', cursor:'pointer',fontSize:'13px',fontWeight:'700',flexShrink:0, transition:'background 0.2s'}} onMouseOver={e=>e.currentTarget.style.background='rgba(34,211,160,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(34,211,160,0.1)'}>
                    CHECK OUT
                  </button>
                )}
              </div>
            ))}
            {visitors.length===0 && <p style={{color:'#7b82a8',textAlign:'center',padding:'60px', background:'#13151f', border:'1px dashed #232636', borderRadius:'14px'}}>No visitor activity yet today</p>}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}