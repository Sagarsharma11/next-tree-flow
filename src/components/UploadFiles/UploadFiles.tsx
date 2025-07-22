import React from 'react'
import { MdFolderZip } from "react-icons/md";

const UploadFiles = ({ setScanFile }) => {

    const handleChange = () => {
        setScanFile(true)
    }

    return (
        <div className='flex gap-1 flex-wrap w-full'>
            {
                [0, 1, 2, 3].map((ele) => (
                    <div className='flex flex-col justify-center border items-center' onClick={handleChange}>
                        <MdFolderZip
                            className="text-blue-500 cursor-pointer transition-transform duration-300 hover:text-blue-700 hover:scale-110"
                            size={180}
                        />
                        <p>{ele}.zip</p>
                    </div>
                ))
            }
        </div>
    )
}

export default UploadFiles