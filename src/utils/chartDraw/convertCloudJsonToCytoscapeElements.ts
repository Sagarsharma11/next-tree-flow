// export const convertCloudJsonToCytoscapeElements = (data: any) => {
//     const elements: any[] = [];
//     const subnetMap: Map<string, string> = new Map(); // EC2 ID => Subnet ID
//     const subnetCidrMap: Map<string, string> = new Map(); // Subnet ID => CIDR
//     const ec2IpToSubnet: Map<string, string> = new Map();

//     // First pass: create nodes and collect EC2-subnet and subnet-CIDR mapping
//     data.forEach((region: any) => {
//         region.VPCs.forEach((vpc: any) => {
//             const vpcId = vpc.VPC_ID;

//             elements.push({
//                 data: { id: vpcId, label: `VPC\n${vpcId}` },
//                 classes: "vpc",
//             });

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

//             vpc.Subnets.forEach((subnet: any) => {

//                 // console.log("subnet ", JSON.stringify(subnet));

//                 const subnetId = subnet.Subnet_ID;
//                 const subnetCIDR = subnet.CIDR;
//                 const subnetZone = subnet.Availability_Zone;
//                 subnetCidrMap.set(subnetId, subnetCIDR);

//                 elements.push({
//                     data: {
//                         id: subnetId,
//                         label: `Subnet\n${subnetId}\n${subnetZone}`,
//                         parent: vpcId,
//                     },
//                     classes: "subnet",
//                 });

//                 if (subnet.NACL) {
//                     const naclId = subnet.NACL.NACL_ID;

//                     // Add NACL node
//                     elements.push({
//                         data: {
//                             id: naclId,
//                             label: `NACL\n${naclId}`,
//                             parent: subnetId,
//                         },
//                         classes: "nacl",
//                     });

//                     // Add edge from Subnet to NACL (optional, existing)
//                     elements.push({
//                         data: {
//                             source: subnetId,
//                             target: naclId,
//                             label: "Uses NACL",
//                         },
//                     });

//                     // ➕ Add NACL → SG edges
//                     if (subnet.Security_Groups && Array.isArray(subnet.Security_Groups)) {
//                         subnet.Security_Groups.forEach((sg: any) => {
//                             if (sg.SG_ID) {
//                                 elements.push({
//                                     data: {
//                                         source: naclId,
//                                         target: sg.SG_ID,
//                                         label: "Controls SG",
//                                     },
//                                     classes: "subnet-connection",
//                                 });
//                             }
//                         });
//                     }
//                 }


//                 subnet.Security_Groups.forEach((sg: any) => {
//                     sg.EC2_Instances?.forEach((ec2: any) => {
//                         ec2IpToSubnet.set(ec2.Private_IP, subnet.Subnet_ID);
//                     });
//                 });

//                 subnet.Security_Groups.forEach((sg: any) => {
//                     elements.push({
//                         data: {
//                             id: sg.SG_ID,
//                             label: `SG\n${sg.SG_ID}`,
//                             parent: subnetId,
//                         },
//                         classes: "sg",
//                     });

//                     sg.EC2_Instances.forEach((ec2: any) => {
//                         const ec2Id = ec2.Instance_ID;
//                         subnetMap.set(ec2Id, subnetId); // map ec2 to subnet

//                         elements.push({
//                             data: {
//                                 id: ec2Id,
//                                 label: `EC2\n${ec2Id}`,
//                                 parent: subnetId,
//                             },
//                             classes: "ec2",
//                         });

//                         elements.push({
//                             data: {
//                                 source: sg.SG_ID,
//                                 target: ec2Id,
//                                 label: "Secures",
//                             },
//                         });
//                     });
//                 });
//             });
//         });
//     });

//     // Second pass: Analyze SG inbound rules to add inter-subnet connectivity
//     data.forEach((region: any) => {
//         region.VPCs.forEach((vpc: any) => {
//             vpc.Subnets.forEach((subnet: any) => {
//                 const subnetId = subnet.Subnet_ID;
//                 const destNaclId = subnet.NACL?.NACL_ID;

