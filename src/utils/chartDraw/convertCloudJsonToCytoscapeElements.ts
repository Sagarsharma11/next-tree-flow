export const convertCloudJsonToCytoscapeElements = (data: any) => {
    const elements: any[] = [];
    const subnetMap: Map<string, string> = new Map(); // EC2 ID => Subnet ID
    const subnetCidrMap: Map<string, string> = new Map(); // Subnet ID => CIDR
    const ec2IpToSubnet: Map<string, string> = new Map();

    // First pass: create nodes and collect EC2-subnet and subnet-CIDR mapping
    data.forEach((region: any) => {
        region.VPCs.forEach((vpc: any) => {
            const vpcId = vpc.VPC_ID;

            elements.push({
                data: { id: vpcId, label: `VPC\n${vpcId}` },
                classes: "vpc",
            });


            // console.log("vpc ", vpc)

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

                // console.log("subnet ", JSON.stringify(subnet));

                const subnetId = subnet.Subnet_ID;
                const subnetCIDR = subnet.CIDR;
                const subnetZone = subnet.Availability_Zone;
                subnetCidrMap.set(subnetId, subnetCIDR);

                elements.push({
                    data: {
                        id: subnetId,
                        label: `Subnet\n${subnetId}\n${subnetZone}`,
                        parent: vpcId,
                    },
                    classes: "subnet",
                });

                // if (subnet.NACL) {
                //     elements.push({
                //         data: {
                //             id: subnet.NACL.NACL_ID,
                //             label: `NACL\n${subnet.NACL.NACL_ID}`,
                //             parent: subnetId,
                //         },
                //         classes: "nacl",
                //     });
                //     elements.push({
                //         data: {
                //             source: subnetId,
                //             target: subnet.NACL.NACL_ID,
                //             label: "Uses NACL",
                //         },
                //     });
                // }
                if (subnet.NACL) {
    const naclId = subnet.NACL.NACL_ID;

    // Add NACL node
    elements.push({
        data: {
            id: naclId,
            label: `NACL\n${naclId}`,
            parent: subnetId,
        },
        classes: "nacl",
    });

    // Add edge from Subnet to NACL (optional, existing)
    elements.push({
        data: {
            source: subnetId,
            target: naclId,
            label: "Uses NACL",
        },
    });

    // ➕ Add NACL → SG edges
    if (subnet.Security_Groups && Array.isArray(subnet.Security_Groups)) {
        subnet.Security_Groups.forEach((sg: any) => {
            if (sg.SG_ID) {
                elements.push({
                    data: {
                        source: naclId,
                        target: sg.SG_ID,
                        label: "Controls SG",
                    },
                    classes: "subnet-connection",
                });
            }
        });
    }
}


                subnet.Security_Groups.forEach((sg: any) => {
                    sg.EC2_Instances?.forEach((ec2: any) => {
                        ec2IpToSubnet.set(ec2.Private_IP, subnet.Subnet_ID);
                    });
                });

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
                const destNaclId = subnet.NACL?.NACL_ID;

                subnet.Security_Groups.forEach((sg: any) => {
                    sg.Inbound_Rules?.forEach((rule: any) => {
                        const sourceCidr = rule.Source;

                        // Case 1: Match by CIDR
                        subnetCidrMap.forEach((cidr, sourceSubnetId) => {
                            if (cidr === sourceCidr && sourceSubnetId !== subnetId) {
                                const sourceNaclId = findNaclIdBySubnet(data, sourceSubnetId);

                                // Draw subnet-to-subnet edge
                                // elements.push({
                                //     data: {
                                //         source: sourceSubnetId,
                                //         target: subnetId,
                                //         label: "Inbound Allowed (CIDR)",
                                //     },
                                //     classes: "subnet-connection",
                                // });

                                // Draw NACL-to-NACL edge
                                if (sourceNaclId && destNaclId) {
                                    elements.push({
                                        data: {
                                            source: sourceNaclId,
                                            target: destNaclId,
                                            label: "NACL Traffic",
                                        },
                                        classes: "nacl-connection",
                                    });
                                }
                            }
                        });

                        // Case 2: Match by EC2 IP
                        const sourceSubnetId = ec2IpToSubnet.get(sourceCidr);
                        if (sourceSubnetId && sourceSubnetId !== subnetId) {
                            const sourceNaclId = findNaclIdBySubnet(data, sourceSubnetId);

                            // elements.push({
                            //     data: {
                            //         source: sourceSubnetId,
                            //         target: subnetId,
                            //         label: "Inbound Allowed (IP)",
                            //     },
                            //     classes: "subnet-connection",
                            // });

                            if (sourceNaclId && destNaclId) {
                                elements.push({
                                    data: {
                                        source: sourceNaclId,
                                        target: destNaclId,
                                        label: "NACL Traffic",
                                    },
                                    classes: "nacl-connection",
                                });
                            }
                        }
                    });
                });
            });
        });
    });

    return elements;
};

// Utility to find NACL ID by subnet ID
function findNaclIdBySubnet(data: any, subnetId: string): string | null {
    for (const region of data) {
        for (const vpc of region.VPCs) {
            for (const subnet of vpc.Subnets) {
                if (subnet.Subnet_ID === subnetId) {
                    return subnet.NACL?.NACL_ID || null;
                }
            }
        }
    }
    return null;
}