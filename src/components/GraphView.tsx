import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Maximize2, RefreshCw } from 'lucide-react';

interface Node {
  id: string;
  group?: number;
  val?: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function GraphView() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initial mock data
    setData({
      nodes: [
        { id: "Neural Networks", group: 1, val: 10 },
        { id: "Deep Learning", group: 1, val: 8 },
        { id: "Backpropagation", group: 2, val: 5 },
        { id: "Activation Function", group: 2, val: 5 },
        { id: "Gradient Descent", group: 2, val: 6 },
        { id: "Neurons", group: 3, val: 4 },
        { id: "Layers", group: 3, val: 4 }
      ],
      links: [
        { source: "Neural Networks", target: "Deep Learning" },
        { source: "Deep Learning", target: "Backpropagation" },
        { source: "Backpropagation", target: "Gradient Descent" },
        { source: "Neural Networks", target: "Neurons" },
        { source: "Neural Networks", target: "Layers" },
        { source: "Neurons", target: "Activation Function" }
      ]
    });

    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0A0C10] overflow-hidden dot-grid">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-dash-muted bg-dash-panel/80 px-2 py-1 rounded border border-dash-line">
          Knowledge Graph Visualizer
        </h2>
        <div className="flex gap-1">
          <button className="p-1 bg-dash-panel border border-dash-line hover:bg-dash-surface transition-colors rounded">
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
          <button className="p-1 bg-dash-panel border border-dash-line hover:bg-dash-surface transition-colors rounded">
            <Maximize2 className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {dimensions.width > 0 && (
        <ForceGraph2D
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          nodeAutoColorBy="group"
          nodeLabel="id"
          linkColor={() => "#2A2D35"}
          linkWidth={1}
          nodeRelSize={4}
          onNodeClick={(node: any) => {
             console.log("Clicked concept:", node.id);
          }}
        />
      )}

      <div className="absolute bottom-3 left-3 z-10 text-[9px] text-dash-muted font-mono bg-dash-panel/50 px-2 py-1 border border-dash-line rounded uppercase">
        Query: MATCH (n)-[r:INFLUENCES]-&gt;(m)
      </div>

      <div className="absolute bottom-3 right-3 z-10 bg-dash-panel/80 p-2 text-[8px] mono-label border border-dash-line rounded">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Core Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.4)]" />
          <span>Sub-Topic</span>
        </div>
      </div>
    </div>
  );
}
