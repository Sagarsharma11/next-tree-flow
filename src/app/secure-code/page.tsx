"use client"
import UploadComponent from '@/components/UploadComponent/UploadComponent'
import DashboardLayout from '@/Layout/Layout'
import React, { useState } from 'react'
import styles from "./style.module.css"
import sampleData from "@/utils/data/secure_code_data1.json"
import SecurityIssuesUI from '@/components/Secure-ui/SecurityIssuesUI'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import ScanZone from '@/components/ScanZone/ScanZone'

const page = () => {
    const [scanFile, setScanFile] = useState(true);
    const [scanComplete, setScanComplete] = useState(true);
    return (
        <DashboardLayout>
            <div className={styles.mainContainer} >
                {
                    scanFile ?
                        <>
                            <ScanZone setScanComplete={setScanComplete} />
                            {scanComplete && <SecurityIssuesUI issuesData={sampleData} />}
                        </>
                        :
                        <>
                            <UploadComponent />
                            <UploadFiles setScanFile={setScanFile} />
                        </>
                }
            </div>
        </DashboardLayout>
    )
}

export default page