'use client';

import { useState, useRef, useMemo } from 'react';
import { MOCK_AGENTS } from '@/data/mock-agents';
import { 
  getAllVouchingAgents, 
  getVouchingRelationships
} from '@/data/mock-vouches';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  name: string;
  avatar: string;
  verified: boolean;
  trustScore: number;
  vouchesReceived: number;
  vouchesGiven: number;
}

interface GraphEdge {
  from: string;
  to: string;
  capabilities: string[];
  vouchCount: number;
}

interface SocialGraphVisualizationProps {
  width?: number;
  height?: number;
  className?: string;
}

function getAvatarLabel(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function calculateNodeSize(vouchesReceived: number): number {
  // Base size + scaling based on vouches received
  return Math.max(40, Math.min(80, 40 + vouchesReceived * 4));
}

function getNodeColor(trustScore: number): string {
  if (trustScore >= 90) return '#10b981'; // green-500
  if (trustScore >= 80) return '#3b82f6'; // blue-500
  if (trustScore >= 70) return '#f59e0b'; // amber-500
  if (trustScore >= 60) return '#ef4444'; // red-500
  return '#6b7280'; // gray-500
}

function generateCircularLayout(nodes: GraphNode[], centerX: number, centerY: number, radius: number): GraphNode[] {
  const nodeCount = nodes.length;
  
  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodeCount;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

function generateForceLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number): GraphNode[] {
  // Simple force-directed layout simulation
  const iterations = 100;
  const nodeRepulsion = 5000;
  const edgeAttraction = 0.1;
  const damping = 0.9;
  
  // Initialize random positions
  const positions = nodes.map(node => ({
    ...node,
    x: Math.random() * (width - 100) + 50,
    y: Math.random() * (height - 100) + 50,
    vx: 0,
    vy: 0,
  }));
  
  for (let iter = 0; iter < iterations; iter++) {
    // Calculate forces
    positions.forEach(node => {
      node.vx *= damping;
      node.vy *= damping;
      
      // Repulsion from other nodes
      positions.forEach(other => {
        if (node.id !== other.id) {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy) + 0.1; // Avoid division by zero
          const force = nodeRepulsion / (distance * distance);
          
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }
      });
      
      // Attraction from connected edges
      edges.forEach(edge => {
        if (edge.from === node.id) {
          const target = positions.find(n => n.id === edge.to);
          if (target) {
            const dx = target.x - node.x;
            const dy = target.y - node.y;
            
            node.vx += dx * edgeAttraction;
            node.vy += dy * edgeAttraction;
          }
        }
        if (edge.to === node.id) {
          const source = positions.find(n => n.id === edge.from);
          if (source) {
            const dx = source.x - node.x;
            const dy = source.y - node.y;
            
            node.vx += dx * edgeAttraction;
            node.vy += dy * edgeAttraction;
          }
        }
      });
    });
    
    // Update positions
    positions.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      
      // Keep nodes within bounds
      const nodeSize = calculateNodeSize(node.vouchesReceived);
      node.x = Math.max(nodeSize, Math.min(width - nodeSize, node.x));
      node.y = Math.max(nodeSize, Math.min(height - nodeSize, node.y));
    });
  }
  
  return positions;
}

