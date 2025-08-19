import React, { useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import { uploadFiles } from '@/utils/apis/api';
import Swal from 'sweetalert2';

const UploadComponent = ({ setRefreshTrigger }) => {
    const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "No file selected",
                text: "Please choose a file before uploading."
            });
            return;
        }

        const formData = new FormData();
        formData.append("files", file);

        try {
            setLoading(true);
            const response = await uploadFiles(formData, accessToken);
            console.log("Upload Success:", response);

            setRefreshTrigger(prev => prev + 1);

            Swal.fire({
                icon: "success",
                title: "Upload Successful",
                text: "Your file has been uploaded successfully!"
            });
        } catch (error) {
            console.error("Upload failed:", error);

            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-2">
                <Label className="font-bold text-xl" htmlFor="picture">Upload a zip</Label>
                <Input 
                    ref={fileInputRef} 
                    className="cursor-pointer" 
                    id="picture" 
                    type="file" 
                    disabled={loading} // prevent file change while uploading
                />
            </div>
            <div>
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md transition text-white flex items-center gap-2
                        ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-stone-900 hover:bg-stone-800 border-t-2 border-t-neutral-900"}`}
                >
                    {loading && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    )
}

export default UploadComponent;
