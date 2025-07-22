import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const UploadComponent = () => {
    return (
        <div className="flex justify-between items-center w-full ">
            <div className='flex flex-col gap-2'>
                <Label className='font-bold text-xl' htmlFor="picture">Upload a zip</Label>
                <Input className='cursor-pointer' id="picture" type="file" />
            </div>
            <div>
                <button className="px-4 py-2 bg-stone-900 text-white border-t-2 border-t-neutral-900 rounded-md hover:bg-stone-800 transition">
                    Upload
                </button>
            </div>
        </div>
    )
}

export default UploadComponent