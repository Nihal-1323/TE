/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import GraphView from './components/GraphView';
import UploadManager from './components/UploadManager';
import Metrics from './components/Metrics';
import { cn } from './lib/utils';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-dash-bg font-sans selection:bg-dash-accent/30 selection:text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-[#0A0C10] border-r border-dash-line flex flex-col transition-all duration-300 z-20",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="p-4 border-b border-dash-line bg-dash-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-dash-accent flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-[11px] font-bold tracking-widest text-dash-accent uppercase">Smart Tutor</h1>
                <p className="text-[9px] text-dash-muted mt-0.5">MM Graph-RAG v1.2.4</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1 mt-4">
          <NavItem icon={<LayoutDashboard />} label="Internal Dashboard" active sidebarOpen={sidebarOpen} />
          <NavItem icon={<GraduationCap />} label="Knowledge Corpus" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Search />} label="System Search" sidebarOpen={sidebarOpen} />
        </nav>

        <div className="px-2 pb-4 space-y-1">
          <NavItem icon={<Bell />} label="System Alerts" badge="2" sidebarOpen={sidebarOpen} />
          <NavItem icon={<Settings />} label="Architecture" sidebarOpen={sidebarOpen} />
          <div className="h-px bg-dash-line my-3" />
          <NavItem icon={<LogOut />} label="Terminate" sidebarOpen={sidebarOpen} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-12 border-b border-dash-line flex items-center justify-between px-4 bg-dash-panel sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-dash-surface rounded transition-colors text-dash-muted hover:text-dash-text"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            <div className="h-4 w-px bg-dash-line mx-1" />
            <div>
               <h1 className="text-xs font-semibold text-dash-text">Active Session: Neural_Architectures_L4</h1>
            </div>
            <span className="text-[10px] text-yellow-500 font-mono hidden md:inline-block">Reranking Active (v2.1)</span>
          </div>
          
          <div className="flex gap-2">
             <div className="h-7 px-3 bg-dash-surface rounded flex items-center justify-center text-[10px] border border-dash-line text-dash-muted hover:text-dash-text cursor-pointer transition-colors">
               View Logs
             </div>
             <div className="h-7 px-3 bg-dash-accent rounded flex items-center justify-center text-[10px] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer">
               Export RAG
             </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-12 gap-px bg-dash-line">
           {/* Left: Chat Control */}
           <div className="col-span-12 lg:col-span-4 h-full bg-dash-bg">
              <ChatInterface />
           </div>

           {/* Right Toolset */}
           <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-dash-bg">
              <div className="flex-1 grid grid-cols-2 gap-px border-b border-dash-line bg-dash-line">
                 <div className="bg-dash-bg overflow-hidden relative">
                    <GraphView />
                 </div>
                 <div className="bg-dash-bg overflow-hidden border-l border-dash-line">
                    <Metrics />
                 </div>
              </div>
              
              <div className="h-[40%] bg-dash-bg">
                 <UploadManager />
              </div>
           </div>
        </div>
        
        {/* Footer info Bar */}
        <footer className="h-8 bg-dash-panel border-t border-dash-line px-4 flex items-center justify-between">
           <span className="text-[9px] text-dash-muted uppercase font-bold tracking-tighter">Docker: Running 4/4 containers</span>
           <div className="flex gap-1.5">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
              ))}
           </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  badge, 
  sidebarOpen 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  badge?: string;
  sidebarOpen: boolean;
}) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative",
      active ? "bg-dash-accent text-white" : "hover:bg-dash-surface text-dash-muted hover:text-dash-text"
    )}>
      <div className={cn(
        "shrink-0",
        active ? "text-white" : "text-dash-muted group-hover:text-dash-accent"
      )}>
        {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 })}
      </div>
      {sidebarOpen && (
        <>
          <span className="text-[11px] font-medium flex-1 text-left">{label}</span>
          {badge && (
            <span className="px-1 py-0.5 rounded bg-dash-accent/20 text-dash-accent text-[9px] font-bold">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}