//                 subnet.Security_Groups.forEach((sg: any) => {
//                     sg.Inbound_Rules?.forEach((rule: any) => {
//                         const sourceCidr = rule.Source;

//                         // Case 1: Match by CIDR
//                         subnetCidrMap.forEach((cidr, sourceSubnetId) => {
//                             if (cidr === sourceCidr && sourceSubnetId !== subnetId) {
//                                 const sourceNaclId = findNaclIdBySubnet(data, sourceSubnetId);

//                                 // Draw subnet-to-subnet edge
//                                 // elements.push({
//                                 //     data: {
//                                 //         source: sourceSubnetId,
//                                 //         target: subnetId,
//                                 //         label: "Inbound Allowed (CIDR)",
//                                 //     },
//                                 //     classes: "subnet-connection",
//                                 // });

//                                 // Draw NACL-to-NACL edge
//                                 if (sourceNaclId && destNaclId) {
//                                     elements.push({
//                                         data: {
//                                             source: sourceNaclId,
//                                             target: destNaclId,
//                                             label: "NACL Traffic",
//                                         },
//                                         classes: "nacl-connection",
//                                     });
//                                 }
//                             }
//                         });

//                         // Case 2: Match by EC2 IP
//                         const sourceSubnetId = ec2IpToSubnet.get(sourceCidr);
//                         if (sourceSubnetId && sourceSubnetId !== subnetId) {
//                             const sourceNaclId = findNaclIdBySubnet(data, sourceSubnetId);

//                             // elements.push({
//                             //     data: {
//                             //         source: sourceSubnetId,
//                             //         target: subnetId,
//                             //         label: "Inbound Allowed (IP)",
//                             //     },
//                             //     classes: "subnet-connection",
//                             // });

//                             if (sourceNaclId && destNaclId) {
//                                 elements.push({
//                                     data: {
//                                         source: sourceNaclId,
//                                         target: destNaclId,
//                                         label: "NACL Traffic",
//                                     },
//                                     classes: "nacl-connection",
//                                 });
//                             }
//                         }
//                     });
//                 });
//             });
//         });
//     });

//     return elements;
// };

// // Utility to find NACL ID by subnet ID
// function findNaclIdBySubnet(data: any, subnetId: string): string | null {
//     for (const region of data) {
//         for (const vpc of region.VPCs) {
//             for (const subnet of vpc.Subnets) {
//                 if (subnet.Subnet_ID === subnetId) {
//                     return subnet.NACL?.NACL_ID || null;
//                 }
//             }
//         }
//     }
//     return null;
// }


