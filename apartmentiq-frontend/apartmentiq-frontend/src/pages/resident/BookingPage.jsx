// src/pages/resident/BookingPage.jsx
// This page is reached from FacilityDetailPage
// State passed via navigate():  slotId, facilityId, facilityName, date
// State passed via navigate():  slotId, facilityId, facilityName, date
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bookingApi } from '../../api/bookingApi';
import toast from 'react-hot-toast';

const schema = z.object({
  memberCount: z.coerce.number().min(1, 'At least 1 person'),
  purpose:     z.string().min(3, 'Please describe the purpose'),
});

export default function BookingPage() {
  const navigate    = useNavigate();
  const { state }   = useLocation();  // receives data from FacilityDetailPage

  const { register, handleSubmit, formState: { errors, isSubmitting } }
    = useForm({ resolver: zodResolver(schema), defaultValues: { memberCount: 1 } });

  // If someone navigates here directly without selecting a slot
  if (!state?.slotId) {
    navigate('/facilities');
    return null;
  }

  const { slotId, facilityId, facilityName, date, startTime, endTime } = state;

  const onSubmit = async (formData) => {
    try {
      await bookingApi.book({
        slotId,
        facilityId: parseInt(facilityId),
        memberCount: formData.memberCount,
        purpose:     formData.purpose,
      });
      toast.success('Slot booked successfully! 🎉');
      navigate('/my-bookings');
    } catch (err) {
      // 409 = slot conflict — someone else just booked it
      if (err.response?.status === 409) {
        toast.error('Sorry! This slot was just booked by someone else. Please pick another.');
        navigate('/facilities/' + facilityId);
      } else {
        toast.error(err.response?.data?.error || 'Booking failed. Try again.');
      }
    }
  };

  return (
    <div style={{ maxWidth:'580px', margin:'0 auto' }}>
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

      <h2 style={titleStyle}>Confirm Your Booking</h2>

      {/* Booking Summary Card */}
      <div style={summaryCard}>
        <div style={summaryRow}><span style={summaryLabel}>🏢 Facility</span><span style={summaryVal}>{facilityName}</span></div>
        <div style={summaryRow}><span style={summaryLabel}>📅 Date</span><span style={summaryVal}>{date}</span></div>
        <div style={summaryRow}><span style={summaryLabel}>🕐 Time</span><span style={summaryVal}>{startTime} – {endTime}</span></div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
        <div style={fieldWrap}>
          <label style={labelS}>Number of People</label>
          <input {...register('memberCount')} type="number" min="1"
                 placeholder="e.g. 4" style={inputS} />
          {errors.memberCount && <span style={errS}>{errors.memberCount.message}</span>}
        </div>

        <div style={fieldWrap}>
          <label style={labelS}>Purpose / Reason</label>
          <textarea {...register('purpose')}
            placeholder="e.g. Birthday party, Morning workout, Family get-together..."
            rows={3} style={{...inputS, resize:'vertical'}} />
          {errors.purpose && <span style={errS}>{errors.purpose.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} style={bookBtn}>
          {isSubmitting ? 'Booking...' : '✅ Confirm Booking'}
        </button>
      </form>
    </div>
  );
}

const titleStyle  = { fontSize:'24px', fontWeight:'800', color:'#f0f2ff', marginBottom:'22px' };
const summaryCard = { background:'#13151f', border:'1px solid #232636', borderRadius:'12px', padding:'18px', marginBottom:'24px' };
const summaryRow  = { display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #232636' };
const summaryLabel= { fontSize:'13px', color:'#7b82a8' };
const summaryVal  = { fontSize:'13px', fontWeight:'600', color:'#f0f2ff' };
const formStyle   = { background:'#13151f', border:'1px solid #232636', borderRadius:'12px', padding:'22px' };
const fieldWrap   = { marginBottom:'16px' };
const labelS      = { display:'block', fontSize:'13px', fontWeight:'600', marginBottom:'6px', color:'#f0f2ff' };
const inputS      = { width:'100%', background:'#1a1d2a', border:'1px solid #2e3248', borderRadius:'8px', padding:'10px 14px', color:'#f0f2ff', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
const errS        = { color:'#ff5f7e', fontSize:'12px', marginTop:'4px', display:'block' };
const bookBtn     = { width:'100%', background:'#22d3a0', color:'#0c0e14', border:'none', borderRadius:'10px', padding:'13px', fontSize:'15px', fontWeight:'800', cursor:'pointer', marginTop:'8px' };