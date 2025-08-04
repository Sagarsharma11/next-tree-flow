// export const formatSecurityData = (rawData) => {
//   const severityOrder = { High: 1, Medium: 2, Low: 3 };

//   return Object.values(rawData)?.flatMap(fileObj =>
//       //@ts-ignore
//       (fileObj?.chunks || [])?.flatMap(chunk => {
//         console.log("chunks ", chunk)
//         return (
//           chunk?.ai_issues || [])?.map(issue => {
//             console.log("inssues ", issue)
//             return ({
//               ...issue,
//               //@ts-ignore
//               fileName: fileObj?.file
//             })
//           }


//           )
//       }
//       )
//     )
//     ?.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
// };


export const formatSecurityData = (rawData: any) => {
  const severityOrder = { High: 1, Medium: 2, Low: 3 };

  return Object.values(rawData)
    ?.flatMap((fileObj: any) =>
      Array.isArray(fileObj?.chunks)
        ? fileObj.chunks.flatMap((chunk: any) => {
            const issues = Array.isArray(chunk?.ai_issues) ? chunk.ai_issues : [];
            return issues.map((issue: any) => ({
              ...issue,
              fileName: fileObj?.file,
            }));
          })
        : []
    )
    ?.sort((a: any, b: any) => severityOrder[a.severity] - severityOrder[b.severity]);
};
