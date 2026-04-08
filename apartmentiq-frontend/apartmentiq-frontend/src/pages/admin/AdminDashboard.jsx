import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import NotificationBell from '../../components/NotificationBell';
import { 
  LayoutDashboard, Users, Truck, Wrench, Megaphone, Calendar, 
  ShieldCheck, User, LogOut, RefreshCw, Phone, Home, Car, Plus
} from 'lucide-react';

const COLORS = ['#6c63ff','#22d3a0','#f5a623','#ff5f7e','#38bdf8'];
const STATUS_C = { OPEN:{c:'#f5a623',bg:'rgba(245,166,35,0.1)'}, IN_PROGRESS:{c:'#38bdf8',bg:'rgba(56,189,248,0.1)'}, RESOLVED:{c:'#22d3a0',bg:'rgba(34,211,160,0.1)'} };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]         = useState('overview');
  const [analytics, setAna]   = useState(null);
  const [visitors,  setVis]   = useState([]);
  const [residents, setRes]   = useState([]);
  const [maintenance, setMnt] = useState([]);
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    api.get('/admin/analytics').then(r => setAna(r.data)).catch(()=>{});
    api.get('/maintenance/all').then(r => setMnt(r.data)).catch(()=>{});
  }, []);

  const loadVisitors = () =>
    api.get('/admin/visitors').then(r => setVis(r.data)).catch(()=>{});

  const loadResidents = () =>
    api.get('/admin/residents').then(r => setRes(r.data)).catch(()=>{});

  useEffect(() => {
    if (tab==='visitors')  loadVisitors();
    if (tab==='residents') loadResidents();
  }, [tab]);

  const updateMnt = async (id, status) => {
    await api.put('/maintenance/'+id+'/status', { status });
    api.get('/maintenance/all').then(r => setMnt(r.data));
    toast.success('Status updated');
  };

  const approveResident = async (id) => {
    await api.put('/admin/residents/'+id+'/approve');
    toast.success('Resident approved');
    loadResidents();
  };

  const sendAnnouncement = async () => {
    if (!announce.trim()) return;
    await api.post('/admin/announce', { message: announce });
    toast.success('Announcement sent to all residents!');
    setAnnounce('');
  };

  const TABS = [
    {id:'overview',  label:'Overview', icon: <LayoutDashboard size={14} />},
    {id:'visitors',  label:'Visitors', icon: <Truck size={14} />},
    {id:'residents', label:'Residents', icon: <Users size={14} />},
    {id:'maintenance',label:'Maintenance', icon: <Wrench size={14} />},
    {id:'announce',  label:'Announce', icon: <Megaphone size={14} />},
    {id:'events',    label:'Events', icon: <Calendar size={14} />},
  ];

  const [eventForm, setEventForm] = useState({
    title: '', description: '', eventDate: '', maxCapacity: '', venue: ''
  });

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.eventDate) return;
    try {
      await api.post('/events', eventForm);
      toast.success('Event created and announced!');
      setEventForm({title: '', description: '', eventDate: '', maxCapacity: '', venue: ''});
    } catch (e) {
      toast.error('Failed to create event');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#0c0e14', color:'#f0f2ff'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                   padding:'16px 28px',background:'#13151f',borderBottom:'1px solid #232636'}}>
        <span style={{fontSize:'18px',fontWeight:'800',color:'#f5a623', display:'flex', alignItems:'center', gap:'10px'}}>
          <ShieldCheck size={24} /> Urbanio Admin Panel
        </span>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <NotificationBell />
          <span style={{fontSize:'12px',color:'#7b82a8',marginLeft:'8px', display:'flex', alignItems:'center', gap:'6px'}}>
            <User size={14} /> {user?.name}
          </span>
          <button onClick={()=>{logout();navigate('/login');}}
            style={{background:'rgba(255,95,126,0.1)',border:'1px solid rgba(255,95,126,0.3)',
                   color:'#ff5f7e',borderRadius:'7px',padding:'6px 12px',marginLeft:'8px',cursor:'pointer',fontSize:'12px',
                   display:'flex', alignItems:'center', gap:'6px'}}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'24px 20px'}}>
        {/* Tabs */}
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'24px'}}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:'9px 16px',borderRadius:'8px',border:'1px solid',cursor:'pointer',
                     fontWeight:'600',fontSize:'13px', display:'flex', alignItems:'center', gap:'8px',
                     background:tab===t.id?'#f5a623':'transparent',
                     color:tab===t.id?'#0c0e14':'#7b82a8',
                     borderColor:tab===t.id?'#f5a623':'#2e3248'}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && analytics && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px',marginBottom:'24px'}}>
              {[
                {l:'Residents',   v:analytics.totalResidents,  c:'#6c63ff'},
                {l:'Bookings',    v:analytics.totalBookings,   c:'#22d3a0'},
                {l:'Open Issues', v:analytics.openMaintenance, c:'#ff5f7e'},
                {l:"Today's Visitors",v:analytics.todayVisitors,c:'#38bdf8'},
              ].map(s=>(
                <div key={s.l} style={{background:'#13151f',border:'1px solid #232636',borderRadius:'12px',padding:'18px'}}>
                  <div style={{fontSize:'28px',fontWeight:'800',color:s.c}}>{s.v}</div>
                  <div style={{fontSize:'12px',color:'#7b82a8',marginTop:'4px'}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#13151f',border:'1px solid #232636',borderRadius:'14px',padding:'24px'}}>
              <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'20px'}}>Bookings per Facility</h3>
              {analytics.byFacility?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.byFacility}>
                    <XAxis dataKey="name" stroke="#7b82a8" tick={{fontSize:11}}/>
                    <YAxis stroke="#7b82a8" tick={{fontSize:11}}/>
                    <Tooltip contentStyle={{background:'#1a1d2a',border:'1px solid #2e3248',borderRadius:'8px',color:'#f0f2ff'}}/>
                    <Bar dataKey="bookings" radius={[4,4,0,0]}>
                      {analytics.byFacility.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{color:'#7b82a8',textAlign:'center',padding:'30px'}}>No bookings yet to chart</p>}
            </div>
          </div>
        )}

        {/* VISITORS */}
        {tab==='visitors' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <h3 style={{color:'#f0f2ff',fontWeight:'700'}}>All Visitors</h3>
              <button onClick={loadVisitors}
                style={{background:'transparent',border:'1px solid #2e3248',color:'#7b82a8',
                        borderRadius:'7px',padding:'6px 12px',cursor:'pointer',fontSize:'12px',
                        display:'flex', alignItems:'center', gap:'6px'}}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            {visitors.length===0 && <p style={{color:'#7b82a8',textAlign:'center',padding:'40px'}}>No visitors logged</p>}
            {visitors.map(v=>(
              <div key={v.id} style={{background:'#13151f',border:'1px solid #232636',borderRadius:'12px',
                                      padding:'14px 18px',marginBottom:'8px',
                                      display:'flex',alignItems:'center',gap:'14px'}}>
                {v.photoUrl
                  ? <img src={v.photoUrl} alt="visitor" style={{width:'48px',height:'48px',borderRadius:'8px',objectFit:'cover',flexShrink:0}}/>
                  : <div style={{width:'48px',height:'48px',borderRadius:'8px',background:'#1a1d2a',display:'grid',placeItems:'center',flexShrink:0}}>
                      <User size={24} color="#7b82a8" />
                    </div>
                }
                <div style={{flex:1}}>
                  <div style={{fontWeight:'700',color:'#f0f2ff'}}>{v.visitorName}</div>
                  <div style={{fontSize:'12px',color:'#7b82a8', display:'flex', gap:'12px'}}>
                    <span style={{display:'flex', alignItems:'center', gap:'4px'}}><Phone size={12} /> {v.phone}</span>
                    <span style={{display:'flex', alignItems:'center', gap:'4px'}}><Home size={12} /> Flat {v.flatToVisit}</span>
                    {v.vehicleNumber && <span style={{display:'flex', alignItems:'center', gap:'4px'}}><Car size={12} /> {v.vehicleNumber}</span>}
                  </div>
                  <div style={{fontSize:'11px',color:'#7b82a8',marginTop:'3px'}}>
                    IN: {v.inTime ? new Date(v.inTime).toLocaleString() : '—'} &nbsp;·&nbsp;
                    OUT: {v.outTime ? new Date(v.outTime).toLocaleString() : <span style={{color:'#22d3a0'}}>Still inside</span>}
                  </div>
                </div>
                <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 9px',borderRadius:'6px',
                              background:v.outTime?'rgba(34,211,160,0.1)':'rgba(245,166,35,0.1)',
                              color:v.outTime?'#22d3a0':'#f5a623',flexShrink:0}}>
                  {v.outTime ? 'EXITED' : 'INSIDE'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* RESIDENTS */}
        {tab==='residents' && (
          <div>
            <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'16px'}}>All Residents</h3>
            {residents.map(r=>(
              <div key={r.id} style={{background:'#13151f',border:'1px solid #232636',borderRadius:'12px',
                                      padding:'14px 18px',marginBottom:'8px',
                                      display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
                <div>
                  <div style={{fontWeight:'700',color:'#f0f2ff'}}>{r.name}</div>
                  <div style={{fontSize:'12px',color:'#7b82a8'}}>{r.email} · Flat {r.flatNo} · {r.phone}</div>
                </div>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <span style={{fontSize:'11px',fontWeight:'700',padding:'3px 9px',borderRadius:'6px',
                                background:r.isApproved?'rgba(34,211,160,0.1)':'rgba(255,95,126,0.1)',
                                color:r.isApproved?'#22d3a0':'#ff5f7e'}}>
                    {r.isApproved ? 'APPROVED' : 'PENDING'}
                  </span>
                  {!r.isApproved && (
                    <button onClick={()=>approveResident(r.id)}
                      style={{background:'#22d3a0',color:'#0c0e14',border:'none',borderRadius:'7px',
                             padding:'5px 12px',cursor:'pointer',fontSize:'12px',fontWeight:'700'}}>
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MAINTENANCE */}
        {tab==='maintenance' && (
          <div>
            <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'16px'}}>Maintenance Requests</h3>
            {maintenance.map(r=>{
              const sc = STATUS_C[r.status] || STATUS_C.OPEN;
              return (
                <div key={r.id} style={{background:'#13151f',border:'1px solid #232636',borderRadius:'12px',
                                        padding:'14px 18px',marginBottom:'8px',
                                        display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700',color:'#f0f2ff',marginBottom:'3px'}}>{r.title}</div>
                    <div style={{fontSize:'12px',color:'#7b82a8'}}>{r.category} · Flat {r.resident?.flatNo} · {r.resident?.name}</div>
                    {r.description && <div style={{fontSize:'12px',color:'#7b82a8',marginTop:'4px'}}>{r.description}</div>}
                  </div>
                  <select value={r.status} onChange={e=>updateMnt(r.id,e.target.value)}
                    style={{background:'#1a1d2a',border:'1px solid #2e3248',borderRadius:'7px',
                           padding:'6px 10px',color:'#f0f2ff',fontSize:'12px',cursor:'pointer',
                           borderColor:sc.bg}}>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              );
            })}
            {maintenance.length===0 && <p style={{color:'#7b82a8',textAlign:'center',padding:'40px'}}>No maintenance requests</p>}
          </div>
        )}

        {/* ANNOUNCE */}
        {tab==='announce' && (
          <div style={{maxWidth:'500px'}}>
            <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'8px', display:'flex', alignItems:'center', gap:'10px'}}>
              <Megaphone size={20} /> Broadcast to All Residents
            </h3>
            <p style={{color:'#7b82a8',fontSize:'13px',marginBottom:'18px'}}>
              This message will appear in every resident's notification bell instantly.
            </p>
            <textarea value={announce} onChange={e=>setAnnounce(e.target.value)}
              placeholder="e.g. Water supply will be off tomorrow 10am-2pm for maintenance..."
              rows={4}
              style={{width:'100%',background:'#13151f',border:'1px solid #232636',borderRadius:'10px',
                     padding:'14px',color:'#f0f2ff',fontSize:'14px',outline:'none',
                     resize:'vertical',marginBottom:'12px',boxSizing:'border-box',fontFamily:'inherit'}}/>
            <button onClick={sendAnnouncement}
              style={{background:'#f5a623',color:'#0c0e14',border:'none',borderRadius:'9px',
                     padding:'12px 24px',fontWeight:'800',fontSize:'14px',cursor:'pointer',
                     display:'flex', alignItems:'center', gap:'10px'}}>
              <Megaphone size={18} /> Send to All Residents
            </button>
          </div>
        )}

        {/* EVENTS */}
        {tab==='events' && (
          <div style={{maxWidth:'500px'}}>
            <h3 style={{color:'#f0f2ff',fontWeight:'700',marginBottom:'8px', display:'flex', alignItems:'center', gap:'10px'}}>
              <Calendar size={20} /> Create Society Event
            </h3>
            <div style={{background:'#13151f',border:'1px solid #232636',borderRadius:'10px',padding:'16px'}}>
              <input value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} placeholder="Event Title" style={{width:'100%',marginBottom:'10px',padding:'10px',borderRadius:'6px',background:'#1a1d2a',color:'#fff',border:'1px solid #2e3248'}}/>
              <textarea value={eventForm.description} onChange={e=>setEventForm({...eventForm,description:e.target.value})} placeholder="Event Description" style={{width:'100%',marginBottom:'10px',padding:'10px',borderRadius:'6px',background:'#1a1d2a',color:'#fff',border:'1px solid #2e3248'}}/>
              <input type="datetime-local" value={eventForm.eventDate} onChange={e=>setEventForm({...eventForm,eventDate:e.target.value})} style={{width:'100%',marginBottom:'10px',padding:'10px',borderRadius:'6px',background:'#1a1d2a',color:'#fff',border:'1px solid #2e3248'}}/>
              <input type="number" value={eventForm.maxCapacity} onChange={e=>setEventForm({...eventForm,maxCapacity:e.target.value})} placeholder="Max Capacity" style={{width:'100%',marginBottom:'10px',padding:'10px',borderRadius:'6px',background:'#1a1d2a',color:'#fff',border:'1px solid #2e3248'}}/>
              <input value={eventForm.venue} onChange={e=>setEventForm({...eventForm,venue:e.target.value})} placeholder="Venue" style={{width:'100%',marginBottom:'10px',padding:'10px',borderRadius:'6px',background:'#1a1d2a',color:'#fff',border:'1px solid #2e3248'}}/>
              <button onClick={createEvent} style={{width:'100%',background:'#38bdf8',color:'#0c0e14',border:'none',borderRadius:'9px',padding:'10px',fontWeight:'bold',cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                <Plus size={18} /> Create Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}