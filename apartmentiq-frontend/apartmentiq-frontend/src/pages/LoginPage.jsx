import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
});
const ROUTES = { RESIDENT:'/dashboard', ADMIN:'/admin', SECURITY:'/gate' };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } }
    = useForm({ resolver: zodResolver(schema) });

  if (isAuthenticated && user)
    return <Navigate to={ROUTES[user.role] || '/dashboard'} replace />;

  const onSubmit = async (data) => {
    try {
      const role = await login(data);
      toast.success('Welcome back!');
      navigate(ROUTES[role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={{display:'flex', justifyContent:'center', marginBottom:'24px'}}>
          <div style={{background:'rgba(108,99,255,0.1)', padding:'12px', borderRadius:'12px', border:'1px solid rgba(108,99,255,0.2)'}}>
            <LogIn size={32} color="#6c63ff" />
          </div>
        </div>
        <h2 style={{fontSize:'24px',fontWeight:'800',color:'#f0f2ff',marginBottom:'8px', textAlign:'center'}}>
          Welcome back 👋
        </h2>
        <p style={{color:'#7b82a8',fontSize:'14px',marginBottom:'32px', textAlign:'center'}}>
          Urbanio — Sign in to continue
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{marginBottom:'16px'}}>
            <label style={lbl}><Mail size={14} style={{verticalAlign:'middle', marginRight:'6px'}} /> Email</label>
            <input {...register('email')} placeholder="you@example.com" style={inp} />
            {errors.email && <span style={err}>{errors.email.message}</span>}
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={lbl}><Lock size={14} style={{verticalAlign:'middle', marginRight:'6px'}} /> Password</label>
            <input {...register('password')} type="password" placeholder="••••••" style={inp} />
            {errors.password && <span style={err}>{errors.password.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} style={btn}>
            {isSubmitting ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} style={{marginLeft:'8px', verticalAlign:'middle'}} />
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'24px',fontSize:'14px',color:'#7b82a8'}}>
          No account? <Link to="/register" style={{color:'#6c63ff',fontWeight:'600'}}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

const page = {minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0c0e14', color:'#f0f2ff'};
const card = {width:'100%',maxWidth:'400px',background:'#13151f',border:'1px solid #232636',borderRadius:'20px',padding:'40px', boxShadow:'0 10px 40px rgba(0,0,0,0.5)'};
const lbl  = {display:'block',fontSize:'13px',fontWeight:'600',marginBottom:'8px',color:'#f0f2ff'};
const inp  = {width:'100%',background:'#1a1d2a',border:'1px solid #2e3248',borderRadius:'10px',padding:'12px 14px',color:'#f0f2ff',fontSize:'14px',outline:'none',boxSizing:'border-box', transition:'border-color 0.2s'};
const err  = {color:'#ff5f7e',fontSize:'12px',marginTop:'6px',display:'block'};
const btn  = {width:'100%',background:'#6c63ff',color:'#fff',border:'none',borderRadius:'10px',padding:'14px',fontSize:'16px',fontWeight:'700',cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s'};