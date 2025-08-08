"use client"
import UploadComponent from '@/components/UploadComponent/UploadComponent'
import DashboardLayout from '@/Layout/Layout'
import React, { useEffect, useState } from 'react'
import styles from "./style.module.css"
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import ScanZone from '@/components/ScanZone/ScanZone'

import dynamic from 'next/dynamic';
import Auth from '@/utils/AuthHOC/Auth'
import PaiCharts from '@/components/Charts/PaiCharts/PaiCharts'


const SecurityIssuesUI = dynamic(
    () => import('@/components/Secure-ui/SecurityIssuesUI'),
    { ssr: false }
);

// import sampleData from "@/utils/data/secure_code_data1.json"
// import data from "../../utils/data/secure_code_data1.json"
import SecurityAuditTable from '@/components/Table/SecurityAuditTable'
import { formatSecurityData } from '@/utils/formatSecurityData'

const SecureCode = () => {
    const [scanFile, setScanFile] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [scanFileName, setScanFileName] = useState("");
    const [issues, setIssues] = useState([]);
    const [data, setData] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const formattedData = formatSecurityData(data) || [];

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) return;

        const allIssues = [];

        Object.values(data).forEach(file => {
            const chunks = Array.isArray(file?.chunks) ? file.chunks : [];

            chunks.forEach(chunk => {
                const issues = Array.isArray(chunk?.ai_issues) ? chunk.ai_issues : [];

                issues.forEach(issue => {
                    allIssues.push({ severity: issue.severity?.toLowerCase() });
                });
            });
        });

        setIssues(allIssues);
    }, [data]);

    console.log("issues => ", issues)

    return (
        <DashboardLayout>
            <div className={styles.mainContainer} >
                {
                    scanFile ?
                        <>
                            <ScanZone setData={setData} scanFile={scanFile} scanFileName={scanFileName} setScanComplete={setScanComplete}
                                scanReport={data}
                            />
                            {scanComplete &&
                                <div className='flex flex-col justify-start'>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                        🔍 Security Audit Report
                                    </h2>
                                    <PaiCharts issues={issues} />
                                    <SecurityAuditTable issues={formattedData} />
                                    <SecurityIssuesUI
                                        //@ts-ignore
                                        issuesData={data} />
                                </div>
                            }
                        </>
                        :
                        <>
                            <UploadComponent setRefreshTrigger={setRefreshTrigger} />
                            <UploadFiles refreshTrigger={refreshTrigger} setScanComplete={setScanComplete} setData={setData} setScanFile={setScanFile} setScanFileName={setScanFileName} setRefreshTrigger={setRefreshTrigger}
                            />
                        </>
                }
            </div>
        </DashboardLayout>
    )
}

// export default SecureCode
export default Auth(SecureCode)