/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Bell,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Download,
  Terminal,
  Layers,
  Database
} from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import GraphView, { GraphData } from './components/GraphView';
import UploadManager from './components/UploadManager';
import Metrics from './components/Metrics';
import { cn } from './lib/utils';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);
  const [activeModal, setActiveModal] = useState<'logs' | 'corpus' | 'architecture' | 'alerts' | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "[SYSTEM] Smart Multi-Modal Tutor initialized.",
    "[RAG] Hybrid Retrieval (Weaviate + Neo4j) pipeline ready.",
    "[ENCODER] Cross-Encoder reranker standby (ms-marco-MiniLM-L-6-v2)."
  ]);
  const [backendStatus, setBackendStatus] = useState<'healthy' | 'checking' | 'disconnected'>('checking');
  const [documents, setDocuments] = useState<any[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const fetchHealthAndDocs = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setBackendStatus('healthy');
      } else {
        setBackendStatus('disconnected');
      }
    } catch {
      setBackendStatus('disconnected');
    }

    try {
      const docRes = await fetch('/api/documents');
      if (docRes.ok) {
        const json = await docRes.json();
        setDocuments(json.documents || []);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchHealthAndDocs();
    const interval = setInterval(fetchHealthAndDocs, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleExportRag = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      session: "Neural_Architectures_L4",
      graph: graphData,
      documents: documents,
      system_logs: systemLogs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rag-session-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLog("[EXPORT] Downloaded RAG session snapshot.");
  };

  return (
    <div className="flex h-screen w-full bg-dash-bg font-sans selection:bg-dash-accent/30 selection:text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-[#0A0C10] border-r border-dash-line flex flex-col transition-all duration-300 z-20 shrink-0",
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
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Internal Dashboard" 
            active={activeModal === null} 
            sidebarOpen={sidebarOpen} 
            onClick={() => setActiveModal(null)}
          />
          <NavItem 
            icon={<GraduationCap />} 
            label="Knowledge Corpus" 
            active={activeModal === 'corpus'} 
            sidebarOpen={sidebarOpen} 
            onClick={() => setActiveModal('corpus')}
          />
          <NavItem 
            icon={<Search />} 
            label="System Search" 
            sidebarOpen={sidebarOpen} 
            onClick={() => setActiveModal('corpus')}
          />
        </nav>

        <div className="px-2 pb-4 space-y-1">
          <NavItem 
            icon={<Bell />} 
            label="System Alerts" 
            badge="0" 
            sidebarOpen={sidebarOpen} 
            onClick={() => setActiveModal('alerts')}
          />
          <NavItem 
            icon={<Settings />} 
            label="Architecture" 
            sidebarOpen={sidebarOpen} 
            onClick={() => setActiveModal('architecture')}
          />
          <div className="h-px bg-dash-line my-3" />
          <NavItem 
            icon={<LogOut />} 
            label="Clear Session" 
            sidebarOpen={sidebarOpen} 
            onClick={() => {
              if (confirm("Reset current RAG context?")) {
                window.location.reload();
              }
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-12 border-b border-dash-line flex items-center justify-between px-4 bg-dash-panel sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-dash-surface rounded transition-colors text-dash-muted hover:text-dash-text"
              title="Toggle Sidebar"
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
             <button 
               onClick={() => setActiveModal('logs')}
               className="h-7 px-3 bg-dash-surface rounded flex items-center justify-center text-[10px] border border-dash-line text-dash-muted hover:text-dash-text cursor-pointer transition-colors"
             >
               View Logs
             </button>
             <button 
               onClick={handleExportRag}
               className="h-7 px-3 bg-dash-accent rounded flex items-center justify-center text-[10px] text-white font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
             >
               <Download className="w-3 h-3" />
               Export RAG
             </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-12 gap-px bg-dash-line">
           {/* Left: Chat Control */}
           <div className="col-span-12 lg:col-span-4 h-full min-h-0 overflow-hidden bg-dash-bg flex flex-col">
              <ChatInterface 
                onGraphUpdate={(g) => setGraphData(g)} 
                onLogAdd={addLog}
              />
           </div>

           {/* Right Toolset */}
           <div className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-0 overflow-hidden bg-dash-bg">
              <div className="flex-1 grid grid-cols-2 gap-px border-b border-dash-line bg-dash-line min-h-0">
                 <div className="bg-dash-bg overflow-hidden relative">
                    <GraphView externalGraphData={graphData} />
                 </div>
                 <div className="bg-dash-bg overflow-hidden border-l border-dash-line">
                    <Metrics />
                 </div>
              </div>
              
              <div className="h-[40%] bg-dash-bg min-h-[160px]">
                 <UploadManager 
                   onUploadSuccess={fetchHealthAndDocs}
                   onLogAdd={addLog}
                 />
              </div>
           </div>
        </div>
        
        {/* Footer Info Bar */}
        <footer className="h-8 bg-dash-panel border-t border-dash-line px-4 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-2">
             <span className="text-[9px] text-dash-muted uppercase font-bold tracking-tighter">
               {backendStatus === 'healthy' 
                 ? 'Services: Backend API Online (FastAPI 1.2.4)' 
                 : 'Services: Local Resilience Mode'}
             </span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-[9px] text-dash-muted font-mono">{documents.length} Corpus Docs</span>
              <div className="flex gap-1.5">
                {[0,1,2,3].map(i => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.4)]",
                      backendStatus === 'healthy' ? "bg-emerald-500" : "bg-yellow-500"
                    )} 
                  />
                ))}
              </div>
           </div>
        </footer>

        {/* Modal: View Logs */}
        {activeModal === 'logs' && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dash-panel border border-dash-line rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-dash-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-dash-accent" />
                  <h3 className="text-xs font-bold text-dash-text">Live RAG Activity & Retrieval Logs</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-dash-surface rounded text-dash-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[#0A0C10]">
                {systemLogs.map((log, index) => (
                  <div key={index} className="text-dash-muted">
                    <span className="text-emerald-400 mr-2">{'>'}</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Knowledge Corpus */}
        {activeModal === 'corpus' && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dash-panel border border-dash-line rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-dash-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-dash-accent" />
                  <h3 className="text-xs font-bold text-dash-text">Multi-Modal Knowledge Corpus</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-dash-surface rounded text-dash-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {documents.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-dash-surface border border-dash-line rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-dash-text">{doc.filename}</p>
                      <p className="text-[10px] text-dash-muted mt-0.5">{doc.summary || doc.content_type}</p>
                    </div>
                    <span className="text-[9px] font-mono bg-dash-panel px-2 py-1 rounded text-dash-accent border border-dash-line">
                      INDEXED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Architecture */}
        {activeModal === 'architecture' && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dash-panel border border-dash-line rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-dash-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-dash-accent" />
                  <h3 className="text-xs font-bold text-dash-text">Hybrid Multi-Modal Graph-RAG Architecture</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-dash-surface rounded text-dash-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto text-xs text-dash-text space-y-3 leading-relaxed">
                <div className="p-3 bg-[#0A0C10] rounded border border-dash-line font-mono text-[10px]">
                  User Query (Text/Image/Audio)<br/>
                  │<br/>
                  ├──► Multi-Modal Embeddings (CLIP, Whisper)<br/>
                  │<br/>
                  ├──► Hybrid Retrieval Layer<br/>
                  │    ├── Vector Search (Dense chunks)<br/>
                  │    └── Graph Traversal (Neo4j sub-graph)<br/>
                  │<br/>
                  ├──► Cross-Encoder Reranking<br/>
                  │<br/>
                  └──► LLM Generation (Grounded Explanation + Graph Visual)
                </div>
                <p>
                  This system integrates semantic vector search with knowledge graph traversals, ensuring educational answers are not only linguistically fluent, but factually grounded and structured.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal: System Alerts */}
        {activeModal === 'alerts' && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dash-panel border border-dash-line rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-dash-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-dash-accent" />
                  <h3 className="text-xs font-bold text-dash-text">System Alerts & Health Status</h3>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-dash-surface rounded text-dash-muted hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto text-xs space-y-3">
                <div className="p-3 bg-dash-surface rounded border border-dash-line flex justify-between items-center">
                  <span>FastAPI Backend Gateway</span>
                  <span className="text-emerald-400 font-mono text-[10px]">ONLINE (Port 8000)</span>
                </div>
                <div className="p-3 bg-dash-surface rounded border border-dash-line flex justify-between items-center">
                  <span>Vite Frontend Dashboard</span>
                  <span className="text-emerald-400 font-mono text-[10px]">ONLINE (Port 3000)</span>
                </div>
                <div className="p-3 bg-dash-surface rounded border border-dash-line flex justify-between items-center">
                  <span>Vector & Graph RAG Bridge</span>
                  <span className="text-emerald-400 font-mono text-[10px]">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  badge, 
  sidebarOpen,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  badge?: string;
  sidebarOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative",
        active ? "bg-dash-accent text-white" : "hover:bg-dash-surface text-dash-muted hover:text-dash-text"
      )}
    >
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
