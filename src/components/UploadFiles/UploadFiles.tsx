

import React, { useEffect, useState } from 'react';
import { MdFolderZip } from "react-icons/md";
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import { getScanReport, showAllProjects, startScan } from '@/utils/apis/api';

const UploadFiles = ({ setScanFile, setScanFileName, setData, setScanComplete, refreshTrigger }: any) => {
  const [projects, setProjects] = useState<string[]>([]);
  const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await showAllProjects(accessToken);
        // Assuming response is like: { projects: ['file1.zip', 'file2.zip', ...] }
        setProjects([...data.Projects]);
        console.log("data ", data["Projects"])
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, [refreshTrigger]);



const handleScanStart = async (projectId: string) => {
  console.log(`🔍 Checking existing report for: ${projectId}`);
  setScanFileName(projectId);

  try {
    const report = await getScanReport(projectId, accessToken);
    const data = report?.["test@mail.com"];

    console.log("data => ", data)

    if (data) {
      console.log("✅ Existing Scan Report found:", JSON.stringify(report, null, 2));
      setData(data);
      setScanFile(true);
      setScanComplete(true);
  
      return;
    }

    // If data not found, fall through to scan initiation
    console.log("⚠️ No existing scan data found, initiating new scan...");
  } catch (reportErr) {
    console.warn("⚠️ No report found or error fetching report, proceeding to scan.", reportErr);
  }

  try {
    const res = await startScan(projectId, accessToken);
    console.log("🚀 Scan started successfully:", res);
  } catch (scanErr) {
    console.error("❌ Failed to start scan:", scanErr);
    return;
  }

  setScanFile(true); // triggers ScanZone logic
};



  return (
    <div className='flex gap-1 flex-wrap w-full'>
      {projects?.length > 0 ? (
        projects.map((file, idx) => (
          <div
            key={idx}
            className='flex flex-col justify-center border items-center p-4 rounded-md hover:bg-gray-100 cursor-pointer'
            onClick={() => handleScanStart(file)}
          >
            <MdFolderZip
              className="text-blue-500 transition-transform duration-300 hover:text-blue-700 hover:scale-110"
              size={180}
            />
            <p>{file}</p>
            <small className='text-white rounded border py-2 px-2 bg-black'>click here to start the scan</small>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No uploaded projects found.</p>
      )}
    </div>
  );
};

export default UploadFiles;
