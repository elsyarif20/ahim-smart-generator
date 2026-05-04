
import React, { useState, useEffect, useMemo } from 'react';
import { GeneratedSection, Module, FormData } from '../types';
import { textToSpeech } from '../services/geminiService';

const downloadDoc = (fileName: string, content: string, formData: FormData | null) => {
    const isArabicContext = formData?.bahasa === 'Bahasa Arab';

    const fontAndDirectionStyles = isArabicContext 
        ? `body { font-family: 'Times New Roman', serif; direction: rtl; font-size: 10pt; }` 
        : `body { font-family: 'Times New Roman', serif; direction: ltr; font-size: 10pt; }`;

    const styles = `
        @page WordSection1 {
            size: 8.5in 14.0in; /* US Legal, Portrait */
            margin: 1.5cm;
            mso-header-margin:.5in;
            mso-footer-margin:.5in;
            mso-paper-source:0;
        }
        div.WordSection1 {
            page: WordSection1;
        }
        ${fontAndDirectionStyles}
        table {
            border-collapse: collapse;
            width: 100%;
            table-layout: auto;
        }
        th, td {
            border: 1px solid black;
            padding: 4px; 
            text-align: left;
            vertical-align: top;
            word-wrap: break-word; 
            overflow-wrap: break-word;
        }
        th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
        }
        h1, h2, h3, h4 {
            font-family: 'Arial', sans-serif;
            page-break-after: avoid;
        }
        ${isArabicContext ? `th, td { text-align: right; }` : ''}
    `;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>${fileName}</title>
            <style>${styles}</style>
        </head>
        <body>
            <div class="WordSection1 ${isArabicContext ? 'arabic-font-preview' : ''}">
    `;
    const footer = "</div></body></html>";
    const sourceHTML = header + content + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${fileName}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
};

interface ResultsDisplayProps {
  module: Module;
  sections: GeneratedSection[];
  formData: FormData;
  onUpdateSectionContent: (id: string, newContent: string) => void;
  onDeleteSection: (id: string) => void;
  onNewGeneration: () => void;
  onBack: () => void;
  onSaveSession: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ module, sections, formData, onUpdateSectionContent, onDeleteSection, onNewGeneration, onBack, onSaveSession }) => {
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set(sections.map(s => s.id)));
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [audioState, setAudioState] = useState<{ isPlaying: boolean; sectionId: string | null; audioContext: AudioContext | null; source: AudioBufferSourceNode | null }>({ isPlaying: false, sectionId: null, audioContext: null, source: null });
  const [isAudioFeatureDisabled, setIsAudioFeatureDisabled] = useState(false);

  useEffect(() => {
    setSelectedSections(new Set(sections.map(s => s.id)));
  }, [sections]);

  const filterCategories = useMemo(() => {
    const categories = ['Semua'];
    sections.forEach(s => {
      let cat = s.title.split(' ')[0].replace(/[^a-zA-Z]/g, '');
      if (s.title.toLowerCase().includes('atp')) cat = 'ATP';
      if (s.title.toLowerCase().includes('naskah')) cat = 'Naskah';
      if (s.title.toLowerCase().includes('soal')) cat = 'Soal';
      if (s.title.toLowerCase().includes('kunci')) cat = 'Kunci';
      if (s.title.toLowerCase().includes('modul')) cat = 'Modul';
      if (s.title.toLowerCase().includes('prota')) cat = 'Prota';
      if (s.title.toLowerCase().includes('promes')) cat = 'Promes';
      if (s.title.toLowerCase().includes('kktp')) cat = 'KKTP';
      if (!categories.includes(cat)) categories.push(cat);
    });
    return categories;
  }, [sections]);

  const filteredSections = useMemo(() => {
    if (activeFilter === 'Semua') return sections;
    return sections.filter(s => {
        const titleLower = s.title.toLowerCase();
        const filterLower = activeFilter.toLowerCase();
        return titleLower.includes(filterLower) || s.title.startsWith(activeFilter);
    });
  }, [sections, activeFilter]);

  const handleSelectionChange = (sectionId: string) => {
    setSelectedSections(prev => {
        const newSelection = new Set(prev);
        newSelection.has(sectionId) ? newSelection.delete(sectionId) : newSelection.add(sectionId);
        return newSelection;
    });
  };

  const handleSelectAll = () => {
    const isAllSelected = filteredSections.length > 0 && filteredSections.every(s => selectedSections.has(s.id));
    if (isAllSelected) {
       setSelectedSections(new Set());
    } else {
       setSelectedSections(new Set(filteredSections.map(s => s.id)));
    }
  };

  const handleDownloadSelected = () => {
    const sectionsToDownload = sections.filter(s => selectedSections.has(s.id));
    if (sectionsToDownload.length === 0) return;
    const fullContent = sectionsToDownload.map(s => `<h2>${s.title}</h2>${s.content}`).join(module === 'admin' ? '<br style="page-break-after: always;">' : '');
    downloadDoc(`${formData.mata_pelajaran}_Kelas_${formData.kelas}_Pilihan`, fullContent, formData);
  };

  const handleDownloadSingle = (section: GeneratedSection) => {
    downloadDoc(
        `${formData.mata_pelajaran}_${section.title.replace(/ /g, '_')}`, 
        `<h2>${section.title}</h2>${section.content}`, 
        formData
    );
  };
  
  const handlePlayAudio = async (section: GeneratedSection) => {
    if (isAudioFeatureDisabled) return;

    if (audioState.isPlaying && audioState.sectionId === section.id) {
        audioState.source?.stop();
        audioState.audioContext?.close();
        setAudioState({ isPlaying: false, sectionId: null, audioContext: null, source: null });
        return;
    }
    
    if (audioState.source) {
        audioState.source.stop();
        audioState.audioContext?.close();
    }
    
    setAudioState({ isPlaying: true, sectionId: section.id, audioContext: null, source: null });
    
    try {
        const plainText = new DOMParser().parseFromString(section.content, 'text/html').body.textContent || '';
        const audioBuffer = await textToSpeech(`${section.title}. ${plainText}`);
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
            setAudioState({ isPlaying: false, sectionId: null, audioContext: null, source: null });
            audioContext.close();
        };
        source.start();
        setAudioState({ isPlaying: true, sectionId: section.id, audioContext, source });
    } catch (error: any) {
        const errorMessage = error.toString();
        if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
            setIsAudioFeatureDisabled(true);
        }
        setAudioState({ isPlaying: false, sectionId: null, audioContext: null, source: null });
    }
  };

  const isAllSelected = filteredSections.length > 0 && filteredSections.every(s => selectedSections.has(s.id));

  return (
    <div id="results-section" className="fade-in space-y-8 pb-20">
      {/* Summary Header Card */}
      <div className="bg-[#1a1c20] p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-white/5 pb-8">
            <button onClick={onBack} className="text-gray-500 hover:text-[#e9d1a3] text-[10px] font-black flex items-center transition-all uppercase tracking-[0.3em] border border-white/5 bg-black/40 px-6 py-3 rounded group shadow-inner">
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              BACK TO TERMINAL
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-black text-[#e9d1a3] tracking-[0.2em] uppercase drop-shadow-md">OUTPUT ANALISIS AI</h2>
              <div className="w-16 h-1 bg-gold-gradient mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(233,209,163,0.3)]"></div>
            </div>
            <div className="flex gap-4">
               <button onClick={onSaveSession} className="px-6 py-3 bg-black/60 border border-white/5 hover:border-[#e9d1a3]/30 text-[#e9d1a3] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:translate-y-px">SIMPAN SESI</button>
               <button onClick={onNewGeneration} className="px-6 py-3 bg-[#e9d1a3] text-[#1a1c20] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:translate-y-px hover:brightness-110">MODUL BARU</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
               { label: 'SUBJECT', val: formData.mata_pelajaran },
               { label: 'GRADE', val: formData.kelas },
               { label: 'FASE', val: formData.fase },
               { label: 'TERM', val: formData.semester }
             ].map((stat, i) => (
               <div key={i} className="bg-black/60 p-4 rounded border border-white/5 flex flex-col items-center justify-center shadow-inner group/stat hover:border-[#e9d1a3]/30 transition-all">
                 <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1 group-hover/stat:text-gray-400">{stat.label}</span>
                 <span className="text-[#e9d1a3] font-black text-[11px] uppercase tracking-widest text-center">{stat.val || '---'}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Global Actions Bar - Sticky */}
      {selectedSections.size > 0 && (
         <div className="sticky top-6 z-50 fade-in px-4">
           <div className="bg-[#1a1c20] p-4 rounded-xl border-2 border-[#e9d1a3]/50 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(233,209,163,0.2)] flex justify-between items-center max-w-2xl mx-auto backdrop-blur-xl">
             <div className="flex items-center space-x-4 ml-2">
                <span className="text-2xl drop-shadow-[0_0_10px_rgba(233,209,163,0.5)]">📂</span>
                <div>
                  <span className="block text-[11px] font-black text-[#e9d1a3] uppercase tracking-widest animate-pulse">{selectedSections.size} ARTIFACTS SELECTED</span>
                  <span className="block text-[8px] text-gray-500 uppercase font-black tracking-widest">Awaiting Extraction Protocol</span>
                </div>
             </div>
             <button onClick={handleDownloadSelected} className="btn-gold px-8 py-3 rounded text-[10px] font-black uppercase tracking-widest shadow-xl">DOWNLOAD BUNDLE</button>
           </div>
         </div>
      )}

      {/* Filter Terminal */}
      <div className="bg-[#1a1c20] p-6 rounded-xl border border-white/5 shadow-inner">
        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 text-center">Filtering Categories // Terminal Mode</label>
        <div className="flex flex-wrap justify-center gap-3">
            {filterCategories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                        activeFilter === cat 
                        ? 'bg-[#e9d1a3] text-[#1a1c20] border-[#e9d1a3] shadow-[0_0_20px_rgba(233,209,163,0.3)] scale-105' 
                        : 'bg-black/40 text-gray-500 border-white/5 hover:border-[#e9d1a3]/30 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
        
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
           <button onClick={handleSelectAll} className="flex items-center space-x-3 group cursor-pointer border border-white/5 bg-black/40 px-4 py-2 rounded">
              <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${isAllSelected ? 'bg-[#e9d1a3] border-[#e9d1a3]' : 'bg-black border-white/20 group-hover:border-[#e9d1a3]/50'}`}>
                {isAllSelected && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-[10px] font-black text-gray-500 group-hover:text-[#e9d1a3] transition-colors uppercase tracking-widest">Select All in "{activeFilter}"</span>
           </button>
           <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Active nodes: {filteredSections.length} / Total generated: {sections.length}</span>
        </div>
      </div>

      {/* Result Cards Display */}
      <div className="space-y-10">
        {filteredSections.map((section, idx) => (
          <div key={section.id} className={`bg-[#1a1c20] rounded-xl border-l-[6px] shadow-2xl transition-all duration-500 relative group/card ${selectedSections.has(section.id) ? 'border-[#e9d1a3] shadow-[0_0_40px_rgba(233,209,163,0.1)] translate-x-3' : 'border-gray-800 hover:border-gray-600 hover:translate-x-1'}`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-gradient opacity-0 group-hover/card:opacity-[0.04] transition-opacity -rotate-45 translate-x-20 -translate-y-20 group-hover/card:translate-x-10 group-hover/card:-translate-y-10 duration-1000"></div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center gap-6">
                  <div className="relative cursor-pointer" onClick={() => handleSelectionChange(section.id)}>
                     <div className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center ${selectedSections.has(section.id) ? 'bg-[#e9d1a3] border-[#e9d1a3] shadow-[0_0_15px_#e9d1a3]' : 'bg-black/60 border-white/10 hover:border-gray-500'}`}>
                       {selectedSections.has(section.id) && <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                     </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#e9d1a3] uppercase tracking-widest">{section.title}</h3>
                    <p className="text-[9px] text-gray-600 mt-2 font-black uppercase tracking-[0.4em] opacity-60 italic">Module Artifact: 0{idx + 1} // Authorization Level 04 Verified</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                   <button onClick={() => handlePlayAudio(section)} className={`p-4 bg-black/60 border border-white/5 rounded-lg transition-all shadow-inner group/audio ${isAudioFeatureDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:border-[#e9d1a3]/40 text-[#e9d1a3]'}`}>
                      {audioState.isPlaying && audioState.sectionId === section.id ? <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" /></svg> : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>}
                   </button>
                   <button onClick={() => handleDownloadSingle(section)} className="flex-1 md:flex-none px-8 py-4 bg-black/60 border border-white/5 hover:border-blue-400 group-hover/card:border-blue-500/30 text-gray-500 hover:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-inner">EXTRACT DOCX</button>
                   <button onClick={() => onDeleteSection(section.id)} className="p-4 bg-black/60 border border-white/5 hover:border-red-500/50 text-gray-700 hover:text-red-500 rounded-lg transition-all shadow-inner opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </div>

              <div 
                className="prose prose-invert max-w-none prose-sm prose-headings:text-[#e9d1a3] prose-strong:text-[#e9d1a3] prose-headings:uppercase prose-headings:tracking-widest font-medium opacity-90 leading-relaxed bg-black/30 p-8 rounded-lg border border-white/5 shadow-inner min-h-[100px] outline-none focus:ring-1 focus:ring-[#e9d1a3]/30 transition-all custom-scrollbar overflow-x-auto results-content" 
                contentEditable 
                suppressContentEditableWarning={true} 
                onBlur={e => onUpdateSectionContent(section.id, e.currentTarget.innerHTML)} 
                dangerouslySetInnerHTML={{ __html: section.content }} 
              />
            </div>
          </div>
        ))}
        {filteredSections.length === 0 && (
          <div className="text-center py-32 bg-[#1a1c20]/50 rounded-xl border border-white/5 border-dashed">
            <p className="text-gray-600 font-black uppercase tracking-[0.6em] text-xs opacity-50 italic">Satellite Feed Terminal: No Data in Sector {activeFilter.toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
