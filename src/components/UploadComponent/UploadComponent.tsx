// import React, { useRef, useState } from 'react'
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { getLocalStorage } from '@/utils/localstorage/localStorage';
// import { uploadFiles } from '@/utils/apis/api';
// import Swal from 'sweetalert2';

// const UploadComponent = ({ setRefreshTrigger }) => {
//     const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const [loading, setLoading] = useState(false);

//     const handleUpload = async () => {
//         const file = fileInputRef.current?.files?.[0];
//         if (!file) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "No file selected",
//                 text: "Please choose a file before uploading."
//             });
//             return;
//         }

//         const formData = new FormData();
//         formData.append("files", file);

//         try {
//             setLoading(true);
//             const response = await uploadFiles(formData, accessToken);
//             console.log("Upload Success:", response);

//             setRefreshTrigger(prev => prev + 1);

//             Swal.fire({
//                 icon: "success",
//                 title: "Upload Successful",
//                 text: "Your file has been uploaded successfully!"
//             });
//         } catch (error) {
//             console.error("Upload failed:", error);

//             Swal.fire({
//                 icon: "error",
//                 title: "Upload Failed",
//                 text: "Something went wrong. Please try again."
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex justify-between items-center w-full">
//             <div className="flex flex-col gap-2">
//                 <Label className="font-bold text-xl" htmlFor="picture">Upload a zip</Label>
//                 <Input 
//                     ref={fileInputRef} 
//                     className="cursor-pointer" 
//                     id="picture" 
//                     type="file" 
//                     disabled={loading} // prevent file change while uploading
//                 />
//             </div>
//             <div>
//                 <button
//                     onClick={handleUpload}
//                     disabled={loading}
//                     className={`px-4 py-2 rounded-md transition text-white flex items-center gap-2
//                         ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-stone-900 hover:bg-stone-800 border-t-2 border-t-neutral-900"}`}
//                 >
//                     {loading && (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     )}
//                     {loading ? "Uploading..." : "Upload"}
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default UploadComponent;



import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { getLocalStorage } from "@/utils/localstorage/localStorage";
import { uploadFiles } from "@/utils/apis/api";
import Swal from "sweetalert2";
import styles from "./style.module.css";
import { FiUploadCloud } from "react-icons/fi";

const UploadComponent = ({ setRefreshTrigger }) => {
  const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      setLoading(true);
      const response = await uploadFiles(formData, accessToken);
      console.log("Upload Success:", response);

      setRefreshTrigger((prev) => prev + 1);

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: "Your file has been uploaded successfully!",
      });
    } catch (error) {
      console.error("Upload failed:", error);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // reset input
      }
    }
  };

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      handleUpload(file); // auto upload
    }
  };


  const WarningContent = () => (
  <div className="text-left text-gray-800 dark:text-gray-200">
    <p className="mb-2">⚠️ Do <b>NOT</b> upload these:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
          node_modules
        </code>
      </li>
      <li>
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">venv</code>
      </li>
      <li>or any large dependency folders</li>
    </ul>
  </div>
);

  const handleClick = () => {
    if (loading) return;

    Swal.fire({
      icon: "info",
      title: "Please Note 🚨",
      html: `
        <div class="text-left">
          <p class="mb-2">⚠️ Do <b>NOT</b> upload these:</p>
          <ul class="list-disc pl-5">
            <li><code>node_modules</code></li>
            <li><code>venv</code></li>
            <li>or any large dependency folders</li>
          </ul>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "I Understand",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        // open file picker only AFTER user closes popup
        fileInputRef.current?.click();
      }
    });
  };

  return (
    <div className="w-full max-w-xl">
      <div
        onClick={handleClick}
        className={`rounded-lg ${styles.glow_box} ${
          loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-transparent rounded-lg transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUploadCloud size={32} className="mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-300">
              {loading ? "Uploading..." : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-gray-500">ZIP files only</p>
          </div>
        </div>
      </div>

      {/* hidden input, NOT wrapped in a <label> */}
      <Input
        ref={fileInputRef}
        className="hidden"
        id="picture"
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        disabled={loading}
      />
    </div>
  );
};

export default UploadComponent;
