import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IconLayoutDashboard, IconUpload, IconHistory, IconUser, IconSettings, 
  IconFileText, IconSearch, IconDownload, IconEye, IconTrash, IconAdjustmentsHorizontal
} from '@tabler/icons-react';
import { resumeAPI } from '../services/api';

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    resumeAPI.getHistory()
      .then(res => setAnalyses(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const bestScore = analyses.length > 0 ? Math.max(...analyses.map(a => a.overallScore)) : 0;
  const avgScore = analyses.length > 0 ? Math.round(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length) : 0;

  const handleDownload = (analysis) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `analysis_${analysis.resumeFilename.replace('.pdf', '')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      resumeAPI.deleteAnalysis(id)
        .then(() => {
          setAnalyses(prev => prev.filter(a => a.id !== id));
        })
        .catch(err => console.error(err));
    }
  };

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
          <SidebarLink to="/dashboard" icon={<IconLayoutDashboard size={20} />} label="Dashboard" />
          <SidebarLink to="/upload" icon={<IconUpload size={20} />} label="Upload Resume" />
          <SidebarLink to="/history" icon={<IconHistory size={20} />} label="History" active />
          <SidebarLink to="/profile" icon={<IconUser size={20} />} label="Profile" />
          <SidebarLink to="/settings" icon={<IconSettings size={20} />} label="Settings" />
        </nav>
        <div className="p-6 border-t border-black/5 text-center">
          <p className="text-[11px] font-bold text-neutral-slate/30 uppercase tracking-widest">Logged in as</p>
          <p className="text-[13px] font-bold text-neutral-slate truncate">{user.email}</p>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="ml-[260px] flex-1 p-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-neutral-slate">History</h1>
              <p className="text-neutral-slate/50 mt-1">Review and manage all your past resume analyses.</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-slate/30" size={18} />
                <input type="text" className="input-field pl-12 w-64" placeholder="Search files..." />
              </div>
              <button className="btn-secondary !px-4"><IconAdjustmentsHorizontal size={20} /></button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Uploads" value={analyses.length} />
            <StatCard label="Avg Score" value={avgScore} unit="/100" />
            <StatCard label="Best Score" value={bestScore} unit="/100" />
            <StatCard label="Improvement" value="+14%" isSuccess />
          </div>

          {/* Full Analyses Table */}
          <div className="bg-white card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-page/50 border-b border-black/5">
                    <th className="px-8 py-5 label-text">File Info</th>
                    <th className="px-8 py-5 label-text">Date Analysed</th>
                    <th className="px-8 py-5 label-text">File Size</th>
                    <th className="px-8 py-5 label-text">Score</th>
                    <th className="px-8 py-5 label-text text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {analyses.map((a) => (
                    <tr key={a.id} className="hover:bg-page/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-page flex items-center justify-center text-neutral-slate/30 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                            <IconFileText size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[15px] text-neutral-slate">{a.resumeFilename}</span>
                            <span className="text-[11px] text-neutral-slate/40 uppercase font-bold tracking-widest">PDF Document</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[14px] text-neutral-slate/60">
                        {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-[14px] text-neutral-slate/60 font-mono">
                        {(Math.random() * 5 + 1).toFixed(1)} MB
                      </td>
                      <td className="px-8 py-6">
                        <ScoreBadge score={a.overallScore} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <Link to={`/analysis/${a.id}`} className="btn-secondary !px-3 !py-2 !text-[13px]">
                            <IconEye size={16} /> View
                          </Link>
                          <button 
                            onClick={() => handleDownload(a)}
                            className="p-2 rounded-lg hover:bg-page text-neutral-slate/30 transition-colors"
                          >
                            <IconDownload size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(a.id)}
                            className="p-2 rounded-lg hover:bg-danger/5 text-danger/30 hover:text-danger transition-colors"
                          >
                            <IconTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {analyses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <IconHistory size={64} strokeWidth={1} />
                          <p className="text-lg font-bold">No history available</p>
                          <Link to="/upload" className="btn-primary !py-2 !text-xs">Start your first analysis</Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
      <span className={`text-[28px] font-bold tracking-tight ${isSuccess ? 'text-success' : 'text-neutral-slate'}`}>
        {value}
      </span>
      {unit && <span className="text-[12px] font-bold text-neutral-slate/30">{unit}</span>}
    </div>
  </div>
);

const ScoreBadge = ({ score }) => {
  let styles = "bg-danger-tint text-danger";
  if (score >= 85) styles = "bg-success-tint text-success";
  else if (score >= 70) styles = "bg-warning-tint text-warning";
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold ${styles}`}>
      {score}
    </span>
  );
};

export default HistoryPage;
