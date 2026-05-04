
import React from 'react';
import { User } from '../types';

interface UserProgressProps {
  users: User[];
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    
    return "NOW";
};

const UserProgress: React.FC<UserProgressProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  return (
    <div className="bg-[#1a1c20] rounded-xl border border-white/5 shadow-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="bg-black/60 p-3 rounded-lg mb-6 border-b-2 border-amber-500/30 text-center shadow-inner">
           <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em] drop-shadow-md">User Authorization Levels</span>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {sortedUsers.length === 0 ? (
            <div className="text-center py-12 bg-black/20 rounded border border-white/5">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic opacity-50">No Operator Data Found</p>
            </div>
          ) : (
            sortedUsers.map(user => (
              <div key={user.id} className="bg-black/40 border border-white/5 rounded-lg p-5 hover:border-amber-500/20 transition-all group/user relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/user:opacity-30 transition-opacity">
                   <span className="text-2xl">👤</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-[#e9d1a3] uppercase tracking-widest text-xs">{user.name}</h3>
                  <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Active: {timeAgo(user.lastSeen)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="space-y-3">
                     <div className="flex flex-col">
                       <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">TOTAL_SYNC</span>
                       <span className="text-xs font-black text-white">{user.totalGenerations} CYCLE</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                       <span className="text-blue-500/70">ADMIN</span>
                       <span className="text-gray-400">{user.usageStats.admin}</span>
                     </div>
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                       <span className="text-green-500/70">SOAL</span>
                       <span className="text-gray-400">{user.usageStats.soal}</span>
                     </div>
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                       <span className="text-amber-500/70">TRYOUT</span>
                       <span className="text-gray-400">{user.usageStats.tryout}</span>
                     </div>
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

export default UserProgress;
