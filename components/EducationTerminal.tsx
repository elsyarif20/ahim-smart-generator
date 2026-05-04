import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { searchKBBI, getWikipediaSummary, KBBIResult } from '../services/educationService';

interface EducationTerminalProps {
  onBack: () => void;
}

const EducationTerminal: React.FC<EducationTerminalProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [kbbiResult, setKbbiResult] = useState<KBBIResult | null>(null);
  const [wikiResult, setWikiResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearched(true);
    try {
      const [kbbi, wiki] = await Promise.all([
        searchKBBI(query),
        getWikipediaSummary(query)
      ]);
      setKbbiResult(kbbi);
      setWikiResult(wiki);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      {/* Header */}
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
        
        <div className="flex items-center space-x-6 relative z-10">
          <button 
            onClick={onBack}
            className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30">
               <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          
          <div className="flex flex-col">
            <h2 className="text-[#e9d1a3] font-black text-lg uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(233,209,163,0.4)]">
              TERMINAL EDUKASI
            </h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1 opacity-80">
              Kamus Besar Bahasa Indonesia & Referensi Pengetahuan // KBBI_CENTRAL
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mt-6 md:mt-0 w-full md:w-96 z-10">
          <input 
            type="text"
            placeholder="CARI KATA ATAU TOPIK..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/20 focus:border-[#e9d1a3] focus:bg-white/[0.1] rounded-lg px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#e9d1a3] placeholder-gray-600 transition-all outline-none shadow-xl"
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e9d1a3] transition-colors">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-[#14161a] border-l border-r border-b border-white/10 rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative p-6 md:p-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#14161a]"
            >
              <div className="w-12 h-12 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin shadow-[0_0_15px_rgba(233,209,163,0.2)]"></div>
              <p className="mt-4 text-[#e9d1a3] font-black uppercase tracking-[0.4em] text-[10px] drop-shadow-md">Processing Data...</p>
            </motion.div>
          ) : !searched ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full opacity-50 py-20"
            >
              <div className="w-24 h-24 border border-white/10 bg-white/[0.02] rounded-full flex items-center justify-center mb-6 shadow-2xl">
                 <svg className="w-10 h-10 text-[#e9d1a3] drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <p className="text-[#e9d1a3] font-black uppercase tracking-[0.5em] text-[10px] drop-shadow-md">Masukkan kata kunci untuk mencari definisi</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* KBBI Column */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.2em] bg-white/[0.05] border border-[#e9d1a3]/30 px-3 py-1 rounded shadow-lg">KBBI DARING</span>
                </div>
                
                {kbbiResult ? (
                  <div className="bg-white/[0.04] border border-[#e9d1a3]/20 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
                    <h3 className="text-4xl font-black text-white tracking-tight leading-none mb-4 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{kbbiResult.lema}</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {kbbiResult.kelasKata.map((k, i) => (
                        <span key={i} className="text-[9px] font-black text-[#e9d1a3] uppercase tracking-widest bg-[#e9d1a3]/20 border border-[#e9d1a3]/40 px-2 py-0.5 rounded italic shadow-sm">
                          {k}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      {kbbiResult.arti.map((a, i) => (
                        <div key={i} className="flex space-x-4 group">
                          <span className="text-[#e9d1a3] font-black text-xs shrink-0 mt-0.5 opacity-60">{i + 1}.</span>
                          <p className="text-gray-100 text-sm leading-relaxed font-semibold group-hover:text-white transition-colors drop-shadow-sm">{a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl text-center shadow-inner">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">Lema tidak ditemukan di KBBI</p>
                  </div>
                )}
              </div>

              {/* Wikipedia Column */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-[10px] font-black text-gray-200 uppercase tracking-[0.2em] bg-white/[0.05] border border-white/20 px-3 py-1 rounded shadow-lg">WIKIPEDIA REFERENSI</span>
                </div>

                {wikiResult ? (
                  <div className="bg-white/[0.04] border border-white/20 p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-6 backdrop-blur-sm">
                    {wikiResult.thumbnail && (
                      <div className="w-full md:w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-xl">
                        <img src={wikiResult.thumbnail.source} alt={wikiResult.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="text-xl font-black text-white hover:text-[#e9d1a3] transition-colors leading-tight mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        <a href={wikiResult.content_urls.desktop.page} target="_blank" rel="noreferrer" className="underline decoration-[#e9d1a3]/30 decoration-2 underline-offset-4">
                          {wikiResult.title}
                        </a>
                      </h3>
                      <p className="text-gray-200 text-sm leading-relaxed mb-6 font-semibold line-clamp-6 drop-shadow-sm">
                        {wikiResult.extract}
                      </p>
                      <a 
                        href={wikiResult.content_urls.desktop.page} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 text-[10px] font-black text-[#e9d1a3] uppercase tracking-widest hover:translate-x-2 transition-all drop-shadow-[0_0_8px_rgba(233,209,163,0.3)]"
                      >
                        <span className="underline decoration-[#e9d1a3]/50 underline-offset-4">Baca Selengkapnya</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l7-7m-7 7H3" /></svg>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl text-center shadow-inner">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">Artikel tidak ditemukan di Wikipedia</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-between items-center px-4 shrink-0">
         <div className="flex items-center space-x-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#e9d1a3] shadow-[0_0_5px_rgba(233,209,163,0.8)] animate-pulse"></div>
            <span>Academic Engine v1.02</span>
         </div>
         <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] drop-shadow-sm">Source: Kemdikbud / Wikimedia Foundation</p>
      </div>
    </div>
  );
};

export default EducationTerminal;
