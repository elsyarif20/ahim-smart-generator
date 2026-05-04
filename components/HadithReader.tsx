import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hadith, HadithInfo } from '../types';
import { getHadithAuthors, getHadithByAuthor } from '../services/islamicService';

interface HadithReaderProps {
  onBack: () => void;
}

const HadithReader: React.FC<HadithReaderProps> = ({ onBack }) => {
  const [authors, setAuthors] = useState<HadithInfo[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<HadithInfo | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadAuthors = async () => {
      const data = await getHadithAuthors();
      setAuthors(data);
      setIsLoading(false);
    };
    loadAuthors();
  }, []);

  useEffect(() => {
    if (selectedAuthor) {
      const loadHadith = async () => {
        setIsLoading(true);
        const data = await getHadithByAuthor(selectedAuthor.id, page);
        setHadiths(data);
        setIsLoading(false);
      };
      loadHadith();
    }
  }, [selectedAuthor, page]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-6 flex items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="flex items-center space-x-6 relative z-10 text-left">
          <button onClick={selectedAuthor ? () => setSelectedAuthor(null) : onBack} className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all">
            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30">
               <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">{selectedAuthor ? 'Kembali' : 'Dashboard'}</span>
          </button>
          
          <div className="flex flex-col text-left">
            <h2 className="text-[#e9d1a3] font-black text-lg uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(233,209,163,0.4)]">MAKTABAH HADITS</h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1 opacity-80 decoration-[#e9d1a3]/30 underline underline-offset-4">
              {selectedAuthor ? `Kitab Hadits: ${selectedAuthor.name}` : 'Koleksi 9 Perawi Hadits Terpopuler'} // HADITS_OFFLINE
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-[#14161a] border-l border-r border-b border-white/10 rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin shadow-[0_0_15px_rgba(233,209,163,0.2)]"></div>
            </motion.div>
          ) : !selectedAuthor ? (
            <motion.div key="authors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {authors.map(author => (
                <button 
                  key={author.id} 
                  onClick={() => setSelectedAuthor(author)}
                  className="p-6 bg-white/[0.03] border border-white/10 rounded-xl text-center hover:border-[#e9d1a3] hover:bg-[#e9d1a3]/5 transition-all group flex flex-col items-center shadow-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#e9d1a3]/20 border border-[#e9d1a3]/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(233,209,163,0.1)]">
                     <span className="text-[#e9d1a3] font-black text-xl drop-shadow-md">{author.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-gray-100 font-black text-[10px] uppercase tracking-wider mb-1 group-hover:text-[#e9d1a3] transition-colors">{author.name}</h3>
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{author.available} Hadits</p>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="hadiths" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {hadiths.map((hadith) => (
                <div key={hadith.number} className="p-8 bg-white/[0.04] border border-white/10 rounded-2xl space-y-8 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                     <span className="px-3 py-1 bg-[#e9d1a3]/10 border border-[#e9d1a3]/30 rounded text-[9px] font-black text-[#e9d1a3] uppercase tracking-widest shadow-sm">Nomor {hadith.number}</span>
                  </div>
                  <p className="text-3xl font-serif text-white text-right leading-[2] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" dir="rtl">{hadith.arab}</p>
                  <div className="p-6 bg-black/60 rounded-xl border border-white/10 shadow-inner">
                     <p className="text-gray-200 text-sm leading-relaxed font-semibold drop-shadow-sm">{hadith.id}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-center space-x-6 py-6 border-t border-white/10">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-6 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-[9px] font-black text-[#e9d1a3] uppercase tracking-widest disabled:opacity-20 hover:border-[#e9d1a3] hover:bg-[#e9d1a3]/5 transition-all shadow-md"
                >
                  Sebelumnya
                </button>
                <span className="text-[10px] font-black text-gray-100 uppercase tracking-widest drop-shadow-md">Halaman {page}</span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-2 bg-white/[0.05] border border-white/20 rounded-lg text-[9px] font-black text-[#e9d1a3] uppercase tracking-widest hover:border-[#e9d1a3] hover:bg-[#e9d1a3]/5 transition-all shadow-md"
                >
                  Selanjutnya
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HadithReader;
