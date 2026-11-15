import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Maximize2, Minimize2, RefreshCw, Layers } from 'lucide-react';

export interface Node {
  id: string;
  group?: number;
  val?: number;
}

export interface Link {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface GraphViewProps {
  externalGraphData?: GraphData;
  onNodeSelect?: (nodeId: string) => void;
}

export default function GraphView({ externalGraphData, onNodeSelect }: GraphViewProps) {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const fetchGraph = async () => {
    try {
      const res = await fetch('/api/graph');
      if (res.ok) {
        const json = await res.json();
        if (json.nodes && json.nodes.length) {
          setData(json);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch graph from backend, using default structure:", e);
    }

    // Default graph structure
    setData({
      nodes: [
        { id: "Neural Networks", group: 1, val: 10 },
        { id: "Deep Learning", group: 1, val: 8 },
        { id: "Backpropagation", group: 2, val: 6 },
        { id: "Activation Function", group: 2, val: 5 },
        { id: "Gradient Descent", group: 2, val: 6 },
        { id: "Neurons", group: 3, val: 4 },
        { id: "Layers", group: 3, val: 4 },
        { id: "Loss Function", group: 2, val: 5 },
        { id: "Transformers", group: 1, val: 7 },
        { id: "Attention Mechanism", group: 2, val: 6 }
      ],
      links: [
        { source: "Neural Networks", target: "Deep Learning" },
        { source: "Deep Learning", target: "Backpropagation" },
        { source: "Backpropagation", target: "Gradient Descent" },
        { source: "Neural Networks", target: "Neurons" },
        { source: "Neural Networks", target: "Layers" },
        { source: "Neurons", target: "Activation Function" },
        { source: "Gradient Descent", target: "Loss Function" },
        { source: "Deep Learning", target: "Transformers" },
        { source: "Transformers", target: "Attention Mechanism" }
      ]
    });
  };

  useEffect(() => {
    if (externalGraphData && externalGraphData.nodes && externalGraphData.nodes.length > 0) {
      // Merge external graph data with existing data
      setData(prev => {
        const existingNodeIds = new Set(prev.nodes.map(n => n.id));
        const newNodes = [...prev.nodes];
        externalGraphData.nodes.forEach(n => {
          if (!existingNodeIds.has(n.id)) {
            newNodes.push(n);
            existingNodeIds.add(n.id);
          }
        });

        const linkKey = (l: any) => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t = typeof l.target === 'object' ? l.target.id : l.target;
          return `${s}->${t}`;
        };
        const existingLinkKeys = new Set(prev.links.map(linkKey));
        const newLinks = [...prev.links];
        externalGraphData.links.forEach(l => {
          const k = linkKey(l);
          if (!existingLinkKeys.has(k)) {
            newLinks.push(l);
            existingLinkKeys.add(k);
          }
        });

        return { nodes: newNodes, links: newLinks };
      });
    } else {
      fetchGraph();
    }
  }, [externalGraphData]);

  // Robust dimension handling with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isExpanded]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full bg-[#0A0C10] overflow-hidden dot-grid transition-all ${
        isExpanded ? 'fixed inset-4 z-50 rounded-lg border border-dash-accent shadow-2xl' : ''
      }`}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dash-muted bg-dash-panel/90 px-2.5 py-1 rounded border border-dash-line flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-dash-accent" />
          Knowledge Graph Visualizer
        </h2>
        <div className="flex gap-1">
          <button 
            onClick={fetchGraph}
            title="Refresh Knowledge Graph"
            className="p-1.5 bg-dash-panel border border-dash-line hover:bg-dash-surface transition-colors rounded text-dash-muted hover:text-white"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Minimize Graph View" : "Maximize Graph View"}
            className="p-1.5 bg-dash-panel border border-dash-line hover:bg-dash-surface transition-colors rounded text-dash-muted hover:text-white"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3 text-dash-accent" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          nodeAutoColorBy="group"
          nodeLabel="id"
          linkColor={() => "#2A2D35"}
          linkWidth={1.5}
          nodeRelSize={5}
          onNodeClick={(node: any) => {
            setSelectedNode(node.id);
            onNodeSelect?.(node.id);
          }}
        />
      )}

      {selectedNode && (
        <div className="absolute top-12 left-3 z-10 bg-dash-panel/95 p-2 rounded border border-dash-accent text-[10px] text-dash-text animate-in fade-in">
          <span className="text-dash-muted">Selected Concept: </span>
          <span className="font-bold text-dash-accent">{selectedNode}</span>
        </div>
      )}

      <div className="absolute bottom-3 left-3 z-10 text-[9px] text-dash-muted font-mono bg-dash-panel/80 px-2 py-1 border border-dash-line rounded uppercase">
        Query: MATCH (n)-[r:INFLUENCES]-&gt;(m)
      </div>

      <div className="absolute bottom-3 right-3 z-10 bg-dash-panel/90 p-2 text-[8px] mono-label border border-dash-line rounded">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Core Concept</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.4)]" />
          <span>Sub-Topic Edge</span>
        </div>
      </div>
    </div>
  );
}
