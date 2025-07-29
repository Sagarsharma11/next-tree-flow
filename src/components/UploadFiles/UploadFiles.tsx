

import React, { useEffect, useState } from 'react';
import { MdFolderZip } from "react-icons/md";
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import { showAllProjects, startScan } from '@/utils/apis/api';

const UploadFiles = ({ setScanFile, setScanFileName }:any) => {
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
  }, []);

//   const handleChange = () => {
//     setScanFile(true);
//   };

  const handleScanStart = async (projectId: string) => {
    try {
      console.log(`Starting scan for: ${projectId}`);
      setScanFileName(projectId)
      const res = await startScan(projectId, accessToken);
      console.log("Scan started successfully:", res);
      setScanFile(true);
    } catch (error) {
      console.error("Scan start failed for", projectId, error);
    }
  };

  return (
    <div className='flex gap-1 flex-wrap w-full'>
      {projects?.length > 0 ? (
        projects.map((file, idx) => (
          <div
            key={idx}
            className='flex flex-col justify-center border items-center p-4 rounded-md hover:bg-gray-100 cursor-pointer'
            onClick={()=>handleScanStart(file)}
          >
            <MdFolderZip
              className="text-blue-500 transition-transform duration-300 hover:text-blue-700 hover:scale-110"
              size={180}
            />
            <p>{file}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No uploaded projects found.</p>
      )}
    </div>
  );
};

export default UploadFiles;
