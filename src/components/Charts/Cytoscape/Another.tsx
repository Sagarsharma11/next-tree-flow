import React from 'react'

const Another = () => {
  return (
    <div>Another</div>
  )
}

export default Another

// "use client";
// import React from "react";
// import CytoscapeComponent from "react-cytoscapejs";

// // You can dynamically build this based on your cloud scan data
// const elements = [
//   // VPCs
//   { data: { id: "vpc-1", label: "VPC 1" }, classes: "vpc" },

//   // Subnets
//   { data: { id: "subnet-a", label: "Subnet A" }, classes: "subnet" },
//   { data: { id: "subnet-b", label: "Subnet B" }, classes: "subnet" },

//   // EC2 Instances
//   {
//     data: { id: "ec2-1", label: "EC2 1 - 🔴 Critical" },
//     classes: "critical",
//   },
//   {
//     data: { id: "ec2-2", label: "EC2 2 - 🟡 Medium" },
//     classes: "medium",
//   },

//   // Edges / Relationships
//   { data: { source: "vpc-1", target: "subnet-a" } },
//   { data: { source: "vpc-1", target: "subnet-b" } },
//   { data: { source: "subnet-a", target: "ec2-1" } },
//   { data: { source: "subnet-b", target: "ec2-2" } },
// ];

// const stylesheet = [
//   {
//     selector: "node",
//     style: {
//       label: "data(label)",
//       "text-valign": "center",
//       "text-halign": "center",
//       "background-color": "#ddd",
//       shape: "round-rectangle",
//       width: "label",
//       padding: "10px",
//       "font-size": "10px",
//     },
//   },
//   { selector: ".vpc", style: { "background-color": "#00BFFF" } },
//   { selector: ".subnet", style: { "background-color": "#87CEFA" } },
//   { selector: ".critical", style: { "background-color": "#FF4C4C" } },
//   { selector: ".medium", style: { "background-color": "#FFD700" } },

//   // Edge Styling
//   {
//     selector: "edge",
//     style: {
//       width: 2,
//       "line-color": "#ccc",
//       "target-arrow-color": "#ccc",
//       "target-arrow-shape": "triangle",
//       "curve-style": "bezier",
//     },
//   },
// ];

// const layout = {
//   name: "breadthfirst", // or try "dagre", "grid", "cose", "fcose"
//   directed: true,
//   padding: 10,
//   spacingFactor: 1.5,
// };

// const CytoscapeCloudGraph: React.FC = () => {
//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <CytoscapeComponent
//         elements={elements}
//         stylesheet={stylesheet}
//         layout={layout}
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// };

// export default CytoscapeCloudGraph;