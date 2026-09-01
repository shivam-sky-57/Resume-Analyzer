import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconFileText, IconBrandGoogle, IconArrowRight, IconMail } from '@tabler/icons-react';
import { authAPI } from '../services/api';

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Sign up, 2: OTP
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register(formData);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    // Simulated verification for the UI flow
    navigate('/dashboard');
  };

  // Password strength calculation (0-4)
  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length > 7) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strength = calculateStrength(formData.password);

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-card border-[0.5px] border-black/10 shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Progress Bar (very subtle) */}
        <div className="h-1 w-full bg-black/5">
          <div className={`h-full bg-primary transition-all duration-500 ${step === 2 ? 'w-full' : 'w-1/2'}`} />
        </div>

        <div className="p-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <IconFileText className="text-white w-7 h-7" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">ResumeIQ</h1>
              <p className="text-[13px] text-neutral-slate/50">Elevate your career with AI</p>
            </div>
          </div>

          {step === 1 ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-2">
                <h2 className="text-[20px] font-bold text-neutral-slate">Create your account</h2>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                {error && <div className="p-3 rounded-lg bg-danger/10 text-danger text-xs font-bold">{error}</div>}
                
                <div>
                  <label className="label-text">Full Name</label>
                  <input 
                    type="text" required className="input-field" placeholder="John Doe"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="label-text">Email Address</label>
                  <input 
                    type="email" required className="input-field" placeholder="john@example.com"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="label-text">Password</label>
                  <input 
                    type="password" required className="input-field mb-2" placeholder="••••••••"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  {/* Strength Bar */}
                  <div className="flex gap-1.5 h-1 px-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= strength ? 'bg-success' : 'bg-black/5'}`} />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full mt-4 !py-3.5 !text-[15px]">
                  {loading ? 'Creating...' : 'Create account'} <IconArrowRight size={18} />
                </button>
              </form>

              <div className="flex items-center gap-4 py-2">
                <div className="h-[0.5px] bg-black/10 flex-1" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-slate/40">or continue with</span>
                <div className="h-[0.5px] bg-black/10 flex-1" />
              </div>

              <button className="btn-secondary w-full !py-3">
                <IconBrandGoogle size={20} className="text-[#DB4437]" /> Google
              </button>

              <p className="text-center text-[13px] text-neutral-slate/60 mt-2">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-2">
                  <IconMail size={32} />
                </div>
                <h2 className="text-[20px] font-bold text-neutral-slate">Verify your email</h2>
                <p className="text-[14px] text-neutral-slate/50 max-w-[280px]">
                  We sent a 6-digit code to <span className="text-neutral-slate font-semibold">{formData.email}</span>
                </p>
              </div>

              <div className="flex justify-between gap-2 px-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <input key={i} type="text" maxLength={1} className="w-12 h-14 bg-page border border-black/10 rounded-xl text-center text-xl font-bold focus:border-primary/50 focus:outline-none transition-all" />
                ))}
              </div>

              <button onClick={handleVerify} className="btn-primary w-full !py-4 shadow-xl shadow-primary/20">
                Verify Code
              </button>

              <div className="text-center flex flex-col gap-2">
                <p className="text-[13px] text-neutral-slate/40">Resend in <span className="font-bold text-neutral-slate">45s</span></p>
                <button className="text-[13px] text-primary font-bold hover:underline">I didn't receive the code</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
