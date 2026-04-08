import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Phone, Home, Shield, ShieldCheck, ArrowRight } from 'lucide-react';

const schema = z.object({
  name:     z.string().min(2,  'Name required'),
  email:    z.string().email(  'Valid email required'),
  password: z.string().min(6,  'Min 6 characters'),
  role:     z.enum(['RESIDENT','ADMIN','SECURITY']),
  flatNo:   z.string().optional(),
  phone:    z.string().optional(),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch,
          formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'RESIDENT' },
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    try {
      await authApi.register(data);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:'24px'}}>
            <div style={{background:'rgba(108,99,255,0.1)', padding:'12px', borderRadius:'14px', border:'1px solid rgba(108,99,255,0.2)'}}>
                <UserPlus size={32} color="#6c63ff" />
            </div>
        </div>
        <h2 style={{fontSize:'24px',fontWeight:'800',color:'#f0f2ff',marginBottom:'8px', textAlign:'center'}}>
          Create Account
        </h2>
        <p style={{color:'#7b82a8',fontSize:'14px',marginBottom:'32px', textAlign:'center'}}>
          Join Urbanio to manage your community easily
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {[
            {name:'name',     label:'Full Name',       ph:'John Doe', icon: <User size={14} />},
            {name:'email',    label:'Email',            ph:'you@example.com', icon: <Mail size={14} />},
            {name:'password', label:'Password',         ph:'••••••', type:'password', icon: <Lock size={14} />},
            {name:'phone',    label:'Phone (optional)', ph:'+91 9999999999', icon: <Phone size={14} />},
          ].map(f => (
            <div key={f.name} style={{marginBottom:'16px'}}>
              <label style={L}>
                <span style={{verticalAlign:'middle', marginRight:'6px', display:'inline-flex'}}>{f.icon}</span> {f.label}
              </label>
              <input {...register(f.name)} type={f.type||'text'} placeholder={f.ph} style={I} />
              {errors[f.name] && <span style={E}>{errors[f.name].message}</span>}
            </div>
          ))}

          <div style={{marginBottom:'16px'}}>
            <label style={L}>
                <span style={{verticalAlign:'middle', marginRight:'6px', display:'inline-flex'}}><Shield size={14} /></span> Role
            </label>
            <select {...register('role')} style={I}>
              <option value="RESIDENT">Resident</option>
              <option value="ADMIN">Admin</option>
              <option value="SECURITY">Security</option>
            </select>
          </div>

          {role === 'RESIDENT' && (
            <div style={{marginBottom:'24px'}}>
              <label style={L}>
                <span style={{verticalAlign:'middle', marginRight:'6px', display:'inline-flex'}}><Home size={14} /></span> Flat Number
              </label>
              <input {...register('flatNo')} placeholder="e.g. A-204" style={I} />
            </div>
          )}

          <button type="submit" disabled={isSubmitting} style={B}>
            {isSubmitting ? 'Creating...' : 'Create Account'} <ArrowRight size={18} style={{marginLeft:'8px'}} />
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'24px',fontSize:'14px',color:'#7b82a8'}}>
          Have account? <Link to="/login" style={{color:'#6c63ff',fontWeight:'600'}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const page={minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0c0e14', padding:'40px 20px', color:'#f0f2ff'};
const card={width:'100%',maxWidth:'440px',background:'#13151f',border:'1px solid #232636',borderRadius:'20px',padding:'40px', boxShadow:'0 10px 40px rgba(0,0,0,0.5)'};
const L={display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px',color:'#f0f2ff'};
const I={width:'100%',background:'#1a1d2a',border:'1px solid #2e3248',borderRadius:'10px',padding:'12px 14px',color:'#f0f2ff',fontSize:'14px',outline:'none',boxSizing:'border-box', transition:'border-color 0.2s'};
const E={color:'#ff5f7e',fontSize:'12px',marginTop:'6px',display:'block'};
const B={width:'100%',background:'#6c63ff',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',fontSize:'16px',fontWeight:'700',cursor:'pointer',marginTop:'12px', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s'};
