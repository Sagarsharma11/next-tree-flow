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