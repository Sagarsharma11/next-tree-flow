import React, { useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import { uploadFiles } from '@/utils/apis/api';

const UploadComponent = () => {
    // const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";
    const refreshToken = getLocalStorage("refresh_token")?.replace(/['"]+/g, "") || "";

    const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("files", file); // The key name should match the backend's expected field name

        try {
            const response = await uploadFiles(formData, accessToken);
            console.log("Upload Success:", response);
            alert("File uploaded successfully.");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed.");
        }
    };

    return (
        <div className="flex justify-between items-center w-full ">
            <div className='flex flex-col gap-2'>
                <Label className='font-bold text-xl' htmlFor="picture">Upload a zip</Label>
                <Input  ref={fileInputRef} className='cursor-pointer' id="picture" type="file" />
            </div>
            <div>
                <button  onClick={handleUpload} className="px-4 py-2 bg-stone-900 text-white border-t-2 border-t-neutral-900 rounded-md hover:bg-stone-800 transition">
                    Upload
                </button>
            </div>
        </div>
    )
}

export default UploadComponent