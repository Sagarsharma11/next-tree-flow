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

    if (!targetCidrOrIp || !ruleCidrOrIp) return false;

    // ✅ 1. Universal allow case
    if (ruleCidrOrIp === '0.0.0.0/0') return true;

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