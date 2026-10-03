import { useEffect, useRef, useState } from "react";
import type { GraphData, GraphNode } from "@/types/risknet";

const typeColors: Record<string, string> = {
  APPLICANT: "#5aa9e6",
  DEVICE: "#f0a65a",
  IP_ADDRESS: "#63cfa8",
  ALERT: "#e8635f",
};

/**
 * Cytoscape.js relationship graph. Cytoscape needs a real DOM, so it is
 * imported dynamically after mount (never during SSR).
 */
export function RelationshipGraph({
  data,
  onSelectNode,
}: {
  data: GraphData;
  onSelectNode?: (node: GraphNode | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let destroyed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cy: any;

    (async () => {
      const cytoscape = (await import("cytoscape")).default;
      if (destroyed || !containerRef.current) return;

      cy = cytoscape({
        container: containerRef.current,
        elements: [
          ...data.nodes.map((n) => ({
            data: { id: n.id, label: n.label, type: n.type, meta: n },
          })),
          ...data.edges.map((e) => ({
            data: { id: e.id, source: e.source, target: e.target, label: e.label },
          })),
        ],
        style: [
          {
            selector: "node",
            style: {
              "background-color": (el: { data: (k: string) => string }) =>
                typeColors[el.data("type")] ?? "#8aa0bd",
              label: "data(label)",
              color: "#dbe6f5",
              "font-size": 10,
              "font-family": "JetBrains Mono Variable, monospace",
              "text-valign": "bottom",
              "text-margin-y": 6,
              "text-wrap": "ellipsis",
              "text-max-width": "110px",
              width: 30,
              height: 30,
              "border-width": 2,
              "border-color": "#1b2436",
            },
          },
          {
            selector: 'node[type = "APPLICANT"]',
            style: { width: 46, height: 46, "font-size": 11 },
          },
          {
            selector: "node:selected",
            style: { "border-width": 3, "border-color": "#ffffff" },
          },
          {
            selector: "edge",
            style: {
              width: 1.4,
              "line-color": "#41506b",
              "target-arrow-color": "#41506b",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(label)",
              "font-size": 8,
              "font-family": "JetBrains Mono Variable, monospace",
              color: "#8fa2bf",
              "text-rotation": "autorotate",
              "text-background-color": "#1b2436",
              "text-background-opacity": 0.9,
              "text-background-padding": "2px",
            },
          },
        ],
        layout: { name: "cose", animate: false, padding: 30, nodeRepulsion: 9000 },
        wheelSensitivity: 0.25,
      });

      cy.on("tap", "node", (evt: { target: { data: (k: string) => GraphNode } }) => {
        onSelectNode?.(evt.target.data("meta"));
      });
      cy.on("tap", (evt: { target: unknown }) => {
        if (evt.target === cy) onSelectNode?.(null);
      });

      setReady(true);
    })();

    return () => {
      destroyed = true;
      cy?.destroy?.();
    };
  }, [data, onSelectNode]);

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-lg border border-border bg-background">
      <div ref={containerRef} className="size-full" />
      {!ready && (
        <p className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Rendering relationship graph…
        </p>
      )}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-md border border-border bg-surface/90 px-3 py-2">
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
            {type.replace("_", " ")}
          </span>
        ))}
      </div>
    </div>
  );
}
