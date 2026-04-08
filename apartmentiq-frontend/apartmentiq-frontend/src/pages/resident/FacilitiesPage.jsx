// src/pages/resident/FacilitiesPage.jsx
// This page shows all facility cards
// Clicking a card opens the slot picker for that facility
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilitiesApi } from '../../api/facilitiesApi';
import toast from 'react-hot-toast';
// Icon map — shows a relevant emoji for each facility type
const ICONS = {
  POOL:       '🏊',
  GYM:        '🏋️',
  PARTY_HALL: '🎉',
  TURF:       '⚽',
  THEATRE:    '🎭',
};

export default function FacilitiesPage() {
  const navigate = useNavigate();

  // useState stores the list of facilities
  // [] = empty array at start, then filled after API call
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading]       = useState(true);

  // useEffect runs ONCE when the page loads ([] = run once)
  // Calls the API and puts the result in state
  useEffect(() => {
    facilitiesApi.getAll()
      .then(res => {
        setFacilities(res.data);   // res.data = the array Spring Boot returned
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load facilities');
        setLoading(false);
      });
  }, []);  // <-- [] means "run only on first render"

  if (loading) return <p style={loadStyle}>Loading facilities...</p>;

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
      <h2 style={titleStyle}>🏢 Book a Facility</h2>
      <p style={subStyle}>Select a facility to view available time slots</p>

      <div style={gridStyle}>
        {facilities.map(facility => (
          <div
            key={facility.id}
            style={cardStyle}
            onClick={() => navigate('/facilities/' + facility.id)}
          >
            <div style={iconStyle}>{ICONS[facility.type] || '🏠'}</div>
            <div style={nameStyle}>{facility.name}</div>
            <div style={infoStyle}>
              👥 Max {facility.capacity} people
            </div>
            <div style={infoStyle}>
              🕐 {facility.openTime} – {facility.closeTime}
            </div>
            {facility.rules && (
              <div style={rulesStyle}>{facility.rules}</div>
            )}
            <button style={btnStyle}>View Slots →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Styles ───────────────────────────────────────────
const titleStyle = { fontSize:'24px', fontWeight:'800', color:'#f0f2ff', marginBottom:'6px' };
const subStyle   = { color:'#7b82a8', fontSize:'14px', marginBottom:'28px' };
const gridStyle  = { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'16px' };
const cardStyle  = {
  background:'#13151f', border:'1px solid #232636', borderRadius:'14px',
  padding:'22px', cursor:'pointer', transition:'border-color 0.15s',
};
const iconStyle  = { fontSize:'36px', marginBottom:'12px' };
const nameStyle  = { fontSize:'17px', fontWeight:'700', color:'#f0f2ff', marginBottom:'10px' };
const infoStyle  = { fontSize:'13px', color:'#7b82a8', marginBottom:'4px' };
const rulesStyle = { fontSize:'12px', color:'#7b82a8', marginTop:'10px', fontStyle:'italic',
                     background:'#1a1d2a', borderRadius:'6px', padding:'8px 10px' };
const btnStyle   = { marginTop:'16px', width:'100%', background:'#6c63ff', color:'#fff',
                     border:'none', borderRadius:'8px', padding:'10px', fontWeight:'700',
                     fontSize:'13px', cursor:'pointer' };
const loadStyle  = { color:'#7b82a8', padding:'40px', textAlign:'center' };