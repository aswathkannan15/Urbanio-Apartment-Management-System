import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import { Building2, Sun, Moon, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  // Show resident links ONLY to residents
  const isResident = user?.role === 'RESIDENT';

  const links = isResident ? [
    { path:'/dashboard',   label:'Home' },
    { path:'/facilities',  label:'Book' },
    { path:'/my-bookings', label:'My Bookings' },
    { path:'/events',      label:'Events' },
    { path:'/maintenance', label:'Maintenance' },
    { path:'/community',   label:'Community' },
  ] : [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <span className="navbar-brand" onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        <Building2 size={24} /> Urbanio
      </span>

      <div className="navbar-links">
        {links.map(l => (
          <button key={l.path}
            className={'nav-link' + (location.pathname === l.path ? ' active' : '')}
            onClick={() => navigate(l.path)}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="nav-right">
        {/* Only residents need to see/interact with visitor approval notifications */}
        {isResident && <NotificationBell />}
        
        <button onClick={toggle} style={{
          background:'var(--sur2)', border:'1px solid var(--bor2)',
          borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'16px',
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <span style={{fontSize:'14px',color:'var(--mut)',padding:'5px 10px',
                      background:'var(--sur2)',border:'1px solid var(--bor2)',
                      borderRadius:'8px',whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'6px'}}>
          <User size={16} /> {user?.name?.split(' ')[0]}
        </span>
        <button className="btn btn-danger btn-sm" onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}