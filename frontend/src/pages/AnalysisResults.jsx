import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  IconLayoutDashboard, IconUpload, IconHistory, IconUser, IconSettings, 
  IconFileText, IconCircleCheck, IconAlertTriangle, IconBriefcase, IconExternalLink, 
  IconChevronRight, IconArrowUpRight, IconDownload, IconShare
} from '@tabler/icons-react';
import { resumeAPI, jobAPI } from '../services/api';

const AnalysisResults = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    resumeAPI.getAnalysis(id)
      .then(res => {
        setData(res.data);
        // Fetch jobs based on analysis results
        const analysis = typeof res.data.analysisJson === 'string' ? JSON.parse(res.data.analysisJson) : res.data.analysisJson;
        const query = analysis.keywordsFound?.slice(0, 3).join(' ') || 'Software Engineer';
        jobAPI.suggestJobs(id, query).then(jobRes => setJobs(jobRes.data));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        <p className="text-[14px] font-bold text-neutral-slate/40 uppercase tracking-widest">Loading report...</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-20 text-center">Analysis not found.</div>;

  const analysis = typeof data.analysisJson === 'string' ? JSON.parse(data.analysisJson) : data.analysisJson;

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
          <SidebarLink to="/history" icon={<IconHistory size={20} />} label="History" />
          <SidebarLink to="#" icon={<IconFileText size={20} />} label="Analysis Results" active />
          <SidebarLink to="/profile" icon={<IconUser size={20} />} label="Profile" />
          <SidebarLink to="/settings" icon={<IconSettings size={20} />} label="Settings" />
        </nav>
        <div className="p-6 border-t border-black/5">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold truncate">{user.name || 'User'}</p>
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest">Pro Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="ml-[260px] flex-1 p-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-[24px] font-bold tracking-tight">Analysis Results</h1>
                <div className="bg-white border border-black/5 rounded-full px-4 py-1 flex items-center gap-2">
                  <IconFileText size={14} className="text-neutral-slate/40" />
                  <span className="text-[12px] font-bold text-neutral-slate">{data.resumeFilename}</span>
                </div>
                <span className="text-[11px] font-bold text-neutral-slate/30 uppercase tracking-widest">
                  {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary !px-4"><IconDownload size={18} /></button>
              <button className="btn-secondary !px-4"><IconShare size={18} /></button>
              <Link to="/upload" className="btn-primary !px-6">New analysis</Link>
            </div>
          </div>

          {/* Hero Score Section */}
          <div className="bg-white card p-10 grid lg:grid-cols-3 gap-12 items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="#F1F0E8" strokeWidth="16" fill="none" />
                  <circle 
                    cx="96" cy="96" r="88" 
                    stroke={analysis.overallScore >= 70 ? '#1D9E75' : analysis.overallScore >= 40 ? '#BA7517' : '#993C1D'} 
                    strokeWidth={16} fill="none" 
                    strokeDasharray="553" 
                    strokeDashoffset={553 - (553 * analysis.overallScore) / 100} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-bold font-mono tracking-tight">{analysis.overallScore}</span>
                  <span className="text-[16px] text-neutral-slate/40 uppercase font-bold tracking-widest -mt-2">/ 100</span>
                </div>
              </div>
              <div className={`badge ${analysis.overallScore >= 70 ? 'bg-success-tint text-success' : 'bg-warning-tint text-warning'}`}>
                {analysis.label || 'Excellent'}
              </div>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-5">
                <ScoreBar label="Skills Score" value={analysis.sectionScores?.skills || 91} />
                <ScoreBar label="Experience" value={analysis.sectionScores?.experience || 84} />
                <ScoreBar label="Education" value={analysis.sectionScores?.education || 88} />
              </div>
              <div className="flex flex-col gap-5">
                <ScoreBar label="ATS Compatibility" value={analysis.atsScore || 78} />
                <ScoreBar label="Keywords Found" value={analysis.keywordsFound?.length || 23} max={30} />
                <ScoreBar label="Formatting" value={analysis.sectionScores?.formatting || 90} />
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-8">
              {/* Strengths */}
              <div className="bg-white card overflow-hidden border-l-[6px] border-l-success">
                <div className="p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <IconCircleCheck className="text-success" size={24} /> Strengths
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {(analysis.strengths || ["Strong technical foundation", "Quantifiable achievements", "Clear professional summary", "Modern tech stack usage"]).map((s, i) => (
                      <li key={i} className="flex gap-3 text-[14px] leading-snug">
                        <IconCircleCheck className="text-success/30 shrink-0" size={18} />
                        <span className="text-neutral-slate/70">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-white card overflow-hidden border-l-[6px] border-l-warning">
                <div className="p-8">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <IconAlertTriangle className="text-warning" size={24} /> Suggested improvements
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {(analysis.improvements || ["Expand on recent leadership roles", "Add more industry-specific keywords", "Clarify role in project X", "Include certifications link"]).map((s, i) => (
                      <li key={i} className="flex gap-3 text-[14px] leading-snug">
                        <IconAlertTriangle className="text-warning/30 shrink-0" size={18} />
                        <span className="text-neutral-slate/70">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* Section Scores Bar Chart Mockup */}
              <div className="bg-white card p-8">
                <h3 className="text-lg font-bold mb-8">Detailed Section Analysis</h3>
                <div className="flex flex-col gap-6">
                  {Object.entries(analysis.sectionScores || {}).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-2">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-neutral-slate/40">
                        <span>{key}</span>
                        <span>{val}%</span>
                      </div>
                      <div className="h-3 w-full bg-page rounded-full overflow-hidden">
                        <div className="h-full bg-primary/20 transition-all" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white card p-8">
                <h3 className="text-lg font-bold mb-6">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {(analysis.keywordsMissing || ["CI/CD", "Agile", "Docker", "REST API", "Kubernetes", "Redis", "Microservices"]).map((k, i) => (
                    <span key={i} className="px-4 py-2 rounded-lg bg-danger/5 text-danger text-[12px] font-bold border border-danger/10">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-tight">Recommended jobs for you</h3>
              <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                Explore more <IconChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 overflow-x-auto pb-4">
              {jobs.length > 0 ? jobs.map((job, idx) => (
                <JobCard 
                  key={idx}
                  company={job.company} 
                  title={job.jobTitle} 
                  location={job.location} 
                  match={job.matchPercent} 
                  url={job.jobUrl}
                />
              )) : (
                <div className="col-span-3 text-center py-10 text-neutral-slate/40">No matching jobs found.</div>
              )}
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

const ScoreBar = ({ label, value, max = 100 }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center">
      <span className="text-[12px] font-bold text-neutral-slate/40 uppercase tracking-widest">{label}</span>
      <span className="text-[14px] font-bold text-neutral-slate">{value}{max === 100 ? '%' : `/${max}`}</span>
    </div>
    <div className="h-1.5 w-full bg-page rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ${value >= 80 ? 'bg-success' : value >= 60 ? 'bg-warning' : 'bg-danger'}`} 
        style={{ width: `${(value/max) * 100}%` }} 
      />
    </div>
  </div>
);

const JobCard = ({ company, title, location, match, url }) => (
  <div className="bg-white card p-6 flex flex-col gap-5 hover:border-primary/30 transition-all group">
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 rounded-xl bg-page border border-black/5 flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
        {company.charAt(0)}
      </div>
      <div className="bg-success-tint text-success text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
        {match}% Match
      </div>
    </div>
    <div>
      <h4 className="text-[16px] font-bold text-neutral-slate leading-tight">{title}</h4>
      <p className="text-[13px] text-neutral-slate/50 mt-1">{company} • {location}</p>
    </div>
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="btn-secondary !py-2 !text-[13px] w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center justify-center no-underline gap-2"
    >
      View job <IconExternalLink size={14} />
    </a>
  </div>
);

export default AnalysisResults;