export const convertCloudJsonToCytoscapeElements2 = (data: any) => {
    const elements: any[] = [];
    const subnetsArray = []


    data.forEach((region: any) => {
        const regionName = region.Region
        region.VPCs.forEach((vpc: any) => {
            const vpcId = vpc.VPC_ID;

            // added vpc node
            elements.push({
                data: { id: vpcId, label: `VPC\n${vpcId} \n ${regionName}` },
                classes: "vpc",
            });

            if (vpc.Internet_Gateway) {
                const igw = vpc.Internet_Gateway;
                elements.push({
                    data: { id: igw.IGW_ID, label: `IGW\n${igw.IGW_ID} ` },
                    classes: "igw",
                });
                // connect VPC to its internet gateway
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
                subnetsArray.push(subnet)
                // added subnet node 
                elements.push({
                    data: {
                        id: subnetId,
                        label: `Subnet\n${subnetId}\n`,
                        parent: vpcId,
                    },
                    classes: "subnet",
                });

                const naclId = subnet.NACL.NACL_ID;
                if (subnet.NACL) {
                    // Add NACL node
                    elements.push({
                        data: {
                            id: naclId,
                            label: `NACL\n${naclId}`,
                            parent: subnetId,
                        },
                        classes: "nacl",
                    });
                }

                subnet.Security_Groups.forEach((sg: any) => {
                    const sg_id = sg.SG_ID
                    elements.push({
                        data: {
                            id: sg_id,
                            label: `Security Group \n ${sg_id}`,
                            parent: subnetId
                        },
                        classes: "sg"
                    })
                    Object.entries(sg).forEach(([key, value]: [string, any]) => {
                        if (key === "Inbound_Rules" || key === "Outbound_Rules") return;
                        if (Array.isArray(value)) {
                            value.forEach((resource: any, index: number) => {
                                let resourceType = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // e.g., EC2_Instances -> EC2 Instances
                                let id = resource.Instance_ID || resource.Bucket_Name || `resource-${sg_id}-${key}-${index}`;

                                elements.push({
                                    data: {
                                        id: id,
                                        label: `${resourceType}\n${id}`,
                                        parent: sg_id,
                                    },
                                    classes: "aws-resource",
                                });
                            });
                        }
                    });



                    elements.push({
                        data: {
                            source: naclId,
                            target: sg_id,
                            label: "Attached",
                        },
                    });
                });


            });

            const subnetAllowObjects = analyzeAllSubnets(subnetsArray)?.filter((item) => item.allowed === true)
            console.log("Subnet allow object ", JSON.stringify(analyzeAllSubnets(subnetsArray)))
            console.log(subnetAllowObjects)
            // const addedConnections = new Set();

            const addedConnections = new Set();

            subnetAllowObjects.forEach((element) => {
                const subnetA = subnetsArray.find((item) => item.Subnet_ID === element.from);
                const subnetB = subnetsArray.find((item) => item.Subnet_ID === element.to);

                if (!subnetA || !subnetB) return;

                if (element.bidirectional) {
                    const key = [subnetA.Subnet_ID, subnetB.Subnet_ID].sort().join("-");
                    if (!addedConnections.has(key)) {
                        elements.push({
                            data: {
                                source: subnetA.NACL.NACL_ID,
                                target: subnetB.NACL.NACL_ID,
                                label: "Attached-subnets",
                            },
                        });

                        elements.push({
                            data: {
                                source: subnetB.NACL.NACL_ID,
                                target: subnetA.NACL.NACL_ID,
                                label: "Attached-subnets",
                            },
                        });

                        addedConnections.add(key);
                    }
                } else if (element.allowed) {
                    const key = `${subnetA.Subnet_ID}->${subnetB.Subnet_ID}`;
                    if (!addedConnections.has(key)) {
                        elements.push({
                            data: {
                                source: subnetA.NACL.NACL_ID,
                                target: subnetB.NACL.NACL_ID,
                                label: "Attached-subnets",
                            },
                        });

                        addedConnections.add(key);
                    }
                }
            });


            // subnetAllowObjects.forEach(element => {
            //     const subnetA = subnetsArray.find((item) => item.Subnet_ID === element.from);
            //     const subnetB = subnetsArray.find((item) => item.Subnet_ID === element.to);
            //     const data = checkSGConnectivityBetweenResources([subnetA["Security_Groups"], subnetB["Security_Groups"]], subnetsArray)
            //     // console.log(JSON.stringify(subnetA),"\n\n\n\n\n\n", JSON.stringify(subnetB))
            //     // console.log("-------> ", data)
            //     data.forEach((ele)=>{
            //         // console.log(ele.direction)
            //         if(ele?.direction?.toLowerCase() === "bidirectional"){
            //             elements.push({
            //                 data: {
            //                     source: subnetA.NACL.NACL_ID,
            //                     target: subnetB.NACL.NACL_ID,
            //                     label: "Attached-subnets",
            //                 },
            //             });


            //             elements.push({
            //                 data: {
            //                     source: subnetB.NACL.NACL_ID,
            //                     target: subnetA.NACL.NACL_ID,
            //                     label: "Attached-subnets",
            //                 },
            //             });
            //         }
            //     })

            // });
            // console.log(subnetAllowObjects, subnetsArray);


        });
    });

    // console.log(elements)
    return elements;
};


import ip from 'ip';
import ipaddr from 'ipaddr.js';

