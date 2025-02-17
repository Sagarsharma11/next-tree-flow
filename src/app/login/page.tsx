"use client"
import React, { useEffect } from 'react'
import Login from '../components/Login/Login'


type Props = {}

const page = (props: Props) => {
    useEffect(()=>{
        console.log("re render")
    }, [])
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Login />
            </div>
        </div>
    )
}

export default page