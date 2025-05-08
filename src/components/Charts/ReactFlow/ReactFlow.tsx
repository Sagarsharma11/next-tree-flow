"use client";
import React, { useCallback } from "react";
import {
    ReactFlow,
    Background,
    useEdgesState,
    useNodesState,
    Position,
    Handle,
    addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./reactflow.module.css";
import { GrBucket } from "react-icons/gr";
import { FaDatabase } from "react-icons/fa6";

const nodeBaseStyle = {
    border: "1px solid #fff",
    padding: 10,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const TopLabel = ({ text }) => (
    <div style={{ position: "absolute", top: "-20px", color: "white", fontSize: "12px", fontWeight: "bold", textAlign: "center" }}>
        {text}
    </div>
);

const initialNodes = [
    { id: "1", position: { x: 100, y: 100 }, type: "default", style: { ...nodeBaseStyle, width: 1200, height: 300 } },
    { id: "2", position: { x: 130, y: 130 }, data: { label: <TopLabel text="Subnet ID" /> }, type: "default", style: { ...nodeBaseStyle, width: 500, height: 200 } },
    {
        id: "3",
        position: { x: 230, y: 180 },
        data: {
            label: (
                <div style={{ color: "white" }}>
                    EC2 Instance
                    <Handle type="source" position={Position.Right} id="ec2-right" style={{ background: "red", top: "50%", transform: "translateY(-50%)" }} />
                    <Handle type="target" position={Position.Left} id="ec2-left" style={{ background: "blue" }} />
                </div>
            ),
        },
        type: "default",
        style: { ...nodeBaseStyle, width: 100, height: 100, borderRadius: "50%" },
    },
    { id: "4", position: { x: 530, y: 180 }, data: { label: <TopLabel text="Security Groups" /> }, type: "default", style: { ...nodeBaseStyle, width: 60, height: 100 } },
    { id: "5", position: { x: 730, y: 130 }, type: "default", style: { ...nodeBaseStyle, width: 500, height: 200 } },
    { id: "6", position: { x: 830, y: 180 }, data: { label: <TopLabel text="Security Groups" /> }, type: "default", style: { ...nodeBaseStyle, width: 60, height: 100 } },
    {
        id: "7",
        position: { x: 1030, y: 200 },
        data: {
            label: (
                <div>
                    <GrBucket size={40} />
                    <Handle type="target" position={Position.Left} id="s3-left" style={{ background: "blue", top: "50%", transform: "translateY(-50%)" }} />
                </div>
            ),
        },
        type: "default",
        style: { ...nodeBaseStyle, width: 60, height: 60, backgroundColor: "#00ff00", color: "#fff" },
    },
    { id: "8", position: { x: 130, y: 530 }, data: { label: <div style={{ color: "white" }}>VPC-ID</div> }, type: "default", style: { ...nodeBaseStyle, width: 400, height: 300 } },
    { id: "9", position: { x: 160, y: 570 }, type: "default", style: { ...nodeBaseStyle, width: 340, height: 240 } },
    { id: "10", position: { x: 200, y: 600 }, data: { label: <TopLabel text="Security Groups" /> }, type: "default", style: { ...nodeBaseStyle, width: 120, height: 40 } },
    {
        id: "11",
        position: { x: 200, y: 700 },
        data: {
            label: (
                <div>
                    <Handle type="target" position={Position.Left} id="s3-top" style={{ background: "blue", top: "0", left: "50%" }} />
                    <Handle type="source" position={Position.Left} id="s3-right" style={{ background: "blue", top: "0", left: "50%" }} />
                    <FaDatabase size={80} />
                </div>
            ),
        },
        type: "default",
        style: { width: 120, height: 100, backgroundColor: "transparent", color: "white" },
    },
];

const defaultEdgeStyle = { strokeWidth: 2 };

const initialEdges = [
    { id: "e3-7", source: "3", sourceHandle: "ec2-right", target: "7", targetHandle: "s3-left", animated: true, type: "smoothstep", style: { stroke: "red", ...defaultEdgeStyle } },
    { id: "e3-7-forward", source: "3", sourceHandle: "ec2-right", target: "11", targetHandle: "s3-top", animated: true, type: "smoothstep", style: { stroke: "red", ...defaultEdgeStyle } },
    { id: "e7-3-reverse", source: "11", sourceHandle: "s3-right", target: "3", targetHandle: "ec2-left", animated: true, type: "smoothstep", style: { stroke: "blue", ...defaultEdgeStyle } },
];

const ReactFlowComponent = () => {
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: "red", ...defaultEdgeStyle } }, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow nodes={nodes} edges={edges} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView>
                <Background className={styles.bgColor} variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default ReactFlowComponent;