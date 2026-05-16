import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconLayoutDashboard, IconUpload, IconHistory, IconUser, IconSettings, 
  IconFileText, IconChevronRight, IconArrowUpRight, IconDownload, IconEye 
} from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { resumeAPI } from '../services/api';

const Dashboard = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    resumeAPI.getHistory()
      .then(res => setAnalyses(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const chartData = analyses.slice(0, 4).reverse().map(a => ({
    date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: a.overallScore
  }));

  const bestScore = analyses.length > 0 ? Math.max(...analyses.map(a => a.overallScore)) : 0;
  const avgScore = analyses.length > 0 ? Math.round(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length) : 0;

  return (
    <div className="min-h-screen bg-page flex">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[260px] bg-white border-r border-black/5 flex flex-col fixed h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <IconFileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">ResumeIQ</span>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          <SidebarLink to="/dashboard" icon={<IconLayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarLink to="/upload" icon={<IconUpload size={20} />} label="Upload Resume" />
          <SidebarLink to="/history" icon={<IconHistory size={20} />} label="History" />
          <SidebarLink to="/profile" icon={<IconUser size={20} />} label="Profile" />
          <SidebarLink to="/settings" icon={<IconSettings size={20} />} label="Settings" />
        </nav>

        <div className="p-6 border-t border-black/5">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-page transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold truncate">{user.name || 'User'}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <p className="text-[11px] font-bold text-success uppercase tracking-widest">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="ml-[260px] flex-1 p-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight">Welcome, {user.name?.split(' ')[0] || 'User'} 👋</h1>
              <p className="text-neutral-slate/50 mt-1">You've analysed {analyses.length} resumes. Your best score is {bestScore}.</p>
            </div>
            <Link to="/upload" className="btn-primary !px-6">
              Upload new resume <IconArrowUpRight size={18} />
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total analyses" value={analyses.length} />
            <StatCard label="Average score" value={avgScore} unit="/100" />
            <StatCard label="Best score" value={bestScore} unit="/100" />
            <StatCard label="Jobs matched" value={analyses.length * 28} isSuccess />
          </div>

          {/* Chart & Latest */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Score Over Time Chart */}
            <div className="lg:col-span-2 bg-white card p-8">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold">Score over time</h3>
                <div className="flex items-center gap-2 text-[12px] font-bold text-success bg-success-tint px-3 py-1 rounded-full">
                  <IconArrowUpRight size={14} /> +12.5% improvement
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0E8" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#8b8a9e', fontSize: 12}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#8b8a9e', fontSize: 12}} 
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}
                      itemStyle={{color: '#534AB7', fontWeight: 'bold'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#534AB7" 
                      strokeWidth={4} 
                      dot={{r: 6, fill: '#534AB7', strokeWidth: 2, stroke: '#fff'}}
                      activeDot={{r: 8, strokeWidth: 0}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Latest Score Ring (Small Preview) */}
            <div className="bg-white card p-8 flex flex-col items-center justify-center gap-6">
              <h3 className="text-lg font-bold w-full">Latest Analysis</h3>
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#F1F0E8" strokeWidth="12" fill="none" />
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="70" 
                    stroke="#534AB7" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="440" 
                    strokeDashoffset={440 - (440 * (analyses[0]?.overallScore || 0)) / 100} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold font-mono">{analyses[0]?.overallScore || 0}</span>
                  <span className="text-sm text-neutral-slate/40 uppercase font-bold tracking-widest">/100</span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-neutral-slate">{analyses[0]?.resumeFilename || 'No recent analysis'}</p>
                <p className="text-[13px] text-neutral-slate/50">Analysed on {chartData[0]?.date || 'N/A'}</p>
              </div>
              <Link to={analyses[0] ? `/analysis/${analyses[0].id}` : '#'} className="btn-secondary w-full">
                View full report
              </Link>
            </div>
          </div>

          {/* Recent Analyses Table */}
          <div className="bg-white card overflow-hidden">
            <div className="px-8 py-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent analyses</h3>
              <Link to="/history" className="text-primary font-bold text-sm hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-page/50">
                    <th className="px-8 py-4 label-text">Filename</th>
                    <th className="px-8 py-4 label-text">Date</th>
                    <th className="px-8 py-4 label-text">Score</th>
                    <th className="px-8 py-4 label-text text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {analyses.slice(0, 4).map((a) => (
                    <tr key={a.id} className="hover:bg-page/20 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <IconFileText size={20} className="text-neutral-slate/30" />
                          <span className="font-semibold text-sm">{a.resumeFilename}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[14px] text-neutral-slate/50">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <ScoreBadge score={a.overallScore} />
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <Link to={`/analysis/${a.id}`} className="p-2 rounded-lg hover:bg-primary/5 text-primary transition-colors">
                            <IconEye size={18} />
                          </Link>
                          <button className="p-2 rounded-lg hover:bg-page text-neutral-slate/30 transition-colors">
                            <IconDownload size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {analyses.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-neutral-slate/40">
                        No resumes analysed yet. <Link to="/upload" className="text-primary font-bold underline">Upload one now</Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-primary rounded-[20px] p-12 text-white flex flex-col items-center gap-6 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <h2 className="text-3xl font-bold tracking-tight relative z-10">Ready to improve your score?</h2>
            <p className="text-white/60 max-w-lg relative z-10">Upload a new version of your resume to see how your changes affect your AI score and job matches.</p>
            <Link to="/upload" className="bg-white text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-2xl relative z-10">
              Upload new resume <IconChevronRight size={20} />
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-neutral-slate/50 hover:bg-page hover:text-neutral-slate'
    }`}
  >
    {icon}
    {label}
  </Link>
);

const StatCard = ({ label, value, unit, isSuccess }) => (
  <div className="bg-white card p-6 flex flex-col gap-1">
    <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-slate/40">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className={`text-[32px] font-bold tracking-tight ${isSuccess ? 'text-success' : 'text-neutral-slate'}`}>
        {value}
      </span>
      {unit && <span className="text-sm font-bold text-neutral-slate/30">{unit}</span>}
    </div>
  </div>
);

const ScoreBadge = ({ score }) => {
  let styles = "bg-danger-tint text-danger";
  if (score >= 85) styles = "bg-success-tint text-success";
  else if (score >= 70) styles = "bg-warning-tint text-warning";
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${styles}`}>
      {score} — {score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs work'}
    </span>
  );
};

export default Dashboard;