export default function SocialGraphVisualization({ 
  width = 800, 
  height = 600, 
  className = '' 
}: SocialGraphVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<'force' | 'circular'>('force');
  const svgRef = useRef<SVGSVGElement>(null);

  // Prepare graph data
  const { nodes, edges } = useMemo(() => {
    const agentAddresses = getAllVouchingAgents();
    const relationships = getVouchingRelationships();
    
    // Create nodes from agents
    const nodeList: GraphNode[] = agentAddresses.map(address => {
      const agent = MOCK_AGENTS.find(a => a.address.toLowerCase() === address.toLowerCase());
      
      if (!agent) {
        // Fallback for unknown agents
        return {
          id: address,
          x: 0,
          y: 0,
          name: `Agent ${address.slice(2, 8).toUpperCase()}`,
          avatar: address.slice(2, 4).toUpperCase(),
          verified: false,
          trustScore: 50,
          vouchesReceived: 0,
          vouchesGiven: 0,
        };
      }
      
      // Count vouches for this agent
      const receivedCount = relationships.filter(r => r.to.toLowerCase() === address.toLowerCase()).length;
      const givenCount = relationships.filter(r => r.from.toLowerCase() === address.toLowerCase()).length;
      
      return {
        id: address,
        x: 0,
        y: 0,
        name: agent.name,
        avatar: getAvatarLabel(agent.name),
        verified: agent.verified,
        trustScore: agent.trustScore,
        vouchesReceived: receivedCount,
        vouchesGiven: givenCount,
      };
    });
    
    // Create edges
    const edgeList: GraphEdge[] = relationships.map(rel => ({
      from: rel.from,
      to: rel.to,
      capabilities: rel.capabilities,
      vouchCount: rel.vouchCount,
    }));
    
    return { nodes: nodeList, edges: edgeList };
  }, []);

  // Apply layout algorithm
  const positionedNodes = useMemo(() => {
    if (nodes.length === 0) return [];
    
    if (layoutType === 'circular') {
      return generateCircularLayout(nodes, width / 2, height / 2, Math.min(width, height) * 0.3);
    } else {
      return generateForceLayout(nodes, edges, width, height);
    }
  }, [nodes, edges, layoutType, width, height]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };


  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedNode) return false;
    if (nodeId === selectedNode) return true;
    
    // Highlight connected nodes
    return edges.some(edge => 
      (edge.from === selectedNode && edge.to === nodeId) ||
      (edge.to === selectedNode && edge.from === nodeId)
    );
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Controls */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Agent Social Graph</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Layout:</label>
              <select 
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value as 'force' | 'circular')}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="force">Force-directed</option>
                <option value="circular">Circular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="p-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Background */}
          <rect width={width} height={height} fill="#fafafa" />
          
          {/* Edges */}
          <g>
            {edges.map((edge, index) => {
              const fromNode = positionedNodes.find(n => n.id === edge.from);
              const toNode = positionedNodes.find(n => n.id === edge.to);
              
              if (!fromNode || !toNode) return null;
              
              const isHighlighted = selectedNode && (
                edge.from === selectedNode || edge.to === selectedNode
              );
              
              const opacity = selectedNode ? (isHighlighted ? 0.8 : 0.1) : 0.4;
              const strokeWidth = isHighlighted ? 2 : 1;
              
              return (
                <g key={`edge-${index}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#6b7280"
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    markerEnd="url(#arrowhead)"
                  />
                  
                  {/* Edge label */}
                  {isHighlighted && edge.capabilities.length > 0 && (
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2}
                      fill="#374151"
                      fontSize="10"
                      textAnchor="middle"
                      dy="-5"
                    >
                      {edge.capabilities[0]}
                      {edge.capabilities.length > 1 && ` +${edge.capabilities.length - 1}`}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6b7280"
              />
            </marker>
          </defs>

          {/* Nodes */}
          <g>
            {positionedNodes.map(node => {
              const nodeSize = calculateNodeSize(node.vouchesReceived);
              const isHighlighted = isNodeHighlighted(node.id);
              const isSelected = selectedNode === node.id;
              const isHovered = hoveredNode === node.id;
              
              const opacity = selectedNode && !isHighlighted ? 0.3 : 1;
              const strokeColor = isSelected ? '#3b82f6' : isHighlighted ? '#10b981' : '#e5e7eb';
              const strokeWidth = isSelected || isHighlighted ? 3 : 1;
              
              return (
                <g 
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeSize / 2}
                    fill={getNodeColor(node.trustScore)}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    className="transition-all duration-200"
                  />
                  
                  {/* Avatar text */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    opacity={opacity}
                  >
                    {node.avatar}
                  </text>
                  
                  {/* Name label */}
                  <text
                    x={node.x}
                    y={node.y + nodeSize / 2 + 16}
                    fill="#374151"
                    fontSize="11"
                    textAnchor="middle"
                    opacity={opacity}
                    className="transition-all duration-200"
                  >
                    {node.name}
                  </text>
                  
                  {/* Verification badge */}
                  {node.verified && (
                    <circle
                      cx={node.x + nodeSize / 3}
                      cy={node.y - nodeSize / 3}
                      r="6"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                      opacity={opacity}
                    />
                  )}
                  
                  {/* Hover tooltip */}
                  {(isHovered || isSelected) && (
                    <g>
                      <rect
                        x={node.x - 60}
                        y={node.y - nodeSize / 2 - 50}
                        width="120"
                        height="40"
                        fill="rgba(0, 0, 0, 0.8)"
                        rx="4"
                      />
                      <text
                        x={node.x}
                        y={node.y - nodeSize / 2 - 35}
                        fill="white"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        Trust: {node.trustScore}
                      </text>
                      <text
                        x={node.x}
                        y={node.y - nodeSize / 2 - 20}
                        fill="white"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        Vouches: {node.vouchesReceived} received, {node.vouchesGiven} given
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>High Trust (90+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>Good Trust (80-89)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>Fair Trust (70-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Low Trust (60-69)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Verified</span>
          </div>
          <div className="text-gray-600">
            Node size = vouches received | Click to highlight connections
          </div>
        </div>
      </div>
    </div>
  );
}