
import React from 'react';
import { Module, View } from '../types';
import { APP_MODULES } from '../constants';

import DigitalClock from './DigitalClock';

interface SidebarMenuProps {
  currentModule: Module | null;
  currentView: View;
  onSelect: (id: Module | View) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ currentModule, currentView, onSelect }) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-[#1a1c20] rounded-xl p-4 h-full border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="bg-black/60 p-3 rounded-lg mb-6 border-b-2 border-[#e9d1a3]/30 text-center shadow-inner">
            <span className="text-[10px] font-black text-[#e9d1a3] uppercase tracking-[0.3em] drop-shadow-md mb-2 block">System Terminals</span>
            <div className="mt-2">
               <DigitalClock />
            </div>
          </div>
          
          <div className="space-y-4">
            {APP_MODULES.map((mod) => {
              const isExternal = 'url' in mod;
              const isActive = !isExternal && (mod.id === currentModule || (mod.id === currentView && currentView !== 'form' && currentView !== 'results'));
              
              const icon = (
                <span className={`mr-3 transition-all duration-300 ${isActive ? 'text-[#e9d1a3] scale-110 drop-shadow-[0_0_10px_rgba(233,209,163,0.5)]' : 'text-gray-600 group-hover:text-white'}`}>
                  {mod.id === 'admin' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  {mod.id === 'soal' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                  {mod.id === 'tryout' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                  {mod.id === 'groundedSearch' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                  {mod.id === 'academic' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                  {mod.id === 'ebook' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                  {mod.id === 'quran' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 5h12m-6-2v2m1.048 9.5a18.022 18.022 0 01-3.636-5.5m6.088 9h7m-9 3 5-10 5 10m-8.249-16c-.968 5.77-4.681 10.61-9.751 13.129" /></svg>}
                  {mod.id === 'doa' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                  {mod.id === 'hadith' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                  {mod.id === 'prayer' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {mod.id === 'hadits' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {mod.id === 'perpusnas' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                </span>
              );

              const content = (
                <div className="flex items-center w-full">
                  {icon}
                  <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isActive ? 'text-[#e9d1a3]' : 'text-gray-500 group-hover:text-gray-200'}`}>
                    {mod.title.replace('Generator ', '')}
                  </span>
                  {isExternal && (
                    <svg className="w-3 h-3 ml-auto text-gray-700 group-hover:text-[#e9d1a3] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </div>
              );

              return (
                <button
                  key={mod.id}
                  onClick={() => onSelect(mod.id as any)}
                  className={`group w-full flex p-4 rounded-lg transition-all duration-200 text-left border relative overflow-hidden btn-game-module shadow-lg ${isActive ? 'bg-[#2a2f36] border-[#e9d1a3]/50 ring-1 ring-[#e9d1a3]/20 shadow-[0_0_15px_rgba(233,209,163,0.1)]' : 'bg-black/40 border-white/5 hover:bg-black/60'}`}
                >
                  {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-[#e9d1a3] shadow-[0_0_10px_#e9d1a3]"></div>}
                  {content}
                </button>
              );
            })}
          </div>
          
          <div className="bg-black/40 p-4 rounded-lg border border-white/5 mt-10 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-10 pointer-events-none"></div>
            <h4 className="text-[#e9d1a3] font-black text-[9px] uppercase tracking-[0.3em] mb-2 opacity-60">Status Terminal</h4>
            <p className="text-[10px] text-gray-600 leading-relaxed font-black uppercase tracking-wider italic">
              "AI Engine v4.0 Active // Optimizing for HOTS Output"
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarMenu;
