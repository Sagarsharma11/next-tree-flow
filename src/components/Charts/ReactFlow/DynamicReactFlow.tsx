"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import {
    ReactFlow,
    Background,
    useEdgesState,
    useNodesState,
    addEdge,
    Handle,
    Position,
    Connection,
    Edge
} from "@xyflow/react";
import "reactflow/dist/style.css";
import data from "@/utils/data/simpleData.json";

// Define props type for CustomNode
interface CustomNodeProps {
    data: {
        label?: string;
        style?: React.CSSProperties;
        handles?: {
            id: string;
            type: "source" | "target";
            position: keyof typeof Position;
            style?: React.CSSProperties;
        }[];
    };
}

// Custom Node Component
const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
    return (
        <div style={{ ...data.style, position: "relative", padding: "10px", textAlign: "center", border: "1px solid black" }}>
            {data.label}

            {/* Conditionally render handles */}
            {data.handles?.map((handle) => (
                <Handle
                    key={handle.id}
                    type={handle.type}
                    position={Position[handle.position]}
                    id={handle.id}
                    style={handle.style}
                />
            ))}
        </div>
    );
};

// ReactFlow Component
const DynamicReactFlow: React.FC = () => {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const updatedNodes = data?.nodes.map((node) => ({
            ...node,
            type: "custom", // Apply custom node type
            data: {
                ...node.data,
                style: node.style,
                handles: node.data?.handles || [], // Ensure handles exist
            },
        }));

        setNodes(updatedNodes);
        setEdges(data?.edges || []);
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: "red", strokeWidth: 2 } }, eds));
    }, [setEdges]);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    return (
        <div style={{ width: "100vw", height: "100vh", backgroundColor: "transparent" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes} // Memoized for better performance
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

export default DynamicReactFlow;
