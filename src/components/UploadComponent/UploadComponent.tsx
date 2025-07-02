import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const UploadComponent = () => {
    return (
        <div className="grid w-full max-w-sm items-center gap-3 cursor-pointer">
            <Label className='font-bold text-xl' htmlFor="picture">Upload a zip</Label>
            <Input className='cursor-pointer' id="picture" type="file" />
        </div>
    )
}

export default UploadComponent