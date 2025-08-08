export const formatSecurityData = (rawData: any) => {
  const severityOrder: Record<string, number> = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
    Info: 5,
  };

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
    ?.sort((a: any, b: any) => {
      const aOrder = severityOrder[a.severity] ?? 999;
      const bOrder = severityOrder[b.severity] ?? 999;
      return aOrder - bOrder;
    });
};
