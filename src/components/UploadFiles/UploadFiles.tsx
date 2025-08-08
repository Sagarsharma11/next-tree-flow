

// import React, { useEffect, useState } from 'react';
// import { MdFolderZip } from "react-icons/md";
// import { getLocalStorage } from '@/utils/localstorage/localStorage';
// import { getScanReport, listProjectStatus, showAllProjects, startScan } from '@/utils/apis/api';
// import { MdDelete } from "react-icons/md";

// const UploadFiles = ({ setScanFile, setScanFileName, setData, setScanComplete, refreshTrigger }: any) => {
//   const [projects, setProjects] = useState<string[]>([]);
//   const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         // const data = await showAllProjects(accessToken);
//         const data = await listProjectStatus(accessToken);
//         // Assuming response is like: { projects: ['file1.zip', 'file2.zip', ...] }
//         console.log(data)
//         setProjects([...data]);
//         console.log("data ", data["Projects"])
//       } catch (error) {
//         console.error("Failed to fetch projects", error);
//       }
//     };

//     fetchProjects();
//   }, [refreshTrigger]);



//   const handleScanStart = async (projectId: string) => {
//     console.log(`🔍 Checking existing report for: ${projectId}`);
//     setScanFileName(projectId);

//     try {
//       const report = await getScanReport(projectId, accessToken);
//       const data = report?.["test@mail.com"];

//       console.log("data => ", data)

//       if (data) {
//         console.log("✅ Existing Scan Report found:", JSON.stringify(report, null, 2));
//         setData(data);
//         setScanFile(true);
//         setScanComplete(true);

//         return;
//       }

//       // If data not found, fall through to scan initiation
//       console.log("⚠️ No existing scan data found, initiating new scan...");
//     } catch (reportErr) {
//       console.warn("⚠️ No report found or error fetching report, proceeding to scan.", reportErr);
//     }

//     try {
//       const res = await startScan(projectId, accessToken);
//       console.log("🚀 Scan started successfully:", res);
//     } catch (scanErr) {
//       console.error("❌ Failed to start scan:", scanErr);
//       return;
//     }

//     setScanFile(true); // triggers ScanZone logic
//   };



//   return (
//     <div className='flex gap-2 flex-wrap w-full'>
//       {projects?.length > 0 ? (
//         projects.map((file, idx) => (
//           <div
//             key={idx}
//             className='flex w-[30rem] justify-between border items-center p-4 rounded-md hover:bg-gray-100 cursor-pointer'
//             onClick={() =>
//               //@ts-ignore
//               handleScanStart(file.project_name)}
//           >
//             <div className='flex justify-center items-center font-bold gap-2'>
//               <MdFolderZip
//                 className="text-blue-500 transition-transform duration-300 hover:text-blue-700 hover:scale-110"
//                 size={50}
//               />
//               <p className='text-xl'>{
//                 //@ts-ignore
//                 file.project_name}
//               </p>
//             </div>
//             <div className='flex gap-2 items-center' >

//               <small
//                 className={`rounded border py-2 px-2 cursor-pointer hover:opacity-90 ${
//                   // @ts-ignore
//                   file.completed ? 'bg-green-600 text-white' : 'bg-black text-white'
//                   }`}
//               >
//                 {
//                   // @ts-ignore
//                   file.completed ? "Check Report" : "Click here to start the scan"
//                 }
//               </small>

//                 <div>
//                     <MdDelete size={26}  color={"red"}/>
//                 </div>
            
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500 italic">No uploaded projects found.</p>
//       )}
//     </div>
//   );
// };

// export default UploadFiles;


import React, { useEffect, useState } from 'react';
import { MdFolderZip, MdDelete } from "react-icons/md";
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import { getScanReport, listProjectStatus, startScan, deleteProject } from '@/utils/apis/api';

const UploadFiles = ({ setScanFile, setScanFileName, setData, setScanComplete, refreshTrigger, setRefreshTrigger }: any) => {
  const [projects, setProjects] = useState<string[]>([]);
  const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjectStatus(accessToken);
        setProjects([...data]);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };

    fetchProjects();
  }, [refreshTrigger]);

  const handleScanStart = async (projectId: string) => {
    setScanFileName(projectId);

    try {
      const report = await getScanReport(projectId, accessToken);
      const data = report;

      if (data) {
        setData(data);
        setScanFile(true);
        setScanComplete(true);
        return;
      }

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

    setScanFile(true);
  };

  const handleDelete = async (projectId: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete project: ${projectId}?`);
    if (!confirmed) return;

    try {
      await deleteProject(projectId, accessToken);
      alert("🗑️ Project deleted successfully!");
      setRefreshTrigger((prev: any) => !prev); // re-trigger data
    } catch (err) {
      alert("❌ Failed to delete project.");
      console.error(err);
    }
  };

  return (
    <div className='flex gap-2 flex-wrap w-full'>
      {projects?.length > 0 ? (
        projects.map((file, idx) => (
          <div
            key={idx}
            className='flex w-[30rem] justify-between border items-center p-4 rounded-md hover:bg-gray-100 cursor-pointer'
            //@ts-ignore
            onClick={() => handleScanStart(file.project_name)}
          >
            <div className='flex justify-center items-center font-bold gap-2'>
              <MdFolderZip
                className="text-blue-500 transition-transform duration-300 hover:text-blue-700 hover:scale-110"
                size={50}
              />
              
              <p className='text-xl'>{
                      //@ts-ignore
              file.project_name}</p>
            </div>

            <div className='flex gap-2 items-center'>
              <small
                className={`rounded border py-2 px-2 cursor-pointer hover:opacity-90 ${
                          //@ts-ignore
                  file.completed ? 'bg-green-600 text-white' : 'bg-black text-white'
                }`}
              >
                
                {
                        //@ts-ignore
                file.completed ? "Check Report" : "Click here to start the scan"}
              </small>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                          //@ts-ignore
                  handleDelete(file.project_name);
                }}
              >
                <MdDelete size={26} color="red" className="hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No uploaded projects found.</p>
      )}
    </div>
  );
};

export default UploadFiles;

