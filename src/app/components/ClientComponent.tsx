"use client"
import React, { useEffect, useState } from 'react'
// import { Provider } from "react-redux";
// import { store } from "@/redux/store";


const ClientComponent = ({ children }: any) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set to true once client-side rendering is active
    }, []);

    if (!isClient) {
        return null; // Return nothing during SSR
    }

    return (
        <div>
            {/* <Provider store={store}> */}
            {children}
            {/* </Provider> */}
        </div>
    )
}

export default ClientComponent