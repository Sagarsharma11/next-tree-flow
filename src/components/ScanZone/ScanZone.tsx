import React, { useEffect, useState } from 'react';
import { getScanReport, getScanStatus, startScan, stopScan } from '@/utils/apis/api';
import { getLocalStorage } from '@/utils/localstorage/localStorage';
import ScanProgress from '../ScanProgress/ScanProgress';

const ScanZone = ({
  setScanComplete,
  scanFileName,
  scanFile,
  setData,
  scanReport
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

    const checkScanFlow = async () => {
      try {
        // Step 1: Try to fetch existing report
        if (!scanReport?.length && scanData.completed === true) {
          const report = await getScanReport(scanFileName, accessToken);
          // const data = report?.report["test@mail.com"];
          const data = report;
          if (data) {
            console.log("✅ Existing report found", data);
            setData(data),
              setScanComplete(true);
            setIsScanning(false);
            setProgress(100);

            // Step 2: Fetch scan status just once for files_total/files_done info
            try {
              const scanStatus = await getScanStatus(scanFileName, accessToken);
              console.log("ℹ️ Scan status for existing report:", scanStatus);

              setScanData({
                files_total: scanStatus.files_total,
                files_done: scanStatus.files_done,
                completed: scanStatus.completed,
                stop: scanStatus.stop,
              });
            } catch (statusErr) {
              console.error("❌ Failed to fetch scan status:", statusErr);
            }

            return; // ✅ Done
          }
        }

      } catch (err: any) {
        if (err?.response?.status !== 404) {
          console.error("❌ Error fetching scan report:", err);
          return; // Stop on unexpected error
        }
        console.log("📭 No existing report found. Starting scan polling...");
      }

      // Step 3: No report, so poll scan status every 5s
      const fetchScanStatus = async () => {
        try {
          const data = await getScanStatus(scanFileName, accessToken);

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

            // Fetch report after scan completes
            try {
              const finalReport = await getScanReport(scanFileName, accessToken);
              const data = finalReport //finalReport["test@mail.com"];
              console.log("📦 Final Report:", finalReport);
              setData(data);
            } catch (reportErr) {
              console.error("❌ Failed to fetch final report:", reportErr);
            }
          }
        } catch (error: any) {
          console.error("❌ Error fetching scan status:", error);
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            clearInterval(interval);
            setIsScanning(false);
          }
        }
      };

      setIsScanning(true);
      fetchScanStatus(); // Initial
      interval = setInterval(fetchScanStatus, 5000);
    };

    checkScanFlow();

    return () => clearInterval(interval);
  }, [scanFileName, accessToken, setScanComplete]);


  const handleStopScan = async () => {
    try {
      await stopScan(scanFileName, accessToken);
      setIsScanning(false);

      // ✅ Reload only if window is available
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error stopping scan:', err);
    }
  };


  return (
    <div className="w-full space-y-4 px-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <p className="text-blue-500 text-base font-medium italic animate-pulse">
          {isScanning ? '🔍 Running deep scan... almost there!' : '⏹️ Scan paused or completed.'}
        </p>

        {isScanning && (
          <button
            onClick={handleStopScan}
            className="px-4 py-2 bg-red-600 text-white border-t-2 border-t-neutral-900 rounded-md hover:bg-red-500 transition"
          >
            Stop Scan
          </button>
        )
        }
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
