import React, { useEffect, useState } from 'react';
import ScanProgress from '../ScanProgress/ScanProgress';

const ScanZone = ({ setScanComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Only increase if progress is below 100
        if (progress < 100) {
            const timeout = setTimeout(() => {
                setProgress(prev => Math.min(prev + 1, 100)); // increase 1% every 50ms
            }, 50);

            return () => clearTimeout(timeout); // cleanup timeout on unmount
        }else {
            setScanComplete(true)
        }
    }, [progress]);
    return (
        <div className="w-full  space-y-4 px-4">
            {/* Tagline outside scan box */}
            <p className="text-blue-500 text-base font-medium italic animate-pulse">
                🔍 Running deep scan... almost there!
            </p>

            {/* ScanProgress component */}
            <ScanProgress
                progress={progress}
                fileName="report.zip"
                estimatedTime="00:35 seconds"
            />
        </div>
    );
};

export default ScanZone;
