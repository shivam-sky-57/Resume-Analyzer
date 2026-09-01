import React from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconBolt, IconSearch, IconShieldCheck, IconMail, IconChartBar, IconFileText, IconUpload, IconDeviceDesktop } from '@tabler/icons-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── STICKY NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-black/5 px-8 h-20 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <IconFileText className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ResumeIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[14px] font-medium text-neutral-slate hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-[14px] font-medium text-neutral-slate hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="text-[14px] font-medium text-neutral-slate hover:text-primary transition-colors">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[14px] font-semibold text-neutral-slate hover:text-primary px-4 py-2">Sign in</Link>
          <Link to="/register" className="btn-primary">
            Get started free
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid lg:grid-cols-2 gap-20 items-center overflow-hidden">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-neutral-slate">
            Get your resume scored by AI in seconds.
          </h1>
          <p className="text-lg text-neutral-slate/60 leading-relaxed max-w-lg">
            Upload your PDF resume and receive an instant score, detailed feedback, and job-matched suggestions powered by Groq AI.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link to="/register" className="btn-primary !px-8 !py-4 !text-base shadow-xl shadow-primary/20">
              Analyse my resume <IconArrowRight size={20} />
            </Link>
            <button className="btn-ghost !px-8 !py-4 !text-base">
              See example report
            </button>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="relative group">
          <div className="bg-page border border-black/5 rounded-2xl p-8 aspect-video shadow-2xl flex flex-col gap-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-danger/20" />
                <div className="w-3 h-3 rounded-full bg-warning/20" />
                <div className="w-3 h-3 rounded-full bg-success/20" />
              </div>
              <div className="h-2 w-32 bg-black/5 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="h-4 w-2/3 bg-white rounded-lg border border-black/5" />
              <div className="h-4 w-1/2 bg-white rounded-lg border border-black/5" />
              <div className="flex-1 border-2 border-dashed border-black/10 rounded-xl flex items-center justify-center bg-white/50">
                <IconUpload className="text-black/10" size={48} />
              </div>
            </div>

            {/* Floating Score Ring Overlay */}
            <div className="absolute -right-8 -bottom-8 bg-white card p-6 shadow-2xl animate-bounce-slow">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#F1F0E8" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="#534AB7" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="33" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold font-mono">87</span>
                  <span className="text-[10px] text-neutral-slate/40 -mt-1 uppercase">/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <div className="bg-page py-12 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-neutral-slate shrink-0">Trusted by 12,000+ job seekers</p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
            <span className="font-black text-2xl">GOOGLE</span>
            <span className="font-black text-2xl">META</span>
            <span className="font-black text-2xl">AMAZON</span>
            <span className="font-black text-2xl">STRIPE</span>
            <span className="font-black text-2xl">AIRBNB</span>
          </div>
        </div>
      </div>

      {/* ─── FEATURES GRID ─── */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-24 lg:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-slate">Supercharge your job search</h2>
          <p className="text-neutral-slate/60 mt-4 max-w-xl mx-auto">Our AI helps you see what recruiters see, giving you the edge you need to land your dream job.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<IconBolt className="text-primary" />} title="Instant AI Score" desc="Get an objective score based on industry standards in under 15 seconds." />
          <FeatureCard icon={<IconChartBar className="text-success" />} title="Skill Gap Analysis" desc="Identify missing technical and soft skills required for your target roles." />
          <IconCard icon={<IconSearch className="text-warning" />} title="ATS Keyword Check" desc="Optimise your resume with keywords that help you bypass automated filters." />
          <IconCard icon={<IconDeviceDesktop className="text-primary" />} title="Job Match Suggestions" desc="Get personalised job recommendations based on your resume's unique profile." />
          <IconCard icon={<IconShieldCheck className="text-success" />} title="Secure & Private" desc="Your data is encrypted and never shared with third parties without consent." />
          <IconCard icon={<IconMail className="text-warning" />} title="Email Reports" desc="Receive detailed PDF reports of your analysis directly in your inbox." />
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="bg-page py-24 lg:py-32 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-neutral-slate text-center mb-20">How it works</h2>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Dotted Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-20 right-20 h-0.5 border-t-2 border-dashed border-primary/20 -translate-y-12" />
            
            <Step icon={<IconUpload size={32} />} label="Step 1" title="Upload PDF" />
            <Step icon={<IconBolt size={32} />} label="Step 2" title="AI Analyses" />
            <Step icon={<IconFileText size={32} />} label="Step 3" title="Get Report" />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <IconFileText className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">ResumeIQ</span>
          </div>
          <p className="text-[13px] text-neutral-slate/50 leading-relaxed mt-2">Helping candidates globally to improve their resumes and land better opportunities with AI.</p>
        </div>
        <FooterGroup title="Product" links={["Features", "Pricing", "API", "Templates"]} />
        <FooterGroup title="Company" links={["About", "Blog", "Careers", "Support"]} />
        <FooterGroup title="Legal" links={["Privacy", "Terms", "Cookies", "DPA"]} />
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card p-8 hover:border-primary/20 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-[18px] font-bold text-neutral-slate mb-2">{title}</h3>
    <p className="text-[14px] text-neutral-slate/60 leading-relaxed">{desc}</p>
  </div>
);

const IconCard = ({ icon, title, desc }) => (
  <div className="card p-8 hover:border-primary/20 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-[18px] font-bold text-neutral-slate mb-2">{title}</h3>
    <p className="text-[14px] text-neutral-slate/60 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ icon, label, title }) => (
  <div className="relative z-10 flex flex-col items-center gap-4 bg-page md:px-8">
    <div className="w-24 h-24 rounded-full bg-white border-4 border-primary/10 shadow-xl flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="text-center">
      <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">{label}</p>
      <h4 className="text-[18px] font-bold text-neutral-slate">{title}</h4>
    </div>
  </div>
);

const FooterGroup = ({ title, links }) => (
  <div className="flex flex-col gap-4">
    <h4 className="text-[12px] font-bold uppercase tracking-widest text-neutral-slate">{title}</h4>
    <div className="flex flex-col gap-3">
      {links.map(l => (
        <a key={l} href="#" className="text-[14px] text-neutral-slate/60 hover:text-primary transition-colors">{l}</a>
      ))}
    </div>
  </div>
);

export default LandingPage;
