// src/pages/resident/MyBookingsPage.jsx
// Shows all bookings for the logged-in resident
// Can cancel CONFIRMED bookings
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(res => { setBookings(res.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load bookings'); setLoading(false); });
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingApi.cancel(bookingId);
      toast.success('Booking cancelled');
      // Refresh the list
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b)
      );
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancel failed');
    }
  };

  const statusColor = (s) => s === 'CONFIRMED'
    ? { color:'#22d3a0', background:'rgba(34,211,160,0.1)', border:'1px solid rgba(34,211,160,0.3)' }
    : { color:'#ff5f7e', background:'rgba(255,95,126,0.1)', border:'1px solid rgba(255,95,126,0.3)' };

  return (
    <div style={{ minHeight:'100vh', background:'#0c0e14' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>
        <h2 style={{ fontSize:'22px', fontWeight:'800', color:'#f0f2ff', marginBottom:'6px' }}>
          📅 My Bookings
        </h2>
        <p style={{ color:'#7b82a8', fontSize:'14px', marginBottom:'24px' }}>
          All your facility bookings
        </p>

        {loading && <p style={{ color:'#7b82a8' }}>Loading...</p>}

        {!loading && bookings.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#7b82a8' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
            <p>No bookings yet.</p>
            <button onClick={() => navigate('/facilities')} style={primaryBtn}>
              Book a Facility
            </button>
          </div>
        )}

        {bookings.map(b => (
          <div key={b.id} style={bookingCard}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px' }}>
              <div>
                <div style={{ fontSize:'16px', fontWeight:'700', color:'#f0f2ff', marginBottom:'4px' }}>
                  {b.facilityName}
                </div>
                <div style={{ fontSize:'13px', color:'#7b82a8' }}>
                  📅 {b.slotDate} &nbsp;·&nbsp; 🕐 {b.startTime} – {b.endTime}
                </div>
                <div style={{ fontSize:'13px', color:'#7b82a8', marginTop:'4px' }}>
                  👥 {b.memberCount} people &nbsp;·&nbsp; 📝 {b.purpose}
                </div>
              </div>
              <span style={{ ...statusBadge, ...statusColor(b.status) }}>{b.status}</span>
            </div>

            {b.status === 'CONFIRMED' && (
              <button onClick={() => handleCancel(b.id)} style={cancelBtn}>
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const bookingCard = { background:'#13151f', border:'1px solid #232636', borderRadius:'12px', padding:'18px', marginBottom:'12px' };
const statusBadge = { fontSize:'11px', fontWeight:'700', padding:'3px 10px', borderRadius:'6px', fontFamily:'monospace', flexShrink:0 };
const cancelBtn   = { marginTop:'12px', background:'transparent', border:'1px solid rgba(255,95,126,0.4)', color:'#ff5f7e', borderRadius:'7px', padding:'7px 14px', cursor:'pointer', fontSize:'12px', fontWeight:'600' };
const primaryBtn  = { marginTop:'16px', background:'#6c63ff', color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', fontSize:'14px', fontWeight:'700' };