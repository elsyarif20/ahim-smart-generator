import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Doa } from '../types';
import { getAllDoa } from '../services/islamicService';

interface DoaReaderProps {
  onBack: () => void;
}

const DoaReader: React.FC<DoaReaderProps> = ({ onBack }) => {
  const [doas, setDoas] = useState<Doa[]>([]);
  const [selectedDoa, setSelectedDoa] = useState<Doa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDoa = async () => {
      const data = await getAllDoa();
      setDoas(data);
      setIsLoading(false);
    };
    loadDoa();
  }, []);

  const filteredDoa = doas.filter(d => 
    d.doa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
        
        <div className="flex items-center space-x-6 relative z-10">
          <button onClick={selectedDoa ? () => setSelectedDoa(null) : onBack} className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all">
            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30">
               <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">{selectedDoa ? 'Kembali' : 'Dashboard'}</span>
          </button>
          
          <div className="flex flex-col">
            <h2 className="text-[#e9d1a3] font-black text-lg uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(233,209,163,0.4)]">KOLEKSI DOA HARIAN</h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1 opacity-80">Munajat & Dzikir Pilihan // DOA_CENTRAL</p>
          </div>
        </div>

        {!selectedDoa && (
          <div className="relative mt-4 md:mt-0 w-full md:w-80">
            <input 
              type="text" 
              placeholder="CARI DOA..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/20 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#e9d1a3] outline-none focus:border-[#e9d1a3] focus:bg-white/[0.1] transition-all shadow-xl placeholder-gray-600"
            />
          </div>
        )}
      </div>

      <div className="flex-grow bg-[#14161a] border-l border-r border-b border-white/10 rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative p-6 md:p-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin shadow-[0_0_15px_rgba(233,209,163,0.2)]"></div>
            </motion.div>
          ) : !selectedDoa ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoa.map(doa => (
                <button 
                  key={doa.id} 
                  onClick={() => setSelectedDoa(doa)}
                  className="p-5 bg-white/[0.03] border border-white/10 rounded-xl text-left hover:border-[#e9d1a3] hover:bg-[#e9d1a3]/5 transition-all group shadow-lg"
                >
                  <h3 className="text-gray-100 font-black text-[10px] uppercase tracking-wider group-hover:text-[#e9d1a3] transition-colors drop-shadow-sm">{doa.doa}</h3>
                  <div className="mt-2 h-px w-8 bg-[#e9d1a3]/40 group-hover:w-16 transition-all"></div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                 <h2 className="text-2xl font-black text-[#e9d1a3] uppercase tracking-wider drop-shadow-[0_0_8px_rgba(233,209,163,0.3)]">{selectedDoa.doa}</h2>
                 <div className="w-24 h-px bg-[#e9d1a3]/40 mx-auto"></div>
              </div>

              <div className="bg-white/[0.04] p-8 rounded-2xl border border-white/10 space-y-10 shadow-2xl backdrop-blur-sm">
                <div className="text-right">
                   <p className="text-4xl font-serif text-white leading-[2] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" dir="rtl">{selectedDoa.ayat}</p>
                </div>
                
                <div className="space-y-6 pt-6 border-t border-white/10">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-[#e9d1a3] uppercase tracking-[0.2em] opacity-80">Transliterasi</p>
                      <p className="text-gray-100 text-sm italic font-medium leading-relaxed drop-shadow-sm">{selectedDoa.latin}</p>
                   </div>
                   
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Terjemahan</p>
                      <p className="text-gray-300 text-sm font-semibold leading-relaxed drop-shadow-sm">{selectedDoa.artinya}</p>
                   </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                 <button 
                  onClick={() => setSelectedDoa(null)}
                  className="px-8 py-3 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#e9d1a3] hover:text-[#e9d1a3] transition-all"
                 >
                    Kembali ke Daftar
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoaReader;
