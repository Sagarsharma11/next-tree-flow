// export const formatSecurityData = (rawData) => {
//   return Object.values(rawData).flatMap(fileObj =>
//     (fileObj.chunks || []).flatMap(chunk =>
//       (chunk.ai_issues || []).map(issue => ({
//         ...issue,
//         fileName: fileObj.file  // use file path as fileName
//       }))
//     )
//   );
// };


export const formatSecurityData = (rawData) => {
  const severityOrder = { High: 1, Medium: 2, Low: 3 };

  return Object.values(rawData)
    .flatMap(fileObj =>
      (fileObj.chunks || []).flatMap(chunk =>
        (chunk.ai_issues || []).map(issue => ({
          ...issue,
          fileName: fileObj.file
        }))
      )
    )
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
};
