import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconLayoutDashboard, IconUpload, IconHistory, IconUser, IconSettings, 
  IconFileText, IconGlobe, IconMoon, IconCreditCard
} from '@tabler/icons-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
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
          <SidebarLink to="/profile" icon={<IconUser size={20} />} label="Profile" />
          <SidebarLink to="/settings" icon={<IconSettings size={20} />} label="Settings" active />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1 p-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <h1 className="text-[32px] font-bold tracking-tight">Settings</h1>

          <div className="grid gap-8">
            <SettingSection title="Preferences" icon={<IconGlobe size={20} />}>
              <SettingItem label="Language" value="English (US)" />
              <SettingItem label="Timezone" value="GMT +5:30" />
              <div className="flex justify-between items-center py-2 border-b border-black/5 last:border-0">
                <span className="text-sm font-semibold text-neutral-slate">Dark Mode</span>
                <div 
                  onClick={toggleDarkMode}
                  className={`w-11 h-6 rounded-full transition-all flex items-center px-1 cursor-pointer ${darkMode ? 'bg-primary' : 'bg-black/10'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </SettingSection>

            <SettingSection title="Billing" icon={<IconCreditCard size={20} />}>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center">
                <div>
                  <p className="font-bold text-primary">Pro Plan — $12/month</p>
                  <p className="text-[12px] text-primary/60 font-medium">Next billing date: June 9, 2026</p>
                </div>
                <button className="btn-primary !py-2 !px-4 !text-xs">Manage Plan</button>
              </div>
            </SettingSection>
          </div>
        </div>
      </main>
    </div>
  );
};

const SettingSection = ({ title, icon, children }) => (
  <div className="bg-white card p-8 flex flex-col gap-6">
    <h3 className="text-lg font-bold flex items-center gap-2">
      {icon} {title}
    </h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const SettingItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-black/5 last:border-0">
    <span className="text-sm font-semibold text-neutral-slate">{label}</span>
    <span className="text-sm font-bold text-primary">{value}</span>
  </div>
);

const SidebarLink = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-neutral-slate/50 hover:bg-page'}`}>
    {icon} {label}
  </Link>
);

export default SettingsPage;
