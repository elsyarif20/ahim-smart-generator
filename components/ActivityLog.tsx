
import React from 'react';
import { ActivityLogItem, Module } from '../types';

interface ActivityLogProps {
  logs: ActivityLogItem[];
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "NOW";
};

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const getModuleInfo = (module_type: Module): { color: string; label: string } => {
    switch (module_type) {
      case 'admin':
        return { label: 'ADMIN', color: 'text-blue-400' };
      case 'soal':
        return { label: 'SOAL', color: 'text-green-400' };
      default:
         return { label: 'TASK', color: 'text-gray-400' };
    }
  };

  return (
    <div className="bg-[#1a1c20] rounded-xl border border-white/5 shadow-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="bg-black/60 p-3 rounded-lg mb-6 border-b-2 border-green-500/30 text-center shadow-inner">
           <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] drop-shadow-md">Live Command Feed</span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
          {logs.length === 0 ? (
            <div className="text-center py-12 bg-black/20 rounded border border-white/5">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic opacity-50">Signal Terminal: Quiet</p>
            </div>
          ) : (
            logs.map(log => {
              const moduleInfo = getModuleInfo(log.module_type);
              return (
                <div key={log.id} className="flex items-center space-x-4 p-3 bg-black/40 border border-white/5 rounded hover:border-green-500/20 transition-colors fade-in font-mono">
                  <div className="w-2 h-2 rounded-full bg-green-500/40 animate-pulse"></div>
                  <div className="flex-grow">
                     <p className="text-[10px] text-gray-500 flex justify-between">
                        <span className="font-black uppercase tracking-widest text-gray-400">{log.user}</span>
                        <span className="opacity-40">{timeAgo(log.created_at)}</span>
                     </p>
                     <p className="text-[11px] text-gray-200 mt-0.5 truncate uppercase font-black">
                        EXECUTED {moduleInfo.label} // {log.details}
                     </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
