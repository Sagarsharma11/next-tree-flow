"use client";
import React, { useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import cloudData from "@/utils/data/data5.json";
import { convertCloudJsonToCytoscapeElements2 } from "@/utils/chartDraw/convertCloudJsonToCytoscapeElements";
import Modal from "@/components/Modal/Modal";
import { FcInfo } from "react-icons/fc";
// import cloudData from "@/utils/data/vastData.json"
// import cloudData from "@/utils/data/data.json"


cytoscape.use(dagre);


const layout = {
    name: "dagre", // For hierarchical layout
    rankDir: "TB",
    nodeSep: 50,
    edgeSep: 10,
    rankSep: 50,
    padding: 20,
};

const stylesheet = [

    {
        selector: 'node',
        style: {
            label: 'data(label)', // Display label from data
            'text-wrap': 'wrap', // Ensure text wraps
            'text-valign': 'center', // Vertically align the text
            'text-halign': 'center', // Horizontally align the text
            'background-color': '#ccc', // Background color
            shape: 'round-rectangle', // Shape of the node
            'font-size': '10px', // Font size
            padding: '8px', // Padding around the text
            'min-width': '20px', // Ensure nodes have a minimum width
            'min-height': '20px', // Ensure nodes have a minimum height
            width: (node: any) => {
                const labelLength = node.data('label') ? node.data('label').length : 0;
                return Math.max(40, labelLength * 8); // Dynamically set width based on label length (minimum 40px)
            },
            height: (node: any) => {
                const labelLines = node.data('label').split('\n').length;
                return Math.max(40, labelLines * 20); // Dynamically set height based on number of lines (minimum 40px)
            },
        }
    },
    {
        selector: ":parent",
        style: {
            "background-opacity": 0.1,
            "border-width": 2,
            "border-color": "#888",
            "text-valign": "top",
            "text-halign": "center",
            "padding": 15,
            "font-weight": "bold",
        },
    },
    { selector: ".vpc", style: { "background-color": "#A0D2FF", "border-color": "#3399FF", "color": "#fff", "font-size": "18px" } },
    { selector: ".subnet", style: { "background-color": "#A0D2FF", "border-color": "#33CCFF", "color": "#FFF", "font-size": "18px" } },
    { selector: ".sg", style: { "background-color": "#A0D2FF", "color": "#fff", "font-size": "18px" } },
    { selector: ".ec2", style: { "background-color": "#FF6347", } },
    { selector: ".igw", style: { "background-color": "#90EE95", "font-size": "18px" } },
    { selector: ".nacl", style: { "background-color": "#9370DB", "color": "#fff", "font-size": "18px" } },
    {
        selector: ".aws-resource", style: { "background-color": "#90EE90",  "font-size": "18px" }
    },
    {
        selector: "edge",
        style: {
            width: 1,
            "line-color": "red",
            "target-arrow-color": "#aaa",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "line-style": "dashed",
            "line-dash-pattern": [6, 3],
            "line-dash-offset": 0,
        },
    },
    {
        selector: 'edge.subnet-connection',
        style: {
            'line-color': '#00bcd4',
            'target-arrow-shape': 'none',  // no arrow
            'curve-style': 'bezier',
            // 'label': 'data(label)',
            'width': 2,
        },
    },
];

const Learn: React.FC = () => {
    const [userJsonData, setUserJsonData] = useState([]);
    const [handleChangeData, setHandleChangeData] = useState(null);
    let elements = convertCloudJsonToCytoscapeElements2(userJsonData.length ? userJsonData : cloudData);

    const cyRef = useRef<any>(null);
    const [data, setData] = useState("")

    // Handle node click
    const handleNodeClick = (data: any) => {
        setData(data)
        //@ts-ignore
        document.getElementById('my_modal_3').showModal()
    };

    // Add event listener on mount
    useEffect(() => {
        if (cyRef.current) {
            const cy = cyRef.current;
            cy.on('tap', 'node', (event: any) => {
                const nodeData = event.target.data();
                handleNodeClick(nodeData);
            });
        }
    }, []);

    // Animate dashed lines
    useEffect(() => {
        const interval = setInterval(() => {
            if (cyRef.current) {
                cyRef.current.edges().forEach((edge: any) => {
                    const currentOffset = parseInt(edge.style("line-dash-offset")) || 0;
                    edge.style("line-dash-offset", (currentOffset - 1) % 20);
                });
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Zoom out the graph a little bit when the component is mounted
    useEffect(() => {
        if (cyRef.current) {
            // cyRef.current.zoom(1.3); // Adjust the zoom level (0.8 zooms out)
            const cy = cyRef.current
            cy.zoom(cy.zoom() * 0.8);
        }
    }, []);

    const onHandleChange = (e: any) => {
        console.log(e.target.value);
        setHandleChangeData(e.target.value);
    }

    const handleUserDataClick = () => {
        try {
            const parsedData = JSON.parse(handleChangeData);
            setUserJsonData(parsedData);

            if (cyRef.current) {
                const cy = cyRef.current;
                const newElements = convertCloudJsonToCytoscapeElements2(parsedData);

                // Remove existing elements
                cy.elements().remove();

                // Add new elements
                cy.add(newElements);

                // Re-run layout and fit
                cy.layout(layout).run();
                cy.fit();
                cy.zoom(cy.zoom() * 0.8);
                cy.center();
            }
        } catch (error) {
            console.error("Invalid JSON data", error);
        }
    };

    return (
        <>
            <div className="bg-transparent flex justify-center items-center p-4 gap-2">
                <textarea onChange={onHandleChange} className="border rounded border-blue-400" name="" id=""></textarea>
                <button onClick={handleUserDataClick} className="bg-blue-950 text-white p-2 rounded hover:bg-blue-700">
                    Add User Json Data
                </button>
            </div>
            <div style={{ height: "100vh", width: "100%", background: "#1f1f1f" }}>

                <Modal data={data} jsonData={cloudData} />
                <CytoscapeComponent
                    cy={(cy) => {
                        cyRef.current = cy;
                    }}
                    elements={CytoscapeComponent.normalizeElements(elements)}
                    layout={layout}
                    stylesheet={stylesheet}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>



        </>
    );
};

export default Learn;