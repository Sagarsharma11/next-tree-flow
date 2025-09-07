// import React, { useEffect, useState } from 'react';
// import { MdFolderZip, MdDelete } from "react-icons/md";
// import { getLocalStorage } from '@/utils/localstorage/localStorage';
// import { getScanReport, listProjectStatus, startScan, deleteProject } from '@/utils/apis/api';

// const UploadFiles = ({ setScanFile, setScanFileName, setData, setScanComplete, refreshTrigger, setRefreshTrigger }: any) => {
//   const [projects, setProjects] = useState<string[]>([]);
//   const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const data = await listProjectStatus(accessToken);
//         setProjects([...data]);
//       } catch (error) {
//         console.error("Failed to fetch projects", error);
//       }
//     };

//     fetchProjects();
//   }, [refreshTrigger]);

//   const handleScanStart = async (projectId: string) => {
//     setScanFileName(projectId);

//     try {
//       const report = await getScanReport(projectId, accessToken);
//       const data = report;

//       if (data) {
//         setData(data);
//         setScanFile(true);
//         setScanComplete(true);
//         return;
//       }

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

//     setScanFile(true);
//   };

//   const handleDelete = async (projectId: string) => {
//     const confirmed = window.confirm(`Are you sure you want to delete project: ${projectId}?`);
//     if (!confirmed) return;

//     try {
//       await deleteProject(projectId, accessToken);
//       alert("🗑️ Project deleted successfully!");
//       setRefreshTrigger((prev: any) => !prev); // re-trigger data
//     } catch (err) {
//       alert("❌ Failed to delete project.");
//       console.error(err);
//     }
//   };

//   return (
//     <div className='flex gap-2 flex-wrap w-full'>
//       {projects?.length > 0 ? (
//         projects.map((file, idx) => (
//           <div
//             key={idx}
//             className='flex w-[30rem] justify-between border items-center p-4 rounded-md hover:bg-gray-100 cursor-pointer'
//             //@ts-ignore
//             onClick={() => handleScanStart(file.project_name)}
//           >
//             <div className='flex justify-center items-center font-bold gap-2'>
//               <MdFolderZip
//                 className="text-blue-500 transition-transform duration-300 hover:text-blue-700 hover:scale-110"
//                 size={50}
//               />

//               <p className='text-xl'>{
//                       //@ts-ignore
//               file.project_name}</p>
//             </div>

//             <div className='flex gap-2 items-center'>
//               <small
//                 className={`rounded border py-2 px-2 cursor-pointer hover:opacity-90 ${
//                           //@ts-ignore
//                   file.completed ? 'bg-green-600 text-white' : 'bg-black text-white'
//                 }`}
//               >

//                 {
//                         //@ts-ignore
//                 file.completed ? "Check Report" : "Click here to start the scan"}
//               </small>

//               <div
//                 onClick={(e) => {
//                   e.stopPropagation();
//                           //@ts-ignore
//                   handleDelete(file.project_name);
//                 }}
//               >
//                 <MdDelete size={26} color="red" className="hover:scale-110 transition-transform" />
//               </div>
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
import Swal from 'sweetalert2';
import { MdNotStarted } from "react-icons/md";


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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete project: ${projectId}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProject(projectId, accessToken);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `Project "${projectId}" has been deleted.`,
        timer: 2000,
        showConfirmButton: false
      });

      setRefreshTrigger((prev: any) => !prev);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Something went wrong while deleting the project.'
      });
      console.error(err);
    }
  };

  return (
    <div className='flex gap-2 flex-wrap w-full'>
      {projects?.length > 0 ? (
        projects.map((file, idx) => (
          <div
            key={idx}

            className="
  flex w-[32rem] justify-between border items-center p-4 rounded-md gap-2
"
            //@ts-ignore
            onClick={() => handleScanStart(file.project_name)}
          >
            <div className='flex justify-center items-center font-bold gap-2'>
              <MdFolderZip
                className="text-blue-500 transition-transform duration-300 hover:text-blue-700 hover:scale-110"
                size={50}
              />
              <p className='text-xl'>
                {
                  //@ts-ignore
                  file.project_name
                }
              </p>
            </div>

            <div className='flex gap-2 items-center '>
              <small
                className={`rounded-sm border py-2 px-2 cursor-pointer hover:opacity-80 ${
                  //@ts-ignore
                  file.completed ? 'bg-green-600 text-white' : 'bg-black text-white'
                  }`}
              >
                {
                  //@ts-ignore
                  file.completed ? "Check Report" : <div className='flex gap-2 items-center'>Click here to start the scan <MdNotStarted /> </div>
                }
              </small>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  //@ts-ignore
                  handleDelete(file.project_name);
                }}
                className='cursor-pointer'
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
