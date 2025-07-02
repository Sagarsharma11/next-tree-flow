"use client"
import UploadComponent from '@/components/UploadComponent/UploadComponent'
import DashboardLayout from '@/Layout/Layout'
import React from 'react'
import styles from "./style.module.css"
import sampleData from "@/utils/data/secure_code_data1.json"
import SecurityIssuesUI from '@/components/Secure-ui/SecurityIssuesUI'

const page = () => {
    return (
        <DashboardLayout>
            <div className={styles.mainContainer} >
                <UploadComponent />
                <SecurityIssuesUI issuesData={sampleData} />
            </div>
        </DashboardLayout>
    )
}

export default page