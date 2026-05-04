
import React from 'react';
import { View } from '../types';

interface DashboardProps {
  onModuleSelect: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="fade-in space-y-10">
      <div className="bg-[#1a1c20] p-10 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#e9d1a3]/5 rounded-full blur-3xl group-hover:bg-[#e9d1a3]/10 transition-all duration-1000"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-1000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#e9d1a3] mb-4 tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(233,209,163,0.3)]">HUB KENDALI UTAMA</h2>
            <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full mb-6 shadow-[0_0_10px_rgba(233,209,163,0.5)]"></div>
            <p className="text-gray-400 leading-relaxed text-[11px] font-black uppercase tracking-[0.3em] opacity-80 italic">
              AI-Intelligence Level 4 Integrated // Ready for Administrative Expansion
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'CEPAT', subtitle: 'Rapid Analysis', icon: '⚡' },
              { title: 'AKURAT', subtitle: 'Precision Stats', icon: '🎯' },
              { title: 'ADAPTIF', subtitle: 'Dynamic Scaling', icon: '🌀' }
            ].map((stat, idx) => (
              <div key={idx} className="p-8 bg-black/60 rounded-lg border border-white/5 btn-game-module group/card relative overflow-hidden cursor-default">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/card:opacity-30 transition-opacity">
                  <span className="text-4xl">{stat.icon}</span>
                </div>
                <div className="text-[#e9d1a3] font-black text-2xl mb-1 tracking-[0.2em] uppercase group-hover/card:scale-105 transition-transform origin-left">
                  {stat.title}
                </div>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] group-hover/card:text-gray-300 transition-colors">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-8 bg-black/40 rounded-lg border border-white/5 border-dashed relative group/info hover:border-[#e9d1a3]/30 transition-colors text-center">
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.5em] mb-4 opacity-50">Operational Protocol</div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl mx-auto font-medium">
              Platform ini dirancang untuk optimalisasi manajemen pendidikan melalui integrasi Kecerdasan Buatan. 
              Gunakan terminal modul untuk inisiasi proses administrasi atau bank soal.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-8">
         <div className="flex gap-2 mb-6">
           {[...Array(5)].map((_, i) => (
             <div key={i} className={`w-2 h-2 rounded-sm bg-[#e9d1a3] ${i === 2 ? 'opacity-100 shadow-[0_0_10px_#e9d1a3]' : 'opacity-20'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>
           ))}
         </div>
         <p className="text-[#e9d1a3] text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Init: Select Operation Module from Side Terminal</p>
      </div>
    </div>
  );
};

export default Dashboard;
