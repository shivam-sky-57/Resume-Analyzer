import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconFileText, IconBrandGoogle, IconArrowRight, IconEye, IconEyeOff, IconCheck, IconMail, IconLock } from '@tabler/icons-react';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6 font-sans">
      {!showForgot ? (
        /* ─── LOGIN SCREEN ─── */
        <div className="w-full max-w-[400px] bg-white rounded-card border-[0.5px] border-black/10 shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <IconFileText className="text-white w-7 h-7" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-slate">ResumeIQ</h1>
              <p className="text-[14px] text-neutral-slate/50 font-medium">Welcome back</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {error && <div className="p-3 rounded-lg bg-danger/10 text-danger text-xs font-bold">{error}</div>}
            
            <div>
              <label className="label-text">Email Address</label>
              <input 
                type="email" required className="input-field" placeholder="john@example.com"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <div className="flex justify-between items-end mb-1.5">
                <label className="label-text !mb-0">Password</label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-[12px] font-bold text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} required className="input-field pr-12" placeholder="••••••••"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-slate/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 !py-3.5 shadow-xl shadow-primary/20">
              {loading ? 'Signing in...' : 'Sign in'} <IconArrowRight size={18} />
            </button>
          </form>

          <div className="flex items-center gap-4 py-8">
            <div className="h-[0.5px] bg-black/10 flex-1" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-slate/40">or continue with</span>
            <div className="h-[0.5px] bg-black/10 flex-1" />
          </div>

          <button className="btn-secondary w-full !py-3">
            <IconBrandGoogle size={20} className="text-[#DB4437]" /> Google
          </button>

          <p className="text-center text-[14px] text-neutral-slate/60 mt-8">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      ) : (
        /* ─── FORGOT PASSWORD FLOW (3 STATES) ─── */
        <div className="flex flex-col gap-10 w-full max-w-[400px]">
          <button onClick={() => setShowForgot(false)} className="flex items-center gap-2 text-neutral-slate/40 hover:text-primary font-bold text-sm transition-colors">
            <IconArrowRight className="rotate-180" size={16} /> Back to login
          </button>

          {/* State A: Request */}
          <div className="bg-white rounded-card border-[0.5px] border-black/10 p-8 shadow-lg">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
              Reset Password
            </h3>
            <div className="flex flex-col gap-4">
              <input type="email" className="input-field" placeholder="Enter your email" />
              <button className="btn-primary w-full !py-3">Send reset link</button>
            </div>
          </div>

          {/* State B: Success */}
          <div className="bg-success-tint border border-success/10 rounded-card p-6 flex gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shrink-0">
              <IconMail size={20} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-success">Check your inbox</p>
              <p className="text-[13px] text-success/70 leading-snug">Link sent to john@example.com. It will expire in 1 hour.</p>
            </div>
          </div>

          {/* State C: New Password */}
          <div className="bg-white rounded-card border-[0.5px] border-black/10 p-8 shadow-lg opacity-40 grayscale pointer-events-none">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
              Set New Password
            </h3>
            <div className="flex flex-col gap-5">
              <div>
                <label className="label-text">New Password</label>
                <input type="password" disabled className="input-field" placeholder="••••••••" />
                <div className="flex gap-1 h-1 mt-2">
                  <div className="flex-1 bg-success rounded-full" /><div className="flex-1 bg-success rounded-full" />
                  <div className="flex-1 bg-black/5 rounded-full" /><div className="flex-1 bg-black/5 rounded-full" />
                </div>
              </div>
              <button className="btn-primary w-full !py-3 shadow-xl shadow-primary/20">Reset password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
