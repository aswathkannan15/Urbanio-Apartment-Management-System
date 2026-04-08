import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Phone, CheckCircle, ShieldCheck } from 'lucide-react';

export default function PreApproveGuest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ guestName:'', guestPhone:'' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/visitors/pre-approve', form);
      setSuccess(true);
      toast.success('Guest pre-authorized!');
    } catch { toast.error('Failed to pre-authorize'); }
    setLoading(false);
  };

  const lbl = {display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'6px',color:'#f0f2ff'};
  const inp = {width:'100%',background:'#1a1d2a',border:'1px solid #2e3248',borderRadius:'8px',padding:'10px 14px',color:'#f0f2ff',fontSize:'14px',outline:'none',boxSizing:'border-box'};
  const btn = {width:'100%',background:'#6c63ff',color:'#fff',border:'none',borderRadius:'9px',padding:'12px',fontSize:'15px',fontWeight:'700',cursor:'pointer'};

  return (
    <div style={{minHeight:'100vh',background:'#0c0e14', color:'#f0f2ff'}}>
      <div style={{maxWidth:'480px',margin:'0 auto', padding:'24px 20px'}}>
        <button onClick={() => navigate('/dashboard')} 
          style={{display:'flex', alignItems:'center', gap:'8px', background:'transparent', border:'none', color:'#7b82a8', cursor:'pointer', marginBottom:'24px', fontSize:'14px', fontWeight:'600'}}>
          <ArrowLeft size={18} /> BACK TO DASHBOARD
        </button>
        
        <h2 style={{fontSize:'24px',fontWeight:'800',color:'#f0f2ff',marginBottom:'8px', display:'flex', alignItems:'center', gap:'12px'}}>
          <ShieldCheck size={28} color="#6c63ff" /> Pre-Authorize Guest
        </h2>
        <p style={{color:'#7b82a8',fontSize:'14px',marginBottom:'32px', lineHeight:1.5}}>
          Register your expected guest in advance. They can enter the gate automatically without you having to manually approve when they arrive.
        </p>

        {!success && (
          <form onSubmit={handleSubmit} style={{background:'#13151f',border:'1px solid #232636',borderRadius:'16px',padding:'28px', boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
            <div style={{marginBottom:'18px'}}>
              <label style={lbl}><User size={14} style={{verticalAlign:'middle', marginRight:'8px'}} /> Guest's Full Name</label>
              <input value={form.guestName} onChange={e => setForm({...form,guestName:e.target.value})}
                placeholder="e.g. Jane Smith" style={inp} required />
            </div>
            <div style={{marginBottom:'24px'}}>
              <label style={lbl}><Phone size={14} style={{verticalAlign:'middle', marginRight:'8px'}} /> Guest's Phone Number</label>
              <input value={form.guestPhone} onChange={e => setForm({...form,guestPhone:e.target.value})}
                placeholder="+91 9999999999" style={inp} required />
            </div>
            <button type="submit" disabled={loading} style={btn}>
              {loading ? 'Authorizing...' : 'Pre-Authorize Entry'}
            </button>
          </form>
        )}

        {success && (
          <div style={{background:'rgba(34,211,160,0.05)',border:'2px solid rgba(34,211,160,0.2)',
                       borderRadius:'16px',padding:'40px 32px',textAlign:'center'}}>
            <CheckCircle size={56} color="#22d3a0" style={{marginBottom:'20px'}} />
            <h3 style={{fontSize:'20px', color:'#f0f2ff', marginBottom:'12px'}}>Authorization Successful!</h3>
            <p style={{fontSize:'14px',color:'#7b82a8',marginBottom:'28px', lineHeight:1.6}}>
              <strong>{form.guestName}</strong> is now pre-authorized for entry. 
              <br />Security will see an 'APPROVED' status when they log this guest at the gate.
            </p>
            <button onClick={() => { setSuccess(false); setForm({guestName:'',guestPhone:''}); }}
              style={{...btn, background:'#1a1d2a', border:'1px solid #2e3248', color:'#f0f2ff'}}>
              Authorize Another Guest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}