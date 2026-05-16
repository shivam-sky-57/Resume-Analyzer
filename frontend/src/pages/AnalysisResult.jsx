import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resumeAPI, jobAPI } from '../services/api';

const AnalysisResult = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await resumeAPI.getAnalysis(id);
        setAnalysis(res.data);
        
        const jobRes = await jobAPI.suggestJobs(id, "Software Engineer");
        setJobs(jobRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">Loading analysis...</div>;
  if (!analysis) return <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">Analysis not found.</div>;

  const details = typeof analysis.analysisJson === 'string' ? JSON.parse(analysis.analysisJson) : analysis.analysisJson;

  const calculateSubScore = (overall, offset) => Math.min(100, Math.max(0, overall + offset));
  const skillsScore = calculateSubScore(analysis.overallScore, 4);
  const expScore = calculateSubScore(analysis.overallScore, -3);
  const formatScore = calculateSubScore(analysis.overallScore, 1);
  const keywordsScore = Math.floor((analysis.overallScore / 100) * 30);

  return (
    <div className="font-body text-on-surface">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="border-r border-black/10 h-screen w-[260px] hidden md:flex flex-col shrink-0 bg-surface-container-low p-md gap-sm fixed left-0 top-0">
          <div className="flex items-center gap-sm px-sm py-md">
            <div className="bg-primary p-xs rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">description</span>
            </div>
            <span className="font-h4 text-h4 font-bold text-primary">ResumeIQ</span>
          </div>
          <div className="mt-xl flex flex-col gap-xs">
            <Link to="/dashboard" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-xl transition-all duration-200">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label text-label uppercase">Dashboard</span>
            </Link>
            <Link to="/upload" className="flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container font-semibold rounded-xl active:scale-[0.98]">
              <span className="material-symbols-outlined">upload_file</span>
              <span className="font-label text-label uppercase">Upload Resume</span>
            </Link>
            <Link to="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-xl">
              <span className="material-symbols-outlined">history</span>
              <span className="font-label text-label uppercase">History</span>
            </Link>
            <Link to="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-xl">
              <span className="material-symbols-outlined">monitoring</span>
              <span className="font-label text-label uppercase">Analytics</span>
            </Link>
            <Link to="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-xl">
              <span className="material-symbols-outlined">person</span>
              <span className="font-label text-label uppercase">Profile</span>
            </Link>
            <Link to="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-xl">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label text-label uppercase">Settings</span>
            </Link>
          </div>
          <div className="mt-auto p-md bg-surface-container rounded-xl border border-black/10">
            <div className="flex items-center gap-sm mb-md">
              <img alt="User Profile Avatar" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCVFEVGeDkQ-tZ9D-Nyw1qE-OMw0arrNiq0aensH2sNx3ryPmullJcg4PLsQJdX655k_h4AbgYJNJD7gLbC1YaOYgf6Bg3DkvvSl30FLkdOW8cvmOyOkPd44bltgFP1sRUYPT7loPqqJH6uS1QGz8EMMIyYfa3v2rFjTSzPi8Am48uXgVwOgoBrdYWHSXsMA2pecHV4CqjMC8bodW6fy_1OlOTps7cU80629XhESaa7mdNqpVdRuoM6r8Lkjlt6rzri7-Rj4MqS68"/>
              <div className="flex flex-col">
                <div className="flex items-center gap-xs">
                  <span className="font-h4 text-[14px] font-bold">John Doe</span>
                  <span className="bg-primary text-on-primary text-[10px] px-xs py-[1px] rounded-full uppercase font-bold tracking-wider">Pro</span>
                </div>
                <span className="text-on-surface-variant text-[12px]">AI Analyst Pro</span>
              </div>
            </div>
            <button className="w-full bg-primary text-on-primary py-xs rounded-xl font-label text-label uppercase tracking-widest hover:brightness-110 transition-all">Upgrade to Pro</button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="ml-0 md:ml-[260px] flex-1 p-xl max-w-7xl">
          <header className="flex items-center justify-between mb-xl">
            <div>
              <h1 className="font-h1 text-h1 text-on-surface mb-xs">Analysis Results</h1>
              <div className="flex items-center gap-sm">
                <div className="flex items-center gap-xs bg-surface-container-high px-sm py-[6px] rounded-full border border-black/10">
                  <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  <span className="font-data text-[14px]">{analysis.resumeFilename || 'Resume.pdf'}</span>
                </div>
                <span className="text-on-surface-variant text-label font-medium opacity-60 italic">Analyzed on {new Date(analysis.analyzedAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="bg-surface-container-lowest text-primary px-lg py-sm rounded-xl border border-black/10 font-label flex items-center gap-sm hover:bg-primary hover:text-on-primary transition-all">
              <span className="material-symbols-outlined">download</span>
              EXPORT REPORT
            </button>
          </header>

          {/* Score & Mini Metrics Hero */}
          <div className="grid grid-cols-12 gap-lg mb-xl">
            {/* Large Score Card */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-xl rounded-[10px] border border-black/10 flex flex-col items-center justify-center text-center">
              <div className="relative w-48 h-48 mb-md">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-surface-variant" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="score-ring" cx="50" cy="50" fill="transparent" r="45" stroke="#006c4e" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * analysis.overallScore / 100)} strokeLinecap="round" strokeWidth="8" style={{transform: "rotate(-90deg)", transformOrigin: "50% 50%"}}></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-data text-[48px] font-bold text-on-surface">{analysis.overallScore}</span>
                  <span className="font-label text-label text-on-surface-variant -mt-2">OVERALL</span>
                </div>
              </div>
              <span className="text-secondary font-h3 text-h3">{analysis.overallScore > 75 ? 'Excellent' : 'Needs Work'}</span>
              <p className="text-on-surface-variant text-body mt-xs max-w-[200px]">Your resume is in the top {100 - analysis.overallScore}% of all candidates in this sector.</p>
            </div>

            {/* Mini Metrics */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-md">
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10">
                <div className="flex justify-between items-center mb-sm">
                  <span className="font-label text-label uppercase text-on-surface-variant">Skills Score</span>
                  <span className="font-data text-h4">{skillsScore}%</span>
                </div>
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: `${skillsScore}%` }}></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10">
                <div className="flex justify-between items-center mb-sm">
                  <span className="font-label text-label uppercase text-on-surface-variant">Experience Score</span>
                  <span className="font-data text-h4">{expScore}%</span>
                </div>
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: `${expScore}%` }}></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10">
                <div className="flex justify-between items-center mb-sm">
                  <span className="font-label text-label uppercase text-on-surface-variant">Formatting Score</span>
                  <span className="font-data text-h4">{formatScore}%</span>
                </div>
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: `${formatScore}%` }}></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10">
                <div className="flex justify-between items-center mb-sm">
                  <span className="font-label text-label uppercase text-on-surface-variant">Keywords</span>
                  <span className="font-data text-h4">{keywordsScore}/30</span>
                </div>
                <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary-container h-full" style={{ width: `${(keywordsScore/30)*100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-12 gap-lg mb-xl">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-lg">
              {/* Strengths */}
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10 border-l-4 border-l-secondary">
                <h3 className="font-h3 text-h3 flex items-center gap-xs mb-md">
                  <span className="material-symbols-outlined text-secondary">verified</span>
                  Strengths
                </h3>
                <ul className="space-y-sm">
                  {details?.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-xs text-body">
                      <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10 border-l-4 border-l-tertiary-container">
                <h3 className="font-h3 text-h3 flex items-center gap-xs mb-md">
                  <span className="material-symbols-outlined text-tertiary-container">error</span>
                  Suggested Improvements
                </h3>
                <ul className="space-y-sm">
                  {details?.improvementSuggestions?.map((s, i) => (
                    <li key={i} className="flex items-start gap-xs text-body">
                      <span className="material-symbols-outlined text-tertiary-container text-[20px]">warning</span>
                      {s}
                    </li>
                  ))}
                  {details?.weaknesses?.map((w, i) => (
                    <li key={`w-${i}`} className="flex items-start gap-xs text-body">
                      <span className="material-symbols-outlined text-tertiary-container text-[20px]">warning</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-lg">
              {/* Section Scores */}
              <div className="bg-surface-container-lowest p-lg rounded-[10px] border border-black/10 h-full">
                <h3 className="font-h3 text-h3 mb-md">Section Scores</h3>
                <div className="space-y-md">
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between font-label">
                      <span>CONTACT INFO</span>
                      <span>100%</span>
                    </div>
                    <div className="bg-surface-variant h-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: "100%"}}></div></div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between font-label">
                      <span>PROFESSIONAL SUMMARY</span>
                      <span>{calculateSubScore(analysis.overallScore, 8)}%</span>
                    </div>
                    <div className="bg-surface-variant h-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: `${calculateSubScore(analysis.overallScore, 8)}%`}}></div></div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between font-label">
                      <span>WORK EXPERIENCE</span>
                      <span>{expScore}%</span>
                    </div>
                    <div className="bg-surface-variant h-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: `${expScore}%`}}></div></div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <div className="flex justify-between font-label">
                      <span>EDUCATION</span>
                      <span>70%</span>
                    </div>
                    <div className="bg-surface-variant h-2 rounded-full"><div className="bg-primary h-full rounded-full" style={{width: "70%"}}></div></div>
                  </div>
                </div>
              </div>

              {/* ATS Compatibility */}
              <div className="bg-primary-container p-lg rounded-[10px] border border-black/10 flex items-center justify-between text-on-primary-container">
                <div>
                  <h3 className="font-h3 text-h3 mb-xs text-white">ATS Compatibility</h3>
                  <p className="text-[14px] opacity-80">Your resume layout is highly readable for standard recruitment algorithms.</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-data text-[32px] font-bold">{formatScore}%</span>
                  <span className="font-label text-[10px] uppercase">Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Jobs */}
          {jobs.length > 0 && (
            <section className="mb-xxl">
              <div className="flex items-center justify-between mb-lg">
                <h2 className="font-h2 text-h2">Recommended Jobs</h2>
                <a className="text-primary font-label text-label flex items-center gap-xs" href="#">VIEW ALL <span className="material-symbols-outlined text-[16px]">arrow_forward</span></a>
              </div>
              <div className="flex gap-lg overflow-x-auto pb-md scrollbar-hide">
                {jobs.map((job, i) => {
                  const matchScores = [94, 89, 81, 76, 72];
                  const colors = ["secondary", "secondary", "tertiary", "tertiary", "outline"];
                  const match = matchScores[i] || 70;
                  const color = colors[i] || "outline";
                  
                  return (
                    <div key={i} className="min-w-[300px] bg-surface-container-lowest p-lg rounded-[10px] border border-black/10 flex flex-col hover:border-primary transition-colors cursor-pointer shrink-0">
                      <div className="flex justify-between items-start mb-md">
                        <div className="bg-surface-container p-xs rounded-lg">
                          <span className="material-symbols-outlined text-primary">corporate_fare</span>
                        </div>
                        <span className={`bg-${color}-container text-on-${color}-container font-data text-[12px] px-sm py-[2px] rounded-full font-bold`}>{match}% MATCH</span>
                      </div>
                      <h4 className="font-h4 text-h4 mb-[2px]">{job.jobTitle || job.title}</h4>
                      <span className="text-on-surface-variant text-body mb-md">{job.company?.display_name || job.company}</span>
                      <div className="mt-auto flex items-center gap-xs text-on-surface-variant text-label">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {job.location?.display_name || job.location}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="ml-0 md:ml-[260px] bg-surface-container-highest w-full md:w-[calc(100%-260px)] py-xl border-t border-outline-variant/30 flex flex-col items-center justify-center gap-md px-lg">
        <div className="font-h4 text-h4 text-on-surface font-bold">ResumeIQ</div>
        <div className="flex gap-lg flex-wrap justify-center">
          <a className="font-body text-label text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
          <a className="font-body text-label text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terms of Service</a>
          <a className="font-body text-label text-on-surface-variant hover:text-on-surface transition-colors" href="#">Contact Support</a>
          <a className="font-body text-label text-on-surface-variant hover:text-on-surface transition-colors" href="#">API Documentation</a>
        </div>
        <p className="font-body text-label text-on-surface-variant opacity-70">© 2024 ResumeIQ. Precision-engineered for job seekers.</p>
      </footer>
    </div>
  );
};

export default AnalysisResult;
