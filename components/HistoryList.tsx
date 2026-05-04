
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onView, onDelete }) => {
  return (
    <div className="bg-[#1a1c20] rounded-xl border border-white/5 shadow-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="bg-black/60 p-3 rounded-lg mb-6 border-b-2 border-indigo-500/30 text-center shadow-inner">
           <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] drop-shadow-md">Operation Logs</span>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          {history.length === 0 ? (
            <div className="text-center py-12 bg-black/20 rounded border border-white/5">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic opacity-50">Log Terminal Primary: No Records</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="bg-black/40 border border-white/5 rounded-lg p-5 hover:border-[#e9d1a3]/30 transition-all duration-200 group/item relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20 group-hover/item:bg-indigo-500/50 transition-colors"></div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  <div className="flex flax-col sm:flex-row items-center gap-3">
                    <span className="px-3 py-1 text-[9px] font-black rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 uppercase tracking-widest">
                       {item.module_type === 'admin' ? 'ADMIN' : 'BANK_SOAL'}
                    </span>
                    <span className="text-xs font-black text-[#e9d1a3] uppercase tracking-widest">{item.mata_pelajaran} // KELAS {item.kelas}</span>
                  </div>
                  <div className="flex space-x-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button onClick={() => onView(item)} className="px-4 py-1.5 bg-[#e9d1a3] text-[#1a1c20] text-[9px] font-black rounded uppercase tracking-widest hover:brightness-110 active:translate-y-px transition-all">RESTORE</button>
                    <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black rounded uppercase tracking-widest hover:bg-red-500/20 transition-all">PURGE</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Target Node</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">{item.sekolah}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Timestamp</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
