export const parseAwsTopology = (awsData) => {
    let nodes = [];
    let edges = [];

    awsData.forEach(region => {
        region.VPCs.forEach(vpc => {
            const vpcId = vpc.VPC_ID;

            // Add VPC Node
            nodes.push({
                id: vpcId,
                data: { label: `VPC: ${vpcId}` },
                position: { x: 100, y: 100 },
                style: { width: 400, height: 250, background: "#222", color: "white", border: "2px solid white" }
            });

            // Add Internet Gateway Node
            if (vpc.Internet_Gateway) {
                const igwId = vpc.Internet_Gateway.IGW_ID;
                nodes.push({
                    id: igwId,
                    data: { label: `IGW: ${igwId}` },
                    position: { x: 600, y: 100 },
                    style: { width: 150, height: 100, background: "#0066ff", color: "white", borderRadius: "10px" }
                });

                edges.push({
                    id: `edge-${vpcId}-${igwId}`,
                    source: vpcId,
                    target: igwId,
                    animated: true,
                    style: { stroke: "red" }
                });
            }

            // Add Subnets
            vpc.Subnets.forEach((subnet, index) => {
                const subnetId = subnet.Subnet_ID;
                const subnetPosY = 200 + index * 200; // Positioning dynamically

                nodes.push({
                    id: subnetId,
                    data: { label: `Subnet: ${subnetId}` },
                    position: { x: 200, y: subnetPosY },
                    style: { width: 300, height: 150, background: "#008000", color: "white", borderRadius: "10px" }
                });

                // Connect Subnet to VPC
                edges.push({
                    id: `edge-${vpcId}-${subnetId}`,
                    source: vpcId,
                    target: subnetId,
                    animated: true,
                    style: { stroke: "white" }
                });

                // Add Security Groups
                subnet.Security_Groups.forEach((sg, sgIndex) => {
                    const sgId = sg.SG_ID;
                    const sgPosY = subnetPosY + 150 + sgIndex * 100;

                    nodes.push({
                        id: sgId,
                        data: { label: `SG: ${sgId}` },
                        position: { x: 300, y: sgPosY },
                        style: { width: 150, height: 80, background: "#ff9900", color: "black", borderRadius: "5px" }
                    });

                    edges.push({
                        id: `edge-${subnetId}-${sgId}`,
                        source: subnetId,
                        target: sgId,
                        animated: true,
                        style: { stroke: "yellow" }
                    });

                    // Add EC2 Instances
                    sg.EC2_Instances.forEach((ec2, ec2Index) => {
                        const ec2Id = ec2.Instance_ID;
                        const ec2PosY = sgPosY + 100 + ec2Index * 100;

                        nodes.push({
                            id: ec2Id,
                            data: { label: `EC2: ${ec2Id}` },
                            position: { x: 400, y: ec2PosY },
                            style: { width: 100, height: 100, background: "#ff0000", color: "white", borderRadius: "50%" }
                        });

                        edges.push({
                            id: `edge-${sgId}-${ec2Id}`,
                            source: sgId,
                            target: ec2Id,
                            animated: true,
                            style: { stroke: "blue" }
                        });
                    });
                });
            });
        });
    });

    return { nodes, edges };
};