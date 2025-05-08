import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const awsData = [
  {
    Region: "us-east-1",
    VPCs: [
      {
        VPC_ID: "vpc-123abc",
        CIDR: "10.0.0.0/16",
        Internet_Gateway: {
          IGW_ID: "igw-456def",
          Attached_VPC: "vpc-123abc",
          Routes: [
            {
              Destination: "0.0.0.0/0",
              Target: "igw-456def",
              Description: "Route to the Internet",
            },
          ],
        },
        Subnets: [
          {
            Subnet_ID: "subnet-aaa111",
            CIDR: "10.0.1.0/24",
            Availability_Zone: "us-east-1a",
            NACL: {
              NACL_ID: "acl-xyz123",
            },
            Security_Groups: [
              {
                SG_ID: "sg-abc123",
                Description: "Allow HTTP & SSH",
                EC2_Instances: [
                  {
                    Instance_ID: "i-1234567890abcdef",
                    Instance_Type: "t2.micro",
                    Private_IP: "10.0.1.100",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const createNodesAndEdges = () => {
  const nodes = [];
  const edges = [];

  // Extract VPC details
  awsData[0].VPCs.forEach((vpc, vpcIndex) => {
    const vpcId = `vpc-${vpcIndex}`;
    nodes.push({
      id: vpcId,
      position: { x: 250, y: 50 },
      data: { label: `VPC: ${vpc.VPC_ID} (${vpc.CIDR})` },
      type: "input",
    });

    // Add Internet Gateway
    if (vpc.Internet_Gateway) {
      const igwId = `igw-${vpcIndex}`;
      nodes.push({
        id: igwId,
        position: { x: 500, y: 50 },
        data: { label: `IGW: ${vpc.Internet_Gateway.IGW_ID}` },
      });
      edges.push({ id: `edge-${vpcId}-${igwId}`, source: vpcId, target: igwId, animated: true, label: "Internet Access" });
    }

    // Add Subnets
    vpc.Subnets.forEach((subnet, subnetIndex) => {
      const subnetId = `subnet-${subnetIndex}`;
      nodes.push({
        id: subnetId,
        position: { x: 250, y: 150 + subnetIndex * 100 },
        data: { label: `Subnet: ${subnet.Subnet_ID} (${subnet.CIDR})` },
      });
      edges.push({ id: `edge-${vpcId}-${subnetId}`, source: vpcId, target: subnetId, animated: true });

      // Add Security Groups and EC2 Instances
      subnet.Security_Groups.forEach((sg, sgIndex) => {
        const sgId = `sg-${sgIndex}`;
        nodes.push({
          id: sgId,
          position: { x: 150, y: 250 + sgIndex * 100 },
          data: { label: `SG: ${sg.SG_ID}` },
        });
        edges.push({ id: `edge-${subnetId}-${sgId}`, source: subnetId, target: sgId, animated: true });

        // Add EC2 Instances
        sg.EC2_Instances.forEach((ec2, ec2Index) => {
          const ec2Id = `ec2-${ec2Index}`;
          nodes.push({
            id: ec2Id,
            position: { x: 50, y: 300 + ec2Index * 100 },
            data: { label: `EC2: ${ec2.Instance_ID} (${ec2.Private_IP})` },
          });
          edges.push({ id: `edge-${sgId}-${ec2Id}`, source: sgId, target: ec2Id, animated: true });
        });
      });
    });
  });

  return { nodes, edges };
};

const AwsDiagram = () => {
  const { nodes, edges } = createNodesAndEdges();

  return (
    <div style={{ width: "100%", height: "600px", background: "#111", padding: "10px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AwsDiagram;
