import React from 'react';

interface ScanProgressProps {
  progress: number; // 0 to 100
  fileName: string;
  estimatedTime: string;
}

const ScanProgress: React.FC<ScanProgressProps> = ({ progress, fileName, estimatedTime }) => {
  return (
    <div className="w-full p-5 bg-[#0f1629] rounded-lg shadow-lg border border-blue-800/30">
      <div className="text-white font-semibold text-base mb-3">Scanning...</div>

      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* File info */}
      <div className="mt-4 text-sm text-gray-300 space-y-1">
        <div>
          <span className="font-semibold text-white">📁 File:</span> {fileName}
        </div>
        <div>
          <span className="font-semibold text-white">⏳ Estimated time left:</span> {estimatedTime}
        </div>
      </div>
    </div>
  );
};

export default ScanProgress;
