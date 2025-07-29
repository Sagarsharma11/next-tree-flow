// import React, { useEffect, useState } from 'react';
// import { getScanStatus, startScan, stopScan } from '@/utils/apis/api';
// import { getLocalStorage } from '@/utils/localstorage/localStorage';
// import ScanProgress from '../ScanProgress/ScanProgress';

// const ScanZone = ({
//   setScanComplete,
//   scanFileName,
//   scanFile
// }: any) => {
//   const [progress, setProgress] = useState(0);
//   const [isScanning, setIsScanning] = useState(true); // tracking scan state
//   const accessToken = getLocalStorage('token')?.replace(/['"]+/g, '') || '';
//   const [scanData, setScanData] = useState({
//     files_total: 0,
//     files_done: 0,
//     completed: false,
//     stop: false,
//   });

//   useEffect(() => {
//     if (!accessToken || !scanFileName) return;
//     let interval: NodeJS.Timeout;

//     const fetchScanStatus = async () => {
//       try {
//         console.log("token ", accessToken)
//         const data = await getScanStatus(scanFileName, accessToken);
//         // Update scanData state
//         setScanData({
//           files_total: data.files_total,
//           files_done: data.files_done,
//           completed: data.completed,
//           stop: data.stop,
//         });
//         const apiProgress = data?.progress || 0;
//         setProgress(apiProgress);

//         if (data?.completed || apiProgress >= 100) {
//           clearInterval(interval);
//           setScanComplete(true);
//           setIsScanning(false);
//         }
//       } catch (error) {
//         console.error('Failed to fetch scan status:', error);
//         clearInterval(interval);
//       }
//     };

//     if (scanFileName && isScanning) {
//       fetchScanStatus(); // initial fetch
//       interval = setInterval(fetchScanStatus, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [scanFileName, accessToken, isScanning, setScanComplete]);

//   const handleStopScan = async () => {
//     try {
//       await stopScan(scanFileName, accessToken);
//       setIsScanning(false);
//     } catch (err) {
//       console.error('Error stopping scan:', err);
//     }
//   };

//   const handleStartScan = async () => {
//     // Reset state and trigger re-fetch
//     try {
//       const res = await startScan(scanFileName, accessToken);
//       console.log("Scan started successfully:", res);
//     } catch (error) {
//       console.error("Scan start failed for", scanFileName, error);
//     } finally {
//       setProgress(0);
//       setIsScanning(true);
//       setScanComplete(false);
//     }
//   };



//   return (
//     <div className="w-full space-y-4 px-4">
//       <div className="w-full flex justify-between items-center">
//         <p className="text-blue-500 text-base font-medium italic animate-pulse">
//           {isScanning ? '🔍 Running deep scan... almost there!' : '⏹️ Scan paused or completed.'}
//         </p>

//         {isScanning ? (
//           <button
//             onClick={handleStopScan}
//             className="px-4 py-2 bg-red-600 text-white border-t-2 border-t-neutral-900 rounded-md hover:bg-red-500 transition"
//           >
//             Stop Scan
//           </button>
//         ) : (
//           <button
//             onClick={handleStartScan}
//             className="px-4 py-2 bg-green-600 text-white border-t-2 border-t-green-800 rounded-md hover:bg-green-500 transition"
//           >
//             Start Scan
//           </button>
//         )}
//       </div>

//       <ScanProgress
//         progress={progress}
//         fileName={scanFileName}
//         estimatedTime="Calculating..."
//       />
//       {/* Scan Status Info */}
//       <div className="text-sm text-gray-700 mt-2 space-y-1">
//         <p>🗂️ Files Scanned: {scanData.files_done} / {scanData.files_total}</p>
//         <p>
//           📊 Status:{" "}
//           {scanData.completed
//             ? "✅ Completed"
//             : scanData.stop
//               ? "⏹️ Stopped"
//               : "🔄 In Progress"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ScanZone;



import React, { useEffect, useState } from 'react';
import { getScanStatus, startScan, stopScan } from '@/utils/apis/api';
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import ScanProgress from '../ScanProgress/ScanProgress';

const ScanZone = ({
  setScanComplete,
  scanFileName,
  scanFile
}: any) => {
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [scanData, setScanData] = useState({
    files_total: 0,
    files_done: 0,
    completed: false,
    stop: false,
  });

  const accessToken = getLocalStorage('token')?.replace(/['"]+/g, '') || '';

  useEffect(() => {
    if (!accessToken || !scanFileName) return;
    let interval: NodeJS.Timeout;

    const fetchScanStatus = async () => {
      try {
        const data = await getScanStatus(scanFileName, accessToken);

        // Update scanData state
        setScanData({
          files_total: data.files_total,
          files_done: data.files_done,
          completed: data.completed,
          stop: data.stop,
        });

        const calculatedProgress = (data.files_done / data.files_total) * 100 || 0;
        setProgress(calculatedProgress);

        if (data.completed || calculatedProgress >= 100) {
          clearInterval(interval);
          setScanComplete(true);
          setIsScanning(false);
        }
      } catch (error) {
        console.error('Failed to fetch scan status:', error);
        clearInterval(interval);
      }
    };

    if (scanFileName && isScanning) {
      fetchScanStatus(); // initial fetch
      interval = setInterval(fetchScanStatus, 1000);
    }

    return () => clearInterval(interval);
  }, [scanFileName, accessToken, isScanning, setScanComplete]);

  const handleStopScan = async () => {
    try {
      await stopScan(scanFileName, accessToken);
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scan:', err);
    }
  };

  const handleStartScan = async () => {
    try {
      const res = await startScan(scanFileName, accessToken);
      console.log("Scan started successfully:", res);
    } catch (error) {
      console.error("Scan start failed for", scanFileName, error);
    } finally {
      setProgress(0);
      setIsScanning(true);
      setScanComplete(false);
    }
  };

  return (
    <div className="w-full space-y-4 px-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <p className="text-blue-500 text-base font-medium italic animate-pulse">
          {isScanning ? '🔍 Running deep scan... almost there!' : '⏹️ Scan paused or completed.'}
        </p>

        {isScanning ? (
          <button
            onClick={handleStopScan}
            className="px-4 py-2 bg-red-600 text-white border-t-2 border-t-neutral-900 rounded-md hover:bg-red-500 transition"
          >
            Stop Scan
          </button>
        ) : (
          <button
            onClick={handleStartScan}
            className="px-4 py-2 bg-green-600 text-white border-t-2 border-t-green-800 rounded-md hover:bg-green-500 transition"
          >
            Start Scan
          </button>
        )}
      </div>

      {/* Progress */}
      <ScanProgress
        progress={progress}
        fileName={scanFileName}
        estimatedTime="Calculating..."
      />

      {/* Scan Status Info */}
      <div className="text-sm text-gray-700 mt-2 space-y-1">
        <p>🗂️ Files Scanned: {scanData.files_done} / {scanData.files_total}</p>
        <p>
          📊 Status:{" "}
          {scanData.completed
            ? "✅ Completed"
            : scanData.stop
            ? "⏹️ Stopped"
            : "🔄 In Progress"}
        </p>
      </div>
    </div>
  );
};

export default ScanZone;
