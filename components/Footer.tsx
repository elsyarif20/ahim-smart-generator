
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 border-t border-white/5 relative overflow-hidden bg-[#0f1115]">
      <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left mb-16">
          <div className="space-y-4">
             <h3 className="text-[#e9d1a3] font-black text-xs uppercase tracking-[0.3em]">Module Overview</h3>
             <p className="text-gray-500 text-sm leading-relaxed font-medium">
               Sistem berbasis Deep Learning untuk menghasilkan perangkat administrasi guru dan bank soal sesuai Kurikulum Merdeka.
             </p>
          </div>
          <div className="space-y-4">
             <h3 className="text-[#e9d1a3] font-black text-xs uppercase tracking-[0.3em]">Core Functions</h3>
             <ul className="text-gray-500 text-[11px] font-black uppercase tracking-widest space-y-2">
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#e9d1a3] rounded-full mr-3 opacity-30"></span> Generator ATP & Modul Ajar</li>
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#e9d1a3] rounded-full mr-3 opacity-30"></span> Bank Soal Adaptif</li>
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#e9d1a3] rounded-full mr-3 opacity-30"></span> Asesmen Komprehensif</li>
             </ul>
          </div>
          <div className="space-y-4">
             <h3 className="text-[#e9d1a3] font-black text-xs uppercase tracking-[0.3em]">Support Status</h3>
             <ul className="text-gray-500 text-[11px] font-black uppercase tracking-widest space-y-2">
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#e9d1a3] rounded-full mr-3 opacity-30"></span> SMA (Kelas 10-12)</li>
               <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#e9d1a3] rounded-full mr-3 opacity-30"></span> Full National Curriculum</li>
             </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 space-y-6">
          <p className="text-gray-600 font-black uppercase text-[10px] tracking-[0.5em]">
            © 2025 AHIM SMART GENERATOR // ENCRYPTED NODE 0X4A
          </p>
          <div className="inline-block px-10 py-4 bg-black/60 border border-[#e9d1a3]/20 rounded-lg shadow-inner">
            <p className="text-[#e9d1a3] text-sm md:text-md font-black tracking-[0.2em] uppercase drop-shadow-md">
              Developed @2025 by Liyas Syarifudin, M.Pd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
