"use client"
import ReactFlowComponent from '@/components/Charts/ReactFlow/ReactFlow'
import Chart2 from '@/components/Charts/TreeChart/Chart2'
import TreeChart from '@/components/Charts/TreeChart/TreeChart'
import DashboardLayout from '@/Layout/Layout'
import React from 'react';
import awsData from "@/utils/data/data.json"
import DynamicReactFlow from '@/components/Charts/ReactFlow/DynamicReactFlow'
import CytoscapeCloudGraph from '@/components/Charts/Cytoscape/Cytoscape'
import Learn from '@/components/Charts/Cytoscape/Learn'

type Props = {}

const page = (props: Props) => {
    // const data = {
    //     name:"AWS Instances",
    //     children:[
    //         {
    //             name:"Instance i-06e1e6a037d6c29a1",
    //             children:[
    //                 {
    //                     name:"VPC vpc-0bdddc15bb69344f05",
    //                     children:[
    //                         {
    //                             name:"Security Groups",
    //                             children:[
    //                                 {name: "Group ID: sg-093a5be5be5b919bb9f3"},
    //                                 {name: "Group Name: launch-wizard-1"}
    //                             ]
    //                         },
    //                         {
    //                             name:"IAM Roles",
    //                             children:[
    //                                 {
    //                                     name: "Role: role-abc",
    //                                     children:[
    //                                        { 
    //                                         name:"Policy: abc",
    //                                         children:[
    //                                             {
    //                                                 name:"Policy ARN: arn:aws:iam::028659955548:policy/abc"
    //                                             },
    //                                             {
    //                                                 name:"Policy Document",
    //                                                 children:[
    //                                                     {name: "Version 2021-10-17"},
    //                                                     {
    //                                                         name:"Statement",
    //                                                         children:[
    //                                                             {name:"Effect: Allow"},
    //                                                             {name:"Action s3: *"},
    //                                                             {name: "Resource: *"}
    //                                                         ]
    //                                                     }
    //                                                 ]
    //                                             }
    //                                         ]
    //                                        }

    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }
    // const data = {
    //     name: "AWS Infrastructure",
    //     children: [
    //         {
    //             name: "Region: us-east-1",
    //             children: [
    //                 {
    //                     name: "VPC vpc-123abc",
    //                     children: [
    //                         {
    //                             name: "CIDR: 10.0.0.0/16"
    //                         },
    //                         {
    //                             name: "Internet Gateway",
    //                             children: [
    //                                 {
    //                                     name: "IGW ID: igw-456def",
    //                                     children: [
    //                                         { name: "Attached VPC: vpc-123abc" },
    //                                         {
    //                                             name: "Routes",
    //                                             children: [
    //                                                 {
    //                                                     name: "Destination: 0.0.0.0/0",
    //                                                     children: [
    //                                                         { name: "Target: igw-456def" },
    //                                                         { name: "Description: Route to the Internet" }
    //                                                     ]
    //                                                 }
    //                                             ]
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             name: "Subnets",
    //                             children: [
    //                                 {
    //                                     name: "Subnet subnet-aaa111",
    //                                     children: [
    //                                         { name: "CIDR: 10.0.1.0/24" },
    //                                         { name: "Availability Zone: us-east-1a" },
    //                                         {
    //                                             name: "Network ACL",
    //                                             children: [
    //                                                 {
    //                                                     name: "NACL ID: acl-xyz123",
    //                                                     children: [
    //                                                         {
    //                                                             name: "Inbound Rules",
    //                                                             children: [
    //                                                                 {
    //                                                                     name: "Rule 100",
    //                                                                     children: [
    //                                                                         { name: "Protocol: TCP" },
    //                                                                         { name: "Port: 80" },
    //                                                                         { name: "Source: 0.0.0.0/0" },
    //                                                                         { name: "Action: ALLOW" }
    //                                                                     ]
    //                                                                 },
    //                                                                 {
    //                                                                     name: "Rule 200",
    //                                                                     children: [
    //                                                                         { name: "Protocol: TCP" },
    //                                                                         { name: "Port: 22" },
    //                                                                         { name: "Source: 203.0.113.0/24" },
    //                                                                         { name: "Action: ALLOW" }
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         },
    //                                                         {
    //                                                             name: "Outbound Rules",
    //                                                             children: [
    //                                                                 {
    //                                                                     name: "Rule 100",
    //                                                                     children: [
    //                                                                         { name: "Protocol: ALL" },
    //                                                                         { name: "Port: ALL" },
    //                                                                         { name: "Destination: 0.0.0.0/0" },
    //                                                                         { name: "Action: ALLOW" }
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         }
    //                                                     ]
    //                                                 }
    //                                             ]
    //                                         },
    //                                         {
    //                                             name: "Security Groups",
    //                                             children: [
    //                                                 {
    //                                                     name: "Group ID: sg-abc123",
    //                                                     children: [
    //                                                         { name: "Description: Allow HTTP & SSH" },
    //                                                         {
    //                                                             name: "Inbound Rules",
    //                                                             children: [
    //                                                                 {
    //                                                                     name: "Rule",
    //                                                                     children: [
    //                                                                         { name: "Protocol: TCP" },
    //                                                                         { name: "Port: 80" },
    //                                                                         { name: "Source: 0.0.0.0/0" }
    //                                                                     ]
    //                                                                 },
    //                                                                 {
    //                                                                     name: "Rule",
    //                                                                     children: [
    //                                                                         { name: "Protocol: TCP" },
    //                                                                         { name: "Port: 22" },
    //                                                                         { name: "Source: 203.0.113.0/24" }
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         },
    //                                                         {
    //                                                             name: "Outbound Rules",
    //                                                             children: [
    //                                                                 {
    //                                                                     name: "Rule",
    //                                                                     children: [
    //                                                                         { name: "Protocol: ALL" },
    //                                                                         { name: "Port: ALL" },
    //                                                                         { name: "Destination: 0.0.0.0/0" }
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         },
    //                                                         {
    //                                                             name: "EC2 Instances",
    //                                                             children: [
    //                                                                 {
    //                                                                     name: "Instance i-1234567890abcdef",
    //                                                                     children: [
    //                                                                         { name: "Instance Type: t2.micro" },
    //                                                                         { name: "Private IP: 10.0.1.100" },
    //                                                                         {
    //                                                                             name: "Security Groups",
    //                                                                             children: [
    //                                                                                 { name: "sg-abc123" }
    //                                                                             ]
    //                                                                         },
    //                                                                         {
    //                                                                             name: "IAM Role",
    //                                                                             children: [
    //                                                                                 { name: "Role: EC2ReadOnlyRole" }
    //                                                                             ]
    //                                                                         }
    //                                                                     ]
    //                                                                 }
    //                                                             ]
    //                                                         }
    //                                                     ]
    //                                                 }
    //                                             ]
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // };
    
    // console.log(data);
    
    
  return (
    <DashboardLayout>
        {/*<TreeChart data={data} />*/}
        {/* <Chart2 /> */}
        {/* <ReactFlowComponent /> */}
        {/* <DynamicReactFlow awsData={awsData} /> */}
        {/* <CytoscapeCloudGraph /> */}
        <Learn />
    </DashboardLayout>
  )
}

export default page