import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IconLayoutDashboard, IconUpload, IconHistory, IconUser, IconSettings, 
  IconFileText, IconMail, IconLock, IconShieldCheck, IconLogout
} from '@tabler/icons-react';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-page flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-black/5 flex flex-col fixed h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <IconFileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">ResumeIQ</span>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-1">
          <SidebarLink to="/dashboard" icon={<IconLayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink to="/upload" icon={<IconUpload size={20} />} label="Upload Resume" />
          <SidebarLink to="/history" icon={<IconHistory size={20} />} label="History" />
          <SidebarLink to="/profile" icon={<IconUser size={20} />} label="Profile" active />
          <SidebarLink to="/settings" icon={<IconSettings size={20} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1 p-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <h1 className="text-[32px] font-bold tracking-tight">Your Profile</h1>

          <div className="bg-white card p-10 flex items-center gap-10">
            <div className="w-32 h-32 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name || 'User'}</h2>
              <p className="text-neutral-slate/50">{user.email || 'user@example.com'}</p>
              <div className="flex gap-3 mt-6">
                <span className="badge bg-primary/10 text-primary border-primary/20">Pro Member</span>
                <span className="badge bg-success-tint text-success border-success/10">Active Account</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            <div className="bg-white card p-8 flex flex-col gap-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <IconMail size={20} className="text-primary" /> Contact Information
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="label-text">Email Address</label>
                  <input type="text" readOnly className="input-field bg-page/50" value={user.email} />
                </div>
                <button onClick={handleLogout} className="btn-secondary w-full justify-start gap-3 text-danger border-danger/10 hover:bg-danger/5 mt-4">
                  <IconLogout size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-neutral-slate/50 hover:bg-page'}`}>
    {icon} {label}
  </Link>
);

export default ProfilePage;
