import React from 'react';
import { AreaChart, Activity, Cpu, Database } from 'lucide-react';

export default function Metrics() {
  const metrics = [
    { label: "Precision@K", value: "0.89", icon: <Database className="w-3 h-3" /> },
    { label: "Recall@K", value: "0.92", icon: <AreaChart className="w-3 h-3" /> },
    { label: "EM (Exact Match)", value: "0.78", icon: <Cpu className="w-3 h-3" /> },
    { label: "Latency", value: "240ms", icon: <Activity className="w-3 h-3" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-dash-bg">
      <div className="p-3 border-b border-dash-line bg-dash-panel flex items-center justify-between">
        <h2 className="mono-label">System Performance</h2>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 p-3 flex-1 overflow-y-auto">
        {metrics.map((m, i) => (
          <div key={i} className="bg-dash-panel border border-dash-line p-3 flex flex-col justify-between hover:border-dash-accent/50 transition-colors group">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-dash-muted group-hover:text-dash-accent">
                {m.label}
              </span>
              <div className="p-1 bg-dash-surface rounded text-dash-muted group-hover:text-dash-accent">
                {m.icon}
              </div>
            </div>
            <div className="mt-2">
               <span className="text-xl font-mono font-medium tracking-tight text-dash-text">
                 {m.value}
               </span>
            </div>
          </div>
        ))}
        
        <div className="col-span-2 bg-dash-panel border border-dash-line p-3 mt-1">
           <h3 className="text-[9px] font-bold uppercase tracking-widest text-dash-muted mb-3 opacity-70">Impact Delta</h3>
           <div className="space-y-3">
              <div className="space-y-1">
                 <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-dash-muted">CONTEXT ACCURACY</span>
                    <span className="text-emerald-400">+14.2%</span>
                 </div>
                 <div className="h-1 bg-dash-surface rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/80 w-[85%]" />
                 </div>
              </div>
              <div className="space-y-1">
                 <div className="flex justify-between text-[9px] font-mono">
                    <span className="text-dash-muted">GRAPH GROUNDING</span>
                    <span className="text-blue-400">+22.1%</span>
                 </div>
                 <div className="h-1 bg-dash-surface rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500/80 w-[92%]" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
