// src/pages/resident/EventsPage.jsx
import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(r => { setEvents(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load events'); setLoading(false); });
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/register`);
      toast.success(response.data.message || 'Successfully registered!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to register for event');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg,#0c0e14)'}}>
      <div style={{maxWidth:'800px',margin:'0 auto'}}>
        <h2 style={{fontSize:'22px',fontWeight:'800',color:'var(--txt,#f0f2ff)',marginBottom:'6px'}}>🎭 Events</h2>
        <p style={{color:'var(--mut,#7b82a8)',fontSize:'14px',marginBottom:'24px'}}>Upcoming society events</p>
        {loading && <p style={{color:'var(--mut,#7b82a8)'}}>Loading...</p>}
        {events.map(ev => (
          <div key={ev.id} style={{background:'var(--sur,#13151f)',border:'1px solid var(--bor,#232636)',
                                   borderRadius:'12px',padding:'20px',marginBottom:'12px'}}>
            <div style={{fontSize:'17px',fontWeight:'700',color:'var(--txt,#f0f2ff)',marginBottom:'6px'}}>{ev.title}</div>
            <div style={{fontSize:'13px',color:'var(--mut,#7b82a8)',marginBottom:'12px'}}>{ev.description}</div>
            <div style={{display:'flex',gap:'16px',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                <span style={{fontSize:'12px',color:'#38bdf8'}}>📅 {new Date(ev.eventDate).toLocaleString()}</span>
                <span style={{fontSize:'12px',color:'#22d3a0'}}>📍 {ev.venue}</span>
                <span style={{fontSize:'12px',color:'#f5a623'}}>👥 Max {ev.maxCapacity}</span>
              </div>
              <button onClick={() => handleRegister(ev.id)}
                      style={{background:'#6c63ff',color:'#fff',border:'none',borderRadius:'6px',
                              padding:'8px 16px',fontSize:'13px',fontWeight:'bold',cursor:'pointer'}}>
                Register Now
              </button>
            </div>
          </div>
        ))}
        {!loading && events.length === 0 && (
          <p style={{color:'var(--mut,#7b82a8)',textAlign:'center',padding:'40px'}}>No upcoming events</p>
        )}
      </div>
    </div>
  );
}