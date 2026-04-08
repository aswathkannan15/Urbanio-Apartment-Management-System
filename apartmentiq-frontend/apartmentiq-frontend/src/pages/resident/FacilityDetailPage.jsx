// src/pages/resident/FacilityDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facilitiesApi } from '../../api/facilitiesApi';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
 
// ── Walk-in Entry Component (for Gym, no slot booking needed) ──
function WalkInEntry({ facility }) {
  // Check if resident is already inside
  const [entryId, setEntryId] = useState(null);
  const [occupancy, setOccupancy] = useState(0);
  const [loadingEntry, setLoadingEntry] = useState(true);
 
  // Load current occupancy and personal status when component appears
  useEffect(() => {
    Promise.all([
      api.get('/gym/occupancy/' + facility.id).catch(() => ({ data: { current: 0 } })),
      api.get('/gym/status/' + facility.id).catch(() => ({ data: { isInside: false } }))
    ]).then(([occRes, statRes]) => {
      setOccupancy(occRes.data.current);
      if (statRes.data.isInside) {
        setEntryId(String(statRes.data.entryId));
      }
      setLoadingEntry(false);
    });
  }, [facility.id]);
 
  const handleEnter = async () => {
    setLoadingEntry(true);
    try {
      const r = await api.post('/gym/enter/' + facility.id);
      const id = String(r.data.entryId);
      setEntryId(id);
      setOccupancy(o => o + 1);
      toast.success('Entry logged! Enjoy your workout 💪');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to log entry');
    }
    setLoadingEntry(false);
  };
 
  const handleExit = async () => {
    if (!entryId) return;
    setLoadingEntry(true);
    try {
      await api.put('/gym/exit/' + entryId);
      setEntryId(null);
      setOccupancy(o => Math.max(0, o - 1));
      toast.success('Exit logged! Great workout 🎉');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to log exit');
    }
    setLoadingEntry(false);
  };
 
  const isFull = occupancy >= facility.capacity;
 
  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto' }}>
      {/* Occupancy bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#7b82a8', fontWeight: '600' }}>
            Current Occupancy
          </span>
          <span style={{ fontSize: '13px', fontWeight: '800',
                         color: isFull ? '#ff5f7e' : '#22d3a0' }}>
            {occupancy} / {facility.capacity} people
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ background: '#1a1d2a', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '100px',
            width: Math.min((occupancy / facility.capacity) * 100, 100) + '%',
            background: isFull ? '#ff5f7e' : '#22d3a0',
            transition: 'width 0.3s',
          }} />
        </div>
        {isFull && !entryId && (
          <p style={{ color: '#ff5f7e', fontSize: '12px', marginTop: '8px', fontWeight: '600' }}>
            ⚠️ Gym is at full capacity. Please wait for someone to exit.
          </p>
        )}
      </div>
 
      {/* Info row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={infoPill}>🕐 {facility.openTime} – {facility.closeTime}</span>
        <span style={infoPill}>🏋️ No booking needed</span>
        <span style={infoPill}>📋 Walk-in only</span>
      </div>
 
      {/* Rules */}
      {facility.rules && (
        <div style={{ background: '#1a1d2a', borderRadius: '8px', padding: '12px 14px',
                      fontSize: '13px', color: '#7b82a8', marginBottom: '24px',
                      fontStyle: 'italic' }}>
          📋 {facility.rules}
        </div>
      )}
 
      {/* Enter / Exit button */}
      {!entryId ? (
        <button
          onClick={handleEnter}
          disabled={loadingEntry || isFull}
          style={{
            ...enterBtn,
            opacity: (loadingEntry || isFull) ? 0.5 : 1,
            cursor:  (loadingEntry || isFull) ? 'not-allowed' : 'pointer',
          }}
        >
          {loadingEntry ? 'Logging entry...' : isFull ? '⚠️ Gym Full' : '✅ Enter Gym'}
        </button>
      ) : (
        <div>
          <div style={{ background: 'rgba(34,211,160,0.08)', border: '1px solid rgba(34,211,160,0.25)',
                        borderRadius: '10px', padding: '14px 16px', marginBottom: '14px',
                        fontSize: '13px', color: '#22d3a0', fontWeight: '600' }}>
            ✓ You are currently logged inside the gym
          </div>
          <button
            onClick={handleExit}
            disabled={loadingEntry}
            style={{
              ...exitBtn,
              opacity: loadingEntry ? 0.5 : 1,
              cursor:  loadingEntry ? 'not-allowed' : 'pointer',
            }}
          >
            {loadingEntry ? 'Logging exit...' : '🚪 Exit Gym'}
          </button>
        </div>
      )}
    </div>
  );
}
 
// ── Main Page ──────────────────────────────────────────────────
export default function FacilityDetailPage() {
 
  const { id } = useParams();
  const navigate = useNavigate();
 
  const todayStr = new Date().toISOString().split('T')[0];
 
  const [facility,     setFacility]     = useState(null);
  const [slots,        setSlots]        = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading,      setLoading]      = useState(false);
 
  // Load facility info once when page opens
  useEffect(() => {
    facilitiesApi.getAll().then(res => {
      const found = res.data.find(f => f.id === parseInt(id));
      setFacility(found);
    });
  }, [id]);
 
  // Load slots whenever the selected date changes
  // BUT only if this facility REQUIRES booking (not gym)
  useEffect(() => {
    if (!id) return;
    if (facility && facility.requiresBooking === false) return; // skip for gym
 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setSelectedSlot(null);
    facilitiesApi.getSlots(id, selectedDate)
      .then(res => {
        setSlots(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load slots');
        setLoading(false);
      });
  }, [id, selectedDate, facility]);
 
  const handleSlotClick = (slot) => {
    if (slot.status === 'BOOKED') return;
    setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
  };
 
  const handleBook = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot first');
      return;
    }
    const slot = slots.find(s => s.id === selectedSlot);
    navigate('/book', {
      state: {
        slotId:       selectedSlot,
        facilityId:   id,
        facilityName: facility?.name,
        date:         selectedDate,
        startTime:    slot?.startTime,
        endTime:      slot?.endTime,
      }
    });
  };
 
  const slotColor = (slot) => {
    if (slot.status === 'BOOKED')   return booked;
    if (slot.id === selectedSlot)   return selected;
    return free;
  };
 
  return (
    <div style={{minHeight:'100vh',background:'#0c0e14'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>
        <button onClick={() => navigate('/facilities')} className="btn-back">
          ← Back to Facilities
        </button>
 
        {/* Facility Header */}
        {facility && (
          <div style={headerBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px' }}>
                {{ POOL:'🏊', GYM:'🏋️', PARTY_HALL:'🎉', TURF:'⚽', THEATRE:'🎭' }[facility.type] || '🏠'}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#f0f2ff' }}>
                {facility.name}
              </h2>
              {/* Walk-in badge */}
              {facility.requiresBooking === false && (
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                               borderRadius: '6px', background: 'rgba(34,211,160,0.1)',
                               color: '#22d3a0', border: '1px solid rgba(34,211,160,0.3)' }}>
                  WALK-IN
                </span>
              )}
            </div>
            <p style={{ color: '#7b82a8', fontSize: '14px' }}>
              👥 Max {facility.capacity} people &nbsp;·&nbsp;
              🕐 {facility.openTime} – {facility.closeTime}
            </p>
          </div>
        )}
 
        {/* ── WALK-IN FACILITY (Gym) ── */}
        {facility && facility.requiresBooking === false && (
          <WalkInEntry facility={facility} />
        )}
 
        {/* ── BOOKING FACILITY (Pool, Hall, Turf etc.) ── */}
        {facility && facility.requiresBooking !== false && (
          <div>
            {/* Date Picker */}
            <div style={dateBox}>
              <label style={{ color: '#f0f2ff', fontWeight: '600', fontSize: '14px', marginRight: '12px' }}>
                📅 Select Date:
              </label>
              <input
                type="date"
                value={selectedDate}
                min={todayStr}
                onChange={e => setSelectedDate(e.target.value)}
                style={dateInput}
              />
            </div>
 
            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ ...legendDot, background: 'rgba(34,211,160,0.15)', color: '#22d3a0', border: '2px solid #22d3a0' }}>✓ Available</span>
              <span style={{ ...legendDot, background: 'rgba(255,95,126,0.15)', color: '#ff5f7e', border: '2px solid #ff5f7e' }}>✗ Booked</span>
              <span style={{ ...legendDot, background: '#6c63ff', color: '#fff', border: '2px solid #6c63ff' }}>● Selected</span>
            </div>
 
            {/* Slots Grid */}
            {loading ? (
              <p style={{ color: '#7b82a8', padding: '20px 0' }}>Loading slots...</p>
            ) : (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {slots.map(slot => (
                  <div key={slot.id} style={slotColor(slot)} onClick={() => handleSlotClick(slot)}>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>
                      {slot.startTime} – {slot.endTime}
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
                      {slot.status === 'BOOKED' ? '✗ Booked'
                       : slot.id === selectedSlot ? '● Selected'
                       : '✓ Free'}
                    </div>
                  </div>
                ))}
                {slots.length === 0 && (
                  <p style={{ color: '#7b82a8' }}>No slots available for this date.</p>
                )}
              </div>
            )}
 
            {/* Book Button */}
            {selectedSlot && (
              <button onClick={handleBook} style={bookBtn}>
                Confirm Slot & Continue →
              </button>
            )}
          </div>
        )}
 
      </div>
    </div>
  );
}
 
// ── Styles ────────────────────────────────────────────────────
const pageStyle  = { maxWidth: '800px', margin: '0 auto', padding: '28px 20px 60px' };
const backBtn    = { background: 'transparent', border: '1px solid #2e3248', color: '#7b82a8',
                     borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
                     fontSize: '13px', marginBottom: '20px', display: 'inline-block' };
const headerBox  = { background: '#13151f', border: '1px solid #232636', borderRadius: '12px',
                     padding: '20px', marginBottom: '20px' };
const dateBox    = { display: 'flex', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' };
const dateInput  = { background: '#1a1d2a', border: '1px solid #2e3248', borderRadius: '8px',
                     padding: '8px 12px', color: '#f0f2ff', fontSize: '14px', outline: 'none' };
const legendDot  = { padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' };
const free       = { padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                     background: 'rgba(34,211,160,0.1)', border: '2px solid #22d3a0', color: '#22d3a0' };
const booked     = { padding: '12px 16px', borderRadius: '10px', cursor: 'not-allowed',
                     background: 'rgba(255,95,126,0.1)', border: '2px solid #ff5f7e', color: '#ff5f7e' };
const selected   = { padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                     background: '#6c63ff', border: '2px solid #6c63ff', color: '#fff' };
const bookBtn    = { background: '#22d3a0', color: '#0c0e14', border: 'none', borderRadius: '10px',
                     padding: '14px 28px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' };
 
// WalkInEntry styles
const walkInBox  = { background: '#13151f', border: '1px solid #232636', borderRadius: '14px', padding: '24px' };
const infoPill   = { fontSize: '12px', color: '#7b82a8', background: '#1a1d2a',
                     border: '1px solid #2e3248', borderRadius: '20px', padding: '5px 12px' };
const enterBtn   = { width: '100%', background: '#22d3a0', color: '#0c0e14', border: 'none',
                     borderRadius: '10px', padding: '14px', fontSize: '16px', fontWeight: '800' };
const exitBtn    = { width: '100%', background: '#ff5f7e', color: '#fff', border: 'none',
                     borderRadius: '10px', padding: '14px', fontSize: '16px', fontWeight: '800' };