import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EmbeddedBrowserProps {
  url: string;
  title: string;
  onBack: () => void;
}

const EmbeddedBrowser: React.FC<EmbeddedBrowserProps> = ({ url, title, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  
  // Sites known to block iframes
  const isRestricted = url.includes('.go.id') || url.includes('perpusnas');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setShowWarning(true);
    }, 4000); 
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto px-4 fade-in">
      {/* Browser Bar */}
      <div className="bg-[#1a1c20] border-t border-l border-r border-white/10 rounded-t-xl p-4 flex items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-brushed opacity-5 pointer-events-none"></div>
        <div className="flex items-center space-x-6 relative z-10">
          <button 
            onClick={onBack}
            className="group flex items-center space-x-3 text-gray-500 hover:text-[#e9d1a3] transition-all"
          >
            <div className="w-8 h-8 rounded-full border border-white/5 bg-black/40 flex items-center justify-center group-hover:border-[#e9d1a3]/30">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </button>
          
          <div className="h-4 w-px bg-white/10"></div>
          
          <div className="flex flex-col">
            <h2 className="text-[#e9d1a3] font-black text-xs uppercase tracking-[0.2em]">{title}</h2>
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5 truncate max-w-[150px] md:max-w-md">
              Target Node // {url}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-6 py-2.5 bg-[#e9d1a3] text-[#1a1c20] hover:brightness-110 rounded-lg transition-all shadow-lg active:translate-y-px"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Buka di Tab Baru</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
      
      {/* Iframe View */}
      <div className="flex-grow bg-white rounded-b-xl overflow-hidden relative border-l border-r border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <AnimatePresence>
          {(isLoading || isRestricted) && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-[#14161a] flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-2xl w-full">
                <div className="w-20 h-20 mx-auto relative mb-10">
                   <div className="absolute inset-0 border-4 border-[#e9d1a3]/10 rounded-full"></div>
                   <div className={`absolute inset-0 border-4 border-[#e9d1a3] rounded-full border-t-transparent ${isLoading && !showWarning ? 'animate-spin' : ''}`}></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl">
                     {isRestricted ? '🛡️' : '📡'}
                   </div>
                </div>

                <h3 className="text-[#e9d1a3] font-black uppercase tracking-[0.4em] text-lg mb-4 drop-shadow-lg">
                  {isRestricted ? 'SECURITY OVERRIDE DETECTED' : 'ESTABLISHING SECURE UPLINK'}
                </h3>
                
                <div className="bg-black/60 p-8 rounded-xl border border-[#e9d1a3]/20 shadow-2xl mb-8">
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                    Situs resmi <span className="text-[#e9d1a3] font-black">{title}</span> memiliki kebijakan keamanan tinggi yang membatasi akses tampilan di dalam aplikasi lain (iFrame).
                  </p>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-8 border-t border-white/5 pt-6">
                    Identity Verified // Protocol: HTTPS // Status: Restricted Access
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-gold px-10 py-5 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(233,209,163,0.2)] hover:scale-105 transition-transform"
                    >
                      Buka Layanan Utama
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 text-gray-700">
                   <div className="h-px w-8 bg-gray-800"></div>
                   <span className="text-[8px] font-black uppercase tracking-[0.4em]">Node ID: 0x4A_RED</span>
                   <div className="h-px w-8 bg-gray-800"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isRestricted && (
          <iframe 
            src={url} 
            className="w-full h-full border-none bg-white"
            onLoad={() => setIsLoading(false)}
            title={title}
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
          />
        )}
      </div>
      
      {/* Status Bar */}
      <div className="mt-4 flex justify-between items-center px-2">
         <div className="flex items-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRestricted ? 'bg-amber-500' : 'bg-green-500'} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}></div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-shadow">
              {isRestricted ? 'Protocol Redirect Active' : 'Encrypted Tunnel Active'}
            </span>
         </div>
         <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest opacity-40">Artifact: Node_External_View_0x1</span>
      </div>
    </div>
  );
};

export default EmbeddedBrowser;
