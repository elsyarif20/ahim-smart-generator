
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-12 border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center space-x-4 mb-4">
          <div className="h-px w-8 bg-gold-gradient opacity-30"></div>
          <span className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.8em] opacity-40">Operational Command</span>
          <div className="h-px w-8 bg-gold-gradient opacity-30"></div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-[#e9d1a3] mb-3 tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(233,209,163,0.35)]">
          AHIM SMART GENERATOR
        </h1>
        
        <div className="flex flex-col items-center">
          <div className="w-48 h-1 bg-gold-gradient my-6 rounded-full shadow-[0_0_15px_rgba(233,209,163,0.5)]"></div>
          <p className="text-gray-400 font-black uppercase text-[11px] md:text-xs tracking-[0.4em] max-w-3xl leading-relaxed italic opacity-80">
            AI-Driven Solutions for Personalized and Advanced Learning Ecosystems
          </p>
        </div>
        
        <div className="mt-10 flex justify-center gap-2">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#e9d1a3] opacity-20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
           ))}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>
    </header>
  );
};

export default Header;
