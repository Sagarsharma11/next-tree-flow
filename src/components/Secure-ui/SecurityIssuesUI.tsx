// import React, { useRef, useState } from "react";
// import { Card } from "@/components/ui/card";
// import html2pdf from "html2pdf.js";

// interface Issue {
//   name: string;
//   severity: string;
//   "CVSS score": string;
//   description: string;
//   "Security Recommendations": string;
//   "Corrected example code"?: string;
// }

// interface Chunk {
//   start_line: number;
//   end_line: number;
//   chunk_content: string;
//   ai_issues: Issue[];
// }

// interface FileData {
//   chunks: Chunk[];
// }

// interface SecurityIssuesProps {
//   issuesData: Record<string, FileData>;
// }

// const getSeverityColor = (severity: string): string => {
//   switch (severity.toLowerCase()) {
//     case 'high':
//       return '#dc2626'; // red-600
//     case 'medium':
//       return '#d97706'; // amber-600
//     case 'low':
//       return '#065f46'; // green-700
//     default:
//       return '#374151'; // gray-700
//   }
// };

// const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => (
//   <Card className="bg-white border mt-4 p-4 space-y-2 shadow-md">
//     <h3 className="text-lg font-semibold">{issue.name}</h3>
//     <p className="text-sm font-medium" style={{ color: getSeverityColor(issue.severity) }}>
//       Severity: {issue.severity} (CVSS: {issue["CVSS score"]})
//     </p>
//     <p className="text-sm"><strong>Description:</strong> {issue.description}</p>
//     <p className="text-sm"><strong>Recommendation:</strong> {issue["Security Recommendations"]}</p>
//     {issue["Corrected example code"] && (
//       <div className="relative">
//         <button
//           className="absolute top-1 right-1 bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
//           onClick={() => navigator.clipboard.writeText(issue["Corrected example code"] || '')}
//         >
//           Copy
//         </button>
//         <pre className="bg-gray-100 p-2 text-xs rounded overflow-x-auto">
//           {issue["Corrected example code"]}
//         </pre>
//       </div>
//     )}
//   </Card>
// );

// const ChunkView: React.FC<{ chunk: Chunk }> = ({ chunk }) => (
//   <div className="mt-4">
//     <p className="text-sm text-gray-500 mb-2">
//       Lines: {chunk.start_line}–{chunk.end_line}
//     </p>
//     <div className="relative">
//       <button
//         className="absolute top-1 right-1 bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
//         onClick={() => navigator.clipboard.writeText(chunk.chunk_content)}
//       >
//         Copy
//       </button>
//       <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-64">
//         {chunk.chunk_content.substring(0, 500)}...
//       </pre>
//     </div>
//     {chunk.ai_issues.map((issue, idx) => (
//       <IssueCard key={idx} issue={issue} />
//     ))}
//   </div>
// );

// const FileAccordion: React.FC<{ filename: string; fileData: FileData }> = ({ filename, fileData }) => {
//   const [open, setOpen] = useState(false);
//   const totalIssues = fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.length, 0);

//   return (
//     <Card className="border mb-4">
//       <div
//         className="p-4 cursor-pointer bg-blue-50 hover:bg-blue-100"
//         onClick={() => setOpen(!open)}
//       >
//         <div className="flex justify-between items-center">
//           <span className="font-semibold">{filename}</span>
//           {/* <span className="text-sm text-gray-600">
//             {totalIssues} issue(s)
//             {' '}[
//             {fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'high').length, 0)} High,
//             {fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'medium').length, 0)} Medium,
//             {fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'low').length, 0)} Low
//             ]
//           </span> */}
//           <span className="text-sm text-gray-600">
//             {totalIssues} issue(s)
//             {' '}(
//             <span style={{ color: '#dc2626' }}>{fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'high').length, 0)} High</span>,
//             <span style={{ color: '#d97706' }}>{fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'medium').length, 0)} Medium</span>,
//             <span style={{ color: '#065f46' }}>{fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'low').length, 0)} Low</span>
//             )
//           </span>
//         </div>
//       </div>
//       {open && (
//         <div className="p-4 bg-white">
//           {fileData.chunks.map((chunk, idx) => (
//             <ChunkView key={idx} chunk={chunk} />
//           ))}
//         </div>
//       )}
//     </Card>
//   );
// };

// const SecurityIssuesUI: React.FC<SecurityIssuesProps> = ({ issuesData }) => {
//   const reportRef = useRef<HTMLDivElement>(null);
//   const generatePDF = () => {
//     if (!reportRef.current) return;

//     const opt = {
//       margin: 0.5,
//       filename: `security_issues_report.pdf`,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
//     };

//     html2pdf().set(opt).from(reportRef.current).save();
//   };
//   return (
//     <div className="w-full p-4 sm:p-0">
//       <h1 className="text-2xl font-bold mb-6">Security Issues Report</h1>
//       <small       onClick={generatePDF} className="text-blue-600 cursor-pointer">Generate Report</small>
//       <div ref={reportRef} className="mt-4">
//       {Object.entries(issuesData).map(([filename, fileData]) => (
//         <FileAccordion key={filename} filename={filename} fileData={fileData} />
//       ))}
//     </div>
//     </div >
//   );
// };

// export default SecurityIssuesUI;


"use client"
import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import html2pdf from "html2pdf.js";
import "./style.css"

interface Issue {
  name: string;
  severity: string;
  "CVSS score": string;
  description: string;
  "Security Recommendations": string;
  "Corrected example code"?: string;
}

interface Chunk {
  start_line: number;
  end_line: number;
  chunk_content: string;
  ai_issues: Issue[];
}

interface FileData {
  chunks: Chunk[];
}

interface SecurityIssuesProps {
  issuesData: Record<string, FileData>;
}

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'high':
      return '#dc2626';
    case 'medium':
      return '#d97706';
    case 'low':
      return '#065f46';
    default:
      return '#374151';
  }
};

const IssueCard: React.FC<{ issue: Issue }> = ({ issue }) => (
  <Card className="bg-white border mt-4 p-4 space-y-2 shadow-md">
    <h3 className="text-lg font-semibold">{issue.name}</h3>
    <p className="text-sm font-medium" style={{ color: getSeverityColor(issue.severity) }}>
      Severity: {issue.severity} (CVSS: {issue["CVSS score"]})
    </p>
    <p className="text-sm"><strong>Description:</strong> {issue.description}</p>
    <p className="text-sm"><strong>Recommendation:</strong> {issue["Security Recommendations"]}</p>
    {issue["Corrected example code"] && (
      <div className="relative">
        <button
          className="absolute top-1 right-1 bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
          onClick={() => navigator.clipboard.writeText(issue["Corrected example code"] || '')}
        >
          Copy
        </button>
        <pre className="bg-gray-100 p-2 text-xs rounded overflow-x-auto">
          {issue["Corrected example code"]}
        </pre>
      </div>
    )}
  </Card>
);

const ChunkView: React.FC<{ chunk: Chunk }> = ({ chunk }) => (
  <div className="mt-4">
    <p className="text-sm text-gray-500 mb-2">
      Lines: {chunk.start_line}–{chunk.end_line}
    </p>
    <div className="relative">
      <button
        className="absolute top-1 right-1 bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
        onClick={() => navigator.clipboard.writeText(chunk.chunk_content)}
      >
        Copy
      </button>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-64">
        {chunk.chunk_content.substring(0, 500)}...
      </pre>
    </div>
    {chunk.ai_issues.map((issue, idx) => (
      <IssueCard key={idx} issue={issue} />
    ))}
  </div>
);

const FileAccordion: React.FC<{
  filename: string;
  fileData: FileData;
  forceOpen?: boolean;
}> = ({ filename, fileData, forceOpen = false }) => {
  const [open, setOpen] = useState(forceOpen);

  useEffect(() => {
    setOpen(forceOpen);
  }, [forceOpen]);

  const totalIssues = fileData.chunks.reduce((acc, chunk) => acc + chunk.ai_issues.length, 0);

  return (
    <Card className="border mb-4 page-break-avoid">
      <div
        className="p-4 cursor-pointer bg-blue-50 hover:bg-blue-100"
        onClick={() => setOpen(!open)}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold">{filename}</span>
          <span className="text-sm text-gray-600">
            {totalIssues} issue(s) (
            <span style={{ color: '#dc2626' }}>
              {fileData.chunks.reduce((acc, chunk) =>
                acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'high').length, 0)} High
            </span>,{" "}
            <span style={{ color: '#d97706' }}>
              {fileData.chunks.reduce((acc, chunk) =>
                acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'medium').length, 0)} Medium
            </span>,{" "}
            <span style={{ color: '#065f46' }}>
              {fileData.chunks.reduce((acc, chunk) =>
                acc + chunk.ai_issues.filter(i => i.severity.toLowerCase() === 'low').length, 0)} Low
            </span>
            )
          </span>
        </div>
      </div>
      {open && (
        <div className="p-4 bg-white">
          {fileData.chunks.map((chunk, idx) => (
            <ChunkView key={idx} chunk={chunk} />
          ))}
        </div>
      )}
    </Card>
  );
};

const SecurityIssuesUI: React.FC<SecurityIssuesProps> = ({ issuesData }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  const generatePDF = () => {
    const allExpanded = Object.keys(issuesData).reduce((acc, file) => {
      acc[file] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setExpandedFiles(allExpanded);

    // Allow UI update before generating
    setTimeout(() => {
      if (!reportRef.current) return;
      html2pdf()
        .set({
          margin: 10,
          filename: 'report.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(reportRef.current)
        .save();
    }, 300);
  };

  return (
    <div className="w-full p-4 sm:p-0">
      <h1 className="text-2xl font-bold mb-6">Security Issues Report</h1>
      <small
        className="text-blue-600 cursor-pointer hover:underline"
        onClick={generatePDF}
      >
        Generate Report
      </small>
      <div ref={reportRef} className="mt-4">
        {Object.entries(issuesData).map(([filename, fileData]) => (
          <FileAccordion
            key={filename}
            filename={filename}
            fileData={fileData}
            forceOpen={expandedFiles[filename]}
          />
        ))}
      </div>
    </div>
  );
};

export default SecurityIssuesUI;
