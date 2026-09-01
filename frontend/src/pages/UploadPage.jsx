import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconUpload, IconFileText, IconX, IconCheck, IconLoader2, IconCircle 
} from '@tabler/icons-react';
import { resumeAPI } from '../services/api';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState([
    { id: 1, label: 'Parsing resume content', status: 'waiting' },
    { id: 2, label: 'Evaluating skills section', status: 'waiting' },
    { id: 3, label: 'Scoring experience quality', status: 'waiting' },
    { id: 4, label: 'Generating feedback', status: 'waiting' },
    { id: 5, label: 'Fetching job matches', status: 'waiting' },
  ]);
  const isUploadingRef = useRef(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      startUploadFlow(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      startUploadFlow(selected);
    }
  };

  const startUploadFlow = async (selectedFile) => {
    if (!selectedFile || isUploadingRef.current) return;
    isUploadingRef.current = true;
    setFile(selectedFile);
    setUploading(true);
    setProgress(0);

    // Smooth upload animation
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress <= 90) {
        setProgress(currentProgress);
      }
    }, 150);

    try {
      // Switch to processing stage
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setUploading(false);
        setProcessing(true);
        runStepAnimations();
      }, 700);

      // Trigger ONE actual upload API call
      const res = await resumeAPI.upload(selectedFile);
      
      // Complete all step animations and navigate
      setSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
      setTimeout(() => {
        navigate(`/analysis/${res.data.id}`);
      }, 600);
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Upload failed:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Analysis failed. Please try again.';
      alert(`Analysis failed: ${errorMsg}`);
      setUploading(false);
      setProcessing(false);
      setFile(null);
      isUploadingRef.current = false;
    }
  };

  const runStepAnimations = () => {
    let currentStep = 1;
    setSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: 'progress' } : s));

    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep <= 5) {
        setSteps(prev => prev.map(s => {
          if (s.id < currentStep) return { ...s, status: 'done' };
          if (s.id === currentStep) return { ...s, status: 'progress' };
          return s;
        }));
      } else {
        clearInterval(stepInterval);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-page p-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold tracking-tight text-neutral-slate">Upload resume</h1>
          <p className="text-neutral-slate/50">Add a new resume to analyse and get instant AI feedback.</p>
        </div>

        {/* ─── STATE 1: EMPTY / DROP ZONE ─── */}
        {!file && (
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="bg-white card border-dashed border-2 border-primary/20 p-20 flex flex-col items-center gap-6 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
          >
            <input 
              type="file" accept=".pdf" onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <IconUpload size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-neutral-slate">Drag & drop your resume PDF here</h3>
              <p className="text-neutral-slate/50 mt-2">
                or <span className="text-primary font-bold">browse files</span> from your computer
              </p>
            </div>
            <p className="text-[12px] font-bold text-neutral-slate/30 uppercase tracking-[0.2em]">Supports PDF up to 10MB</p>
          </div>
        )}

        {/* ─── STATE 2: UPLOADING ─── */}
        {uploading && (
          <div className="bg-white card p-10 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                  <IconFileText size={24} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-neutral-slate">{file?.name}</h3>
                  <p className="text-[12px] text-neutral-slate/40 uppercase font-bold tracking-widest">Uploading...</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setUploading(false); isUploadingRef.current = false; }} 
                className="p-2 hover:bg-page rounded-lg text-neutral-slate/30 transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[13px] font-bold">
                <span className="text-primary">{progress}%</span>
                <span className="text-neutral-slate/30">{((file?.size || 0) / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(83,74,183,0.5)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── STATE 3: PROCESSING ─── */}
        {processing && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* File Pill */}
            <div className="bg-white/50 backdrop-blur-sm border border-black/5 rounded-full px-6 py-3 flex items-center justify-between self-center">
              <div className="flex items-center gap-3">
                <IconFileText size={18} className="text-primary" />
                <span className="text-[14px] font-bold text-neutral-slate">{file?.name}</span>
              </div>
              <div className="h-4 w-[0.5px] bg-black/10 mx-4" />
              <span className="text-[12px] font-bold text-success uppercase tracking-widest">Uploaded</span>
            </div>

            {/* Checklist */}
            <div className="bg-white card p-10 flex flex-col gap-6 shadow-2xl">
              <div className="flex flex-col gap-6">
                {steps.map((step) => (
                  <div key={step.id} className={`flex items-center justify-between transition-opacity duration-500 ${step.status === 'waiting' ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        {step.status === 'done' ? (
                          <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center">
                            <IconCheck size={14} strokeWidth={3} />
                          </div>
                        ) : step.status === 'progress' ? (
                          <IconLoader2 size={24} className="text-primary animate-spin" />
                        ) : (
                          <IconCircle size={24} className="text-neutral-slate/30" />
                        )}
                      </div>
                      <span className={`text-[15px] font-semibold ${step.status === 'done' ? 'text-neutral-slate' : step.status === 'progress' ? 'text-primary' : 'text-neutral-slate/50'}`}>
                        {step.label}
                      </span>
                    </div>
                    {step.status === 'done' && (
                      <span className="bg-success-tint text-success text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Done</span>
                    )}
                    {step.status === 'progress' && (
                      <span className="bg-primary-tint text-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">In progress</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-8 border-t border-black/5 flex items-center justify-between">
                <p className="text-[13px] text-neutral-slate/50 font-medium italic">
                  Analysing with AI model...
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[13px] font-bold text-primary">Analysing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UploadPage;
