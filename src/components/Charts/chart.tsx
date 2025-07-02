"use client";
import React, { useEffect, useRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import cloudData from "@/utils/data/data2.json";
// import cloudData from "@/utils/data/vastData.json"


cytoscape.use(dagre);

// export const convertCloudJsonToCytoscapeElements = (data: any) => {
//     const elements: any[] = [];

//     data.forEach((region:any) => {
//         region.VPCs.forEach((vpc:any) => {
//             const vpcId = vpc.VPC_ID;

//             // VPC node
//             elements.push({
//                 data: { id: vpcId, label: `VPC\n${vpcId}` },
//                 classes: "vpc",
//             });

//             // Internet Gateway
//             if (vpc.Internet_Gateway) {
//                 const igw = vpc.Internet_Gateway;
//                 elements.push({
//                     data: { id: igw.IGW_ID, label: `IGW\n${igw.IGW_ID}` },
//                     classes: "igw",
//                 });
//                 elements.push({
//                     data: {
//                         source: igw.Attached_VPC,
//                         target: igw.IGW_ID,
//                         label: "Attached",
//                     },
//                 });
//             }

//             // Subnets
//             vpc.Subnets.forEach((subnet:any) => {
//                 const subnetId = subnet.Subnet_ID;
//                 elements.push({
//                     data: {
//                         id: subnetId,
//                         label: `Subnet\n${subnetId}`,
//                         parent: vpcId,
//                     },
//                     classes: "subnet",
//                 });

//                 // NACL
//                 if (subnet.NACL) {
//                     elements.push({
//                         data: {
//                             id: subnet.NACL.NACL_ID,
//                             label: `NACL\n${subnet.NACL.NACL_ID}`,
//                             parent: subnetId,
//                         },
//                         classes: "nacl",
//                     });
//                     elements.push({
//                         data: {
//                             source: subnetId,
//                             target: subnet.NACL.NACL_ID,
//                             label: "Uses NACL",
//                         },
//                     });
//                 }

//                 // Security Groups & EC2
//                 subnet.Security_Groups.forEach((sg:any) => {
//                     elements.push({
//                         data: {
//                             id: sg.SG_ID,
//                             label: `SG\n${sg.SG_ID}`,
//                             parent: subnetId,
//                         },
//                         classes: "sg",
//                     });

//                     sg.EC2_Instances.forEach((ec2:any) => {
//                         elements.push({
//                             data: {
//                                 id: ec2.Instance_ID,
//                                 label: `EC2\n${ec2.Instance_ID}`,
//                                 parent: subnetId,
//                             },
//                             classes: "ec2",
//                         });

//                         elements.push({
//                             data: {
//                                 source: sg.SG_ID,
//                                 target: ec2.Instance_ID,
//                                 label: "Secures",
//                             },
//                         });
//                     });
//                 });
//             });
//         });
//     });

//     return elements;
// };


export const convertCloudJsonToCytoscapeElements = (data: any) => {
    const elements: any[] = [];
    const subnetMap: Map<string, string> = new Map(); // EC2 ID => Subnet ID
    const subnetCidrMap: Map<string, string> = new Map(); // Subnet ID => CIDR

    // First pass: create nodes and collect EC2-subnet and subnet-CIDR mapping
    data.forEach((region: any) => {
        region.VPCs.forEach((vpc: any) => {
            const vpcId = vpc.VPC_ID;

            elements.push({
                data: { id: vpcId, label: `VPC\n${vpcId}` },
                classes: "vpc",
            });

            if (vpc.Internet_Gateway) {
                const igw = vpc.Internet_Gateway;
                elements.push({
                    data: { id: igw.IGW_ID, label: `IGW\n${igw.IGW_ID}` },
                    classes: "igw",
                });
                elements.push({
                    data: {
                        source: igw.Attached_VPC,
                        target: igw.IGW_ID,
                        label: "Attached",
                    },
                });
            }

            vpc.Subnets.forEach((subnet: any) => {
                const subnetId = subnet.Subnet_ID;
                const subnetCIDR = subnet.CIDR;
                subnetCidrMap.set(subnetId, subnetCIDR);

                elements.push({
                    data: {
                        id: subnetId,
                        label: `Subnet\n${subnetId}`,
                        parent: vpcId,
                    },
                    classes: "subnet",
                });

                if (subnet.NACL) {
                    elements.push({
                        data: {
                            id: subnet.NACL.NACL_ID,
                            label: `NACL\n${subnet.NACL.NACL_ID}`,
                            parent: subnetId,
                        },
                        classes: "nacl",
                    });
                    elements.push({
                        data: {
                            source: subnetId,
                            target: subnet.NACL.NACL_ID,
                            label: "Uses NACL",
                        },
                    });
                }

                subnet.Security_Groups.forEach((sg: any) => {
                    elements.push({
                        data: {
                            id: sg.SG_ID,
                            label: `SG\n${sg.SG_ID}`,
                            parent: subnetId,
                        },
                        classes: "sg",
                    });

                    sg.EC2_Instances.forEach((ec2: any) => {
                        const ec2Id = ec2.Instance_ID;
                        subnetMap.set(ec2Id, subnetId); // map ec2 to subnet

                        elements.push({
                            data: {
                                id: ec2Id,
                                label: `EC2\n${ec2Id}`,
                                parent: subnetId,
                            },
                            classes: "ec2",
                        });

                        elements.push({
                            data: {
                                source: sg.SG_ID,
                                target: ec2Id,
                                label: "Secures",
                            },
                        });
                    });
                });
            });
        });
    });

    // Second pass: Analyze SG inbound rules to add inter-subnet connectivity
    data.forEach((region: any) => {
        region.VPCs.forEach((vpc: any) => {
            vpc.Subnets.forEach((subnet: any) => {
                const subnetId = subnet.Subnet_ID;

                subnet.Security_Groups.forEach((sg: any) => {
                    sg.Inbound_Rules?.forEach((rule: any) => {
                        const sourceCidr = rule.Source;

                        // Find target subnet by CIDR match
                        subnetCidrMap.forEach((cidr, otherSubnetId) => {
                            if (
                                cidr === sourceCidr &&
                                otherSubnetId !== subnetId
                            ) {
                                elements.push({
                                    data: {
                                        source: otherSubnetId,
                                        target: subnetId,
                                        label: "Inbound Allowed",
                                    },
                                    classes: "subnet-connection", // <-- use this class
                                });
                            }
                        });
                    });
                });
            });
        });
    });

    return elements;
};


const elements = convertCloudJsonToCytoscapeElements(cloudData);

// const elements = [
//     // VPC
//     {
//         data: { id: "vpc-123abc", label: "VPC\nvpc-123abc" },
//         classes: "vpc",
//     },

//     // Subnet
//     {
//         data: { id: "subnet-aaa111", label: "Subnet\nsubnet-aaa111", parent: "vpc-123abc" },
//         classes: "subnet",
//     },

//     // Security Group inside Subnet
//     {
//         data: { id: "sg-abc123", label: "SG\nsg-abc123", parent: "subnet-aaa111" },
//         classes: "sg",
//     },

//     // EC2 inside Subnet
//     {
//         data: {
//             id: "i-1234567890abcdef",
//             label: "EC2\ni-1234567890abcdef",
//             parent: "subnet-aaa111",
//         },
//         classes: "ec2",
//     },

//     // Internet Gateway (external)
//     {
//         data: { id: "igw-456def", label: "IGW\nigw-456def" },
//         classes: "igw",
//     },

//     // NACL inside Subnet
//     {
//         data: { id: "acl-xyz123", label: "NACL\nacl-xyz123", parent: "subnet-aaa111" },
//         classes: "nacl",
//     },

//     // Edges
//     { data: { source: "vpc-123abc", target: "igw-456def", label: "Attached" } },
//     { data: { source: "sg-abc123", target: "i-1234567890abcdef", label: "Secures" } },
//     { data: { source: "subnet-aaa111", target: "acl-xyz123", label: "Uses NACL" } },
// ];

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
          width: (node) => {
            const labelLength = node.data('label') ? node.data('label').length : 0;
            return Math.max(40, labelLength * 8); // Dynamically set width based on label length (minimum 40px)
          },
          height: (node) => {
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
    { selector: ".vpc", style: { "background-color": "#A0D2FF", "border-color": "#3399FF" } },
    { selector: ".subnet", style: { "background-color": "#D2F0FF", "border-color": "#33CCFF" } },
    { selector: ".sg", style: { "background-color": "#FFD700" } },
    { selector: ".ec2", style: { "background-color": "#FF6347" } },
    { selector: ".igw", style: { "background-color": "#90EE90" } },
    { selector: ".nacl", style: { "background-color": "#9370DB" } },


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

const CytoscapeCloudGraph: React.FC = () => {


    const cyRef = useRef<any>(null);

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
            cyRef.current.zoom(1.3); // Adjust the zoom level (0.8 zooms out)
        }
    }, []);

    return (
        <div style={{ height: "100vh", width: "100%", background: "#1f1f1f" }}>
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
    );
};

export default CytoscapeCloudGraph;