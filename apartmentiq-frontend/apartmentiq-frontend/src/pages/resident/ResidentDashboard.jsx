import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Calendar, PartyPopper, Bell, MapPin, Layout } from 'lucide-react';

export default function ResidentDashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const actions = [
    { label:'Book Facility',   sub:'Browse and book available facilities',    path:'/facilities',   icon: <Search size={22} color="#6c63ff" /> },
    { label:'My Bookings',     sub:'View and manage your bookings',            path:'/my-bookings', icon: <Calendar size={22} color="#22d3a0" /> },
    { label:'Events',          sub:'RSVP to upcoming society events',          path:'/events',      icon: <PartyPopper size={22} color="#f5a623" /> },
    { label:'Notifications',   sub:'View your recent notifications',           path:'/notifications', icon: <Bell size={22} color="#38bdf8" /> },
  ];

  return (
    <div style={{minHeight:'100vh',background:'#0c0e14', color:'#f0f2ff'}}>
      <div style={{maxWidth:'900px',margin:'0 auto', padding:'20px'}}>
        <h2 style={{fontSize:'26px',fontWeight:'800',color:'#f0f2ff',marginBottom:'6px', display:'flex', alignItems:'center', gap:'12px'}}>
          Welcome back, {user?.name} <span style={{fontSize:'20px'}}>👋</span>
        </h2>
        <p style={{color:'#7b82a8',fontSize:'14px',marginBottom:'32px', display:'flex', alignItems:'center', gap:'8px'}}>
          <MapPin size={14} /> Flat {user?.flatNo} · Urbanio Resident Portal
        </p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'20px'}}>
          {actions.map(a => (
            <div key={a.path}
              style={{background:'#13151f',border:'1px solid #232636',borderRadius:'16px',
                      padding:'24px',cursor:'pointer', transition:'transform 0.2s',
                      boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}
              onClick={() => navigate(a.path)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{marginBottom:'16px'}}>{a.icon}</div>
              <div style={{fontWeight:'700',color:'#f0f2ff',marginBottom:'6px',fontSize:'16px'}}>
                {a.label}
              </div>
              <div style={{fontSize:'13px',color:'#7b82a8', lineHeight:'1.4'}}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}