import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUnit = (unit: number) => unit.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center bg-black/60 px-6 py-4 rounded-xl border border-[#e9d1a3]/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center space-x-2">
        <span className="text-[#e9d1a3] font-mono font-black text-4xl md:text-5xl tracking-tighter drop-shadow-[0_0_12px_rgba(233,209,163,0.4)]">
          {formatUnit(time.getHours())}
        </span>
        <span className="text-[#e9d1a3] font-black text-3xl animate-pulse">:</span>
        <span className="text-[#e9d1a3] font-mono font-black text-4xl md:text-5xl tracking-tighter drop-shadow-[0_0_12px_rgba(233,209,163,0.4)]">
          {formatUnit(time.getMinutes())}
        </span>
        <span className="text-[#e9d1a3]/60 font-mono text-xl ml-1 self-end mb-2">
          {formatUnit(time.getSeconds())}
        </span>
      </div>
      <div className="mt-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
        {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  );
};

export default DigitalClock;
