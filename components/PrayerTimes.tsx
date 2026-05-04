import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getPrayerTimes, searchCity } from '../services/islamicService';

interface PrayerTimesProps {
  onBack: () => void;
}

const PrayerTimes: React.FC<PrayerTimesProps> = ({ onBack }) => {
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState({ id: '1301', name: 'JAKARTA' }); // Default Jakarta
  const [prayerData, setPrayerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadTimes = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const data = await getPrayerTimes(selectedCity.id, today);
      setPrayerData(data);
      setIsLoading(false);
    };
    loadTimes();
  }, [selectedCity]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (citySearch.length < 3) return;
    const results = await searchCity(citySearch);
    setCities(results);
  };

  const getStatus = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(h, m, 0);
    return currentTime > prayerTime ? 'passed' : 'upcoming';
  };

  const prayerIcons: Record<string, string> = {
    imsak: '🌙',
    subuh: '🌅',
    terbit: '🌞',
    dhuha: '☀️',
    dzuhur: '🔆',
    ashar: '🌄',
    maghrib: '🌆',
    isya: '🌃'
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
        
        <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
          <button onClick={onBack} className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all">
            <div className="w-10 h-10 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30">
               <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
          
          <div className="flex flex-col">
            <h2 className="text-[#e9d1a3] font-black text-lg uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(233,209,163,0.4)]">JADWAL SHOLAT</h2>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mt-1 opacity-80 decoration-[#e9d1a3]/30 underline underline-offset-4">
              Waktu Ibadah Wilayah: {selectedCity.name} // MYQURAN_CORE
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mt-4 md:mt-0 w-full md:w-80 flex gap-2">
          <input 
            type="text" 
            placeholder="CARI KOTA..." 
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="flex-grow bg-white/[0.05] border border-white/20 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#e9d1a3] outline-none focus:border-[#e9d1a3] focus:bg-white/[0.1] transition-all shadow-xl placeholder-gray-600"
          />
          <button type="submit" className="px-4 py-2 bg-white/10 border border-white/20 rounded hover:bg-[#e9d1a3]/20 transition-all text-white shadow-lg">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </form>
      </div>

      <div className="flex-grow bg-[#14161a] border-l border-r border-b border-white/10 rounded-b-xl overflow-y-auto custom-scrollbar shadow-2xl relative p-6">
        {cities.length > 0 && (
           <div className="absolute top-0 inset-x-0 bg-black/95 border-b border-white/10 z-50 p-4 grid grid-cols-2 md:grid-cols-4 gap-2 shadow-2xl backdrop-blur-md">
              {cities.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => { setSelectedCity({ id: c.id, name: c.lokasi }); setCities([]); }}
                  className="px-3 py-2 bg-white/10 border border-white/10 rounded text-[9px] font-black text-left text-gray-200 hover:text-[#e9d1a3] hover:bg-white/20 transition-all uppercase shadow-md"
                >
                  {c.lokasi}
                </button>
              ))}
           </div>
        )}

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#e9d1a3]/20 border-t-[#e9d1a3] rounded-full animate-spin shadow-[0_0_15px_rgba(233,209,163,0.2)]"></div>
          </div>
        ) : prayerData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(prayerData).map(([key, value]) => {
              if (key === 'tanggal' || key === 'date') return null;
              const status = getStatus(value as string);
              return (
                <div 
                  key={key}
                  className={`p-6 rounded-2xl border transition-all shadow-xl backdrop-blur-sm ${
                    status === 'upcoming' 
                    ? 'bg-[#e9d1a3]/15 border-[#e9d1a3]/40 shadow-[0_0_25px_rgba(233,209,163,0.15)] ring-1 ring-[#e9d1a3]/20' 
                    : 'bg-white/[0.03] border-white/10 opacity-60 grayscale-[0.5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                     <span className={`text-2xl drop-shadow-md ${status === 'upcoming' ? 'animate-pulse' : ''}`}>{prayerIcons[key.toLowerCase()] || '⏳'}</span>
                     <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-md ${status === 'upcoming' ? 'bg-[#e9d1a3] text-black' : 'bg-white/10 text-gray-400'}`}>
                        {status === 'upcoming' ? 'Mendatang' : 'Terlewati'}
                     </span>
                  </div>
                  <h3 className="text-[#e9d1a3] font-black text-[10px] uppercase tracking-[0.3em] mb-1 drop-shadow-sm">{key}</h3>
                  <p className={`text-3xl font-black tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${status === 'upcoming' ? 'text-white' : 'text-gray-300'}`}>
                    {value as string}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
             <p className="text-[#e9d1a3] font-black text-sm uppercase tracking-widest drop-shadow-md">Pilih kota untuk melihat jadwal</p>
          </div>
        )}

        <div className="mt-12 bg-white/[0.04] border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-sm">
           <div className="flex flex-col text-center md:text-left">
              <span className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.4em] opacity-80 mb-2">Waktu Lokal Sekarang</span>
              <h4 className="text-4xl font-black text-white/95 tracking-tighter drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h4>
           </div>
           <div className="h-12 w-px bg-white/10 hidden md:block"></div>
           <div className="text-center md:text-right">
              <span className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.4em] opacity-80 mb-2">Tanggal Masehi</span>
              <p className="text-xl font-black text-white uppercase tracking-wider drop-shadow-md">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