// Check if target CIDR/IP is contained in rule's CIDR/IP
// function isAllowedByRule(targetCidrOrIp, ruleCidrOrIp) {
//     console.log("==> ",targetCidrOrIp, ruleCidrOrIp)
//     console.log("--> ", ip.cidrSubnet(ruleCidrOrIp).contains(ip.cidrSubnet(targetCidrOrIp).networkAddress))
//     if (ruleCidrOrIp.includes('/')) {
//         return ip.cidrSubnet(ruleCidrOrIp).contains(ip.cidrSubnet(targetCidrOrIp).networkAddress);
//     } else {
//         return targetCidrOrIp === ruleCidrOrIp;
//     }
// }
function isAllowedByRule(targetCidrOrIp, ruleCidrOrIp) {
    // If they are exactly equal strings
    if (targetCidrOrIp === ruleCidrOrIp) {
        return true;
    }

    try {
        // Check if rule is CIDR and target is IP inside that CIDR
        if (ipaddr.isValid(targetCidrOrIp) && ipaddr.parseCIDR(ruleCidrOrIp)) {
            const ip = ipaddr.parse(targetCidrOrIp);
            const [subnet, prefixLength] = ipaddr.parseCIDR(ruleCidrOrIp);
            return ip.match(subnet, prefixLength);
        }

        // Check if target is CIDR and rule is IP inside that CIDR (reverse)
        if (ipaddr.parseCIDR(targetCidrOrIp) && ipaddr.isValid(ruleCidrOrIp)) {
            const [subnet, prefixLength] = ipaddr.parseCIDR(targetCidrOrIp);
            const ip = ipaddr.parse(ruleCidrOrIp);
            return ip.match(subnet, prefixLength);
        }

    } catch (e) {
        // Parsing failed, return false
        return false;
    }

    return false;
}

// {
//     console.log(targetCidrOrIp, ruleCidrOrIp)
//     if (ruleCidrOrIp.includes('/')) {
//         const subnet = ip.cidrSubnet(ruleCidrOrIp);
//         const targetIp = targetCidrOrIp.includes('/')
//             ? ip.cidrSubnet(targetCidrOrIp).networkAddress
//             : targetCidrOrIp;

//         // console.log("--> ", subnet.contains(targetIp));
//         return subnet.contains(targetIp);
//     } else {
//         return targetCidrOrIp === ruleCidrOrIp;
//     }
// }

function isCommunicationAllowedDynamic(outboundRules, inboundRules, sourceCidrOrIp, destCidrOrIp) {

    // console.log(outboundRules, inboundRules, sourceCidrOrIp, destCidrOrIp)
    // const outboundAllowed = outboundRules.some(rule =>
    //     rule.Action === 'ALLOW' && isAllowedByRule(destCidrOrIp, rule.Destination || rule.Source)
    // );

    // const inboundAllowed = inboundRules.some(rule =>
    //     rule.Action === 'ALLOW' && isAllowedByRule(sourceCidrOrIp, rule.Source || rule.Destination)
    // );
    // return outboundAllowed && inboundAllowed;
    const outboundAllowed = outboundRules.some(rule =>
        rule.Action === 'ALLOW' && rule.Destination && isAllowedByRule(destCidrOrIp, rule.Destination)
    );

    const inboundAllowed = inboundRules.some(rule =>
        rule.Action === 'ALLOW' && rule.Source && isAllowedByRule(sourceCidrOrIp, rule.Source)
    );

    return outboundAllowed && inboundAllowed;
}


// Combine rules from multiple security groups
function getCombinedRules(securityGroups, ruleType) {
    // console.log(securityGroups, ruleType)
    // console.log(securityGroups.flatMap(sg => sg[ruleType] || []))
    return securityGroups.flatMap(sg => sg[ruleType] || []);
}

