import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SurahListItem, SurahData } from '../types';
import { getSurahList, getSurahDetail, downloadAllSurahs } from '../services/quranService';

interface QuranReaderProps {
  onBack: () => void;
}

const QuranReader: React.FC<QuranReaderProps> = ({ onBack }) => {
  const [surahs, setSurahs] = useState<SurahListItem[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<{ progress: number; current: string } | null>(null);

  useEffect(() => {
    const loadList = async () => {
      try {
        const list = await getSurahList();
        setSurahs(list);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadList();
  }, []);

  const filteredSurahs = useMemo(() => {
    return surahs.filter(s => 
      s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.nomor.toString().includes(searchQuery)
    );
  }, [surahs, searchQuery]);

  const handleSurahClick = async (nomor: number) => {
    setLoadingSurah(true);
    try {
      const data = await getSurahDetail(nomor);
      setSelectedSurah(data);
    } catch (error) {
      alert("Gagal memuat surah. Periksa koneksi internet Anda.");
    } finally {
      setLoadingSurah(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!confirm("Ini akan mengunduh seluruh isi Al-Qur'an (sekitar 3-5MB) ke memori browser Anda agar bisa dibaca tanpa internet. Lanjutkan?")) return;
    
    try {
      await downloadAllSurahs((progress, current) => {
        setDownloadProgress({ progress, current });
      });
      setTimeout(() => setDownloadProgress(null), 3000);
    } catch (error) {
       console.error(error);
       setDownloadProgress(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      {/* Header Bar */}
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
        
        <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
          <button 
            onClick={selectedSurah ? () => setSelectedSurah(null) : onBack}
            className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30 shadow-inner">
               <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">{selectedSurah ? 'Daftar Surah' : 'Dashboard'}</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          
          <div className="flex flex-col">
            <h2 className="text-[#e9d1a3] font-black text-lg uppercase tracking-[0.3em] drop-shadow-md">
              {selectedSurah ? `SURAH ${selectedSurah.meta.name}` : 'AL-QUR\'AN DIGITAL'}
            </h2>
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-1 opacity-70">
              {selectedSurah ? `${selectedSurah.meta.meaning} // ${selectedSurah.meta.verseCount} Ayat` : 'Terminal Akses Kitab Suci Kemenag RI'}
            </p>
          </div>
        </div>

        {!selectedSurah && (
          <div className="relative mt-6 md:mt-0 w-full md:w-80 z-10">
            <input 
              type="text"
              placeholder="CARI SURAH (NAMA / NOMOR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 focus:border-[#e9d1a3]/30 rounded-lg px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#e9d1a3] placeholder-gray-700 transition-all outline-none shadow-inner"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        )}

        {selectedSurah && (
           <button 
             onClick={handleDownloadAll}
             className="mt-6 md:mt-0 bg-black/60 border border-white/5 hover:border-[#e9d1a3]/30 text-[#e9d1a3] px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:translate-y-px z-10"
           >
              LENGKAPI OFFLINE
           </button>
        )}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow bg-[#14161a] border-l border-r border-b border-white/10 rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative p-4 md:p-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#14161a] z-50"
            >
              <div className="w-12 h-12 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin"></div>
              <p className="mt-6 text-[#e9d1a3] font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing Database...</p>
            </motion.div>
          ) : !selectedSurah ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.nomor}
                  onClick={() => handleSurahClick(surah.nomor)}
                  className="group bg-black/40 border border-white/5 p-6 rounded-xl text-left hover:border-[#e9d1a3]/30 hover:bg-black/60 transition-all shadow-lg active:translate-y-px relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 text-3xl font-black text-white/[0.03] group-hover:text-[#e9d1a3]/[0.06] transition-colors font-mono">
                    {surah.nomor}
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center font-black text-[#e9d1a3] text-xs shadow-inner">
                      {surah.nomor}
                    </div>
                    <span className="text-xl text-[#e9d1a3] font-serif opacity-80 group-hover:opacity-100 transition-opacity">{surah.nama}</span>
                  </div>
                  <h3 className="text-white font-black uppercase tracking-widest text-[11px] mb-1 group-hover:text-[#e9d1a3] transition-colors">{surah.namaLatin}</h3>
                  <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest truncate">{surah.arti}</p>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-gray-500 uppercase tracking-widest">
                    <span>{surah.tempatTurun}</span>
                    <span>{surah.jumlahAyat} AYAT</span>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-4xl mx-auto space-y-12 pb-20"
            >
              {/* Surah Header Card */}
              <div className="bg-black/60 rounded-2xl p-10 text-center border border-[#e9d1a3]/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>
                <div className="relative z-10">
                   <h1 className="text-5xl font-serif text-[#e9d1a3] mb-6 drop-shadow-md">{selectedSurah.meta.englishName}</h1>
                   <h2 className="text-[#e9d1a3] font-black uppercase tracking-[0.5em] text-xl mb-4">{selectedSurah.meta.name}</h2>
                   <div className="h-px w-20 bg-white/10 mx-auto mb-6"></div>
                   <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.3em] mb-4 italic opacity-80">"{selectedSurah.meta.meaning}"</p>
                   <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{selectedSurah.meta.verseCount} AYAT // FASE TURUN {selectedSurah.meta.number}</span>
                   </div>
                </div>
              </div>

              {/* Bismillah */}
              {selectedSurah.meta.number !== 1 && selectedSurah.meta.number !== 9 && (
                <div className="text-center py-10">
                  <span className="text-4xl text-[#e9d1a3] font-serif opacity-90 drop-shadow-sm">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
                </div>
              )}

              {/* Verses */}
              <div className="space-y-6">
                {selectedSurah.verses.map((verse) => (
                  <div key={verse.number} className="bg-black/30 rounded-xl border border-white/5 p-8 transition-all hover:bg-black/50 hover:border-[#e9d1a3]/10 group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                       <div className="w-10 h-10 rounded-full border border-[#e9d1a3]/20 bg-black flex items-center justify-center font-black text-[#e9d1a3] text-[10px] shrink-0 mt-2 shadow-inner group-hover:border-[#e9d1a3]/40 transition-colors">
                          {verse.number}
                       </div>
                       <div className="flex-grow space-y-8 text-right md:text-right">
                          <p className="text-4xl md:text-5xl text-white font-serif leading-[2.5] md:leading-[2.2] tracking-wide" style={{ direction: 'rtl' }}>
                             {verse.text}
                          </p>
                          <div className="text-left border-t border-white/5 pt-8 opacity-70 group-hover:opacity-100 transition-opacity">
                             <p className="text-gray-400 text-sm italic leading-relaxed font-medium">
                               <span className="text-[#e9d1a3] font-black text-[10px] uppercase tracking-widest mr-3 not-italic">Terjemahan:</span>
                               {verse.translation}
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-20 border-t border-white/5">
                 <button 
                   onClick={() => {
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                     setSelectedSurah(null);
                   }}
                   className="px-12 py-5 bg-black/60 border border-white/5 hover:border-[#e9d1a3]/30 text-[#e9d1a3] rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl"
                 >
                   Kembali ke Daftar Surah
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Download Progress Bar Overlay */}
      <AnimatePresence>
        {downloadProgress && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <div className="bg-[#1a1c20] p-6 rounded-2xl border-2 border-[#e9d1a3]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[#e9d1a3] font-black uppercase tracking-widest text-[11px]">Syncing Offline Archive</h4>
                  <span className="text-[#e9d1a3] font-black text-[11px]">{downloadProgress.progress}%</span>
               </div>
               <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress.progress}%` }}
                    className="h-full bg-gold-gradient shadow-[0_0_10px_rgba(233,209,163,0.5)]"
                  />
               </div>
               <p className="mt-4 text-center text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">
                  ARCHIVING: SURAH {downloadProgress.current.toUpperCase()}
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay for Surah Choice */}
      <AnimatePresence>
        {loadingSurah && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center"
           >
              <div className="bg-[#1a1c20] p-8 rounded-2xl border border-white/10 shadow-3xl text-center">
                 <div className="w-12 h-12 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin mx-auto mb-6"></div>
                 <p className="text-[#e9d1a3] font-black uppercase tracking-[0.4em] text-[10px]">Retrieving Scriptural Data...</p>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center px-4 shrink-0">
         <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Internal Scriptural Node Active</span>
         </div>
         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest opacity-40">Quran_Module_v2.0 // EQURAN_ID_ENGINE</span>
      </div>
    </div>
  );
};

export default QuranReader;
