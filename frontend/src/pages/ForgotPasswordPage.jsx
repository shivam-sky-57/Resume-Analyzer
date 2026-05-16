import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

/**
 * Forgot Password page — no email sent.
 * The user enters their registered email + a new password.
 * If the email exists the password is updated immediately.
 */
const ForgotPasswordPage = () => {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = () => {
    if (newPassword.length === 0) return 0;
    if (newPassword.length <= 3) return 1;
    if (newPassword.length <= 5) return 2;
    if (newPassword.length <= 7) return 3;
    return 4;
  };
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(email, newPassword);
      setStep('success');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F1EFE8] p-md">
      <section className="bg-white border border-black/10 rounded-[10px] p-[32px] w-full max-w-[420px] shadow-sm flex flex-col gap-lg">

        {/* Header */}
        <div className="flex flex-col items-center gap-md">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary text-[32px]">analytics</span>
            <span className="font-h3 text-h3 font-black text-on-surface">ResumeIQ</span>
          </div>
          <h1 className="font-h2 text-h2 text-center">Reset your password</h1>
          <p className="font-body text-body text-on-surface-variant text-center -mt-md">
            Enter your email and choose a new password.
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-md">
            {error && (
              <div className="text-error text-sm text-center bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-label text-[12px] font-medium uppercase tracking-[0.06em] mb-2 text-[#474553]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-black/10 rounded-[6px] p-3 font-body text-[15px] transition-colors focus:outline-none focus:border-primary focus:border-[1.5px]"
                placeholder="name@company.com"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block font-label text-[12px] font-medium uppercase tracking-[0.06em] mb-2 text-[#474553]">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-black/10 rounded-[6px] p-3 font-body text-[15px] transition-colors focus:outline-none focus:border-primary focus:border-[1.5px]"
                placeholder="••••••••"
              />
              {newPassword.length > 0 && (
                <>
                  <div className="flex gap-1 mt-2 h-[4px]">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`flex-1 rounded-full transition-colors ${strength >= i ? 'bg-secondary' : 'bg-surface-variant'}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong'} password
                  </p>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-label text-[12px] font-medium uppercase tracking-[0.06em] mb-2 text-[#474553]">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-black/10 rounded-[6px] p-3 font-body text-[15px] transition-colors focus:outline-none focus:border-primary focus:border-[1.5px]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-[6px] p-3 font-semibold transition-transform active:scale-95 mt-2 disabled:opacity-60"
            >
              {loading ? 'Updating password…' : 'Update password'}
            </button>
          </form>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center gap-lg text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-[36px]">check_circle</span>
            </div>
            <div>
              <h2 className="font-h3 text-h3 font-semibold text-on-surface">Password updated!</h2>
              <p className="font-body text-body text-on-surface-variant mt-xs">
                Your password has been changed. You can now sign in with your new password.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white rounded-[6px] px-8 py-3 font-semibold transition-transform active:scale-95"
            >
              Go to Sign in
            </button>
          </div>
        )}

        {step === 'form' && (
          <p className="font-body text-label text-on-surface-variant text-center">
            Remembered it? <Link to="/login" className="text-primary font-semibold hover:underline">Back to sign in</Link>
          </p>
        )}
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
