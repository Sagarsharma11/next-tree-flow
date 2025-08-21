export const formatSecurityData = (rawData: any) => {
  const severityOrder: Record<string, number> = {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
    info: 5,
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
      const aOrder = severityOrder[a.severity.toLowerCase()] ?? 999;
      const bOrder = severityOrder[b.severity.toLowerCase()] ?? 999;
      return aOrder - bOrder;
    });
};