// Main function to analyze all subnets
export function analyzeAllSubnets(subnets) {
    // const results = [];
    // // console.log("subnets => ", subnets);

    // for (let i = 0; i < subnets.length; i++) {
    //     for (let j = 0; j < subnets.length; j++) {
    //         if (i === j) continue;

    //         const subnetA = subnets[i];
    //         const subnetB = subnets[j];


    //         // Check NACL rules
    //         const naclAllowed = isCommunicationAllowedDynamic(
    //             subnetA.NACL.Outbound_Rules,
    //             subnetB.NACL.Inbound_Rules,
    //             subnetA.CIDR,
    //             subnetB.CIDR
    //         );

    //         // console.log("NACL allowed ", subnetA, subnetB, naclAllowed)
    //         // Check SG rules
    //         // const sgAllowed = isCommunicationAllowedDynamic(
    //         //     getCombinedRules(subnetA.Security_Groups, 'Outbound_Rules'),
    //         //     getCombinedRules(subnetB.Security_Groups, 'Inbound_Rules'),
    //         //     subnetA.CIDR,
    //         //     subnetB.CIDR
    //         // );

    //         // console.log("sgAllowed ", sgAllowed)

    //         // const allowed = naclAllowed //&& sgAllowed;

    //         results.push({
    //             from: subnetA.Subnet_ID,
    //             to: subnetB.Subnet_ID,
    //             // allowed,
    //             allowed: naclAllowed
    //         });
    //     }
    // }

    // return results;

    const results = [];

    for (let i = 0; i < subnets.length; i++) {
        for (let j = 0; j < subnets.length; j++) {
            if (i === j) continue;

            const subnetA = subnets[i];
            const subnetB = subnets[j];

            const naclAllowed = isCommunicationAllowedDynamic(
                subnetA.NACL.Outbound_Rules,
                subnetB.NACL.Inbound_Rules,
                subnetA.CIDR,
                subnetB.CIDR
            );

            const naclReverseAllowed = isCommunicationAllowedDynamic(
                subnetB.NACL.Outbound_Rules,
                subnetA.NACL.Inbound_Rules,
                subnetB.CIDR,
                subnetA.CIDR
            );

            results.push({
                from: subnetA.Subnet_ID,
                to: subnetB.Subnet_ID,
                allowed: naclAllowed,
                reverseAllowed: naclReverseAllowed,
                bidirectional: naclAllowed && naclReverseAllowed
            });

        }
    }
    return results

}

export function checkSGConnectivityBetweenResources(sgList, subnetsArray) {
    const resources = [];

    // console.log(sgList.flat()) 

    for (const sg of sgList.flat()) {
        // console.log(sg, sg[0].EC2_Instances, sgList)
        const instances = [
            ...(sg.EC2_Instances || []),
            ...(sg.RDS_Instances || []),
            ...(sg.S3_Buckets || []),
        ];

        for (const instance of instances) {
            resources.push({ ip: instance.Private_IP, sg });
        }
    }
    // console.log("]]]]]]",resources)
    const connections: {
        from: string; to: string; direction: string, fromSgId: string
        toSgId: string
    }[] = [];

    for (let i = 0; i < resources.length; i++) {
        for (let j = 0; j < resources.length; j++) {
            if (i === j) continue;

            const source = resources[i];
            const target = resources[j];

            // console.log(source, target)

            const isAllowed = isCommunicationAllowedDynamic(
                source.sg.Outbound_Rules,
                target.sg.Inbound_Rules,
                source.ip,
                target.ip
            );

            if (isAllowed) {
                connections.push({
                    from: source.ip,
                    fromSgId: source.sg.SG_ID,
                    to: target.ip,
                    toSgId: target.sg.SG_ID,
                    direction: 'one-way',
                });
            }
        }
    }

    // Mark bidirectional connections
    const bidirectional: { from: string; to: string; direction: string }[] = [];
    const visited = new Set();

    for (const conn of connections) {
        const reverseKey = `${conn.to}->${conn.from}`;
        const key = `${conn.from}->${conn.to}`;
        if (visited.has(reverseKey)) {
            bidirectional.push({
                from: conn.from,
                to: conn.to,
                direction: 'bidirectional',
            });
        } else {
            visited.add(key);
        }
    }

    return [...bidirectional];
}