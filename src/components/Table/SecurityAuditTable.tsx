import React from "react";

const SecurityAuditTable = ({ issues }) => {
    console.log("issues => ", issues)

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return '#8B0000'; // Dark Red
            case 'high':
                return '#e74c3c'; // Red
            case 'medium':
                return '#f1c40f'; // Yellow
            case 'low':
                return '#2ecc71'; // Green
            case 'info':
                return '#53EAFD'; // Blue
            default:
                return '#000000'; // Default Black or fallback
        }
    };

    function toTitleCase(str) {
        return str
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-gray-100 text-left text-sm text-gray-700">
                        <tr>
                            <th className="px-4 py-3">S.No.</th>
                            <th className="px-4 py-3">Issue</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Severity</th>
                            <th className="px-4 py-3">CVSS</th>
                            <th className="px-4 py-3">Recommendation</th>
                            <th className="px-4 py-3">File</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {issues.map((issue, index) => {

                            return <tr
                                key={index}
                                className="transition-transform duration-200 transform  hover:bg-yellow-50 cursor-pointer"
                            >
                                <td className="px-4 py-3 font-medium text-gray-600">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 text-gray-800 font-semibold">
                                    {issue.name}
                                </td>
                                <td className="px-4 py-3 text-gray-700">{issue.description}</td>
                                <td
                                    className={`px-4 py-3 font-bold`}

                                    style={{ color: getSeverityColor(issue?.severity?.toLowerCase()) }}
                                >
                                    {toTitleCase(issue?.severity)}
                                </td>
                                <td className="px-4 py-3">{issue["CVSS score"] || issue["cvss"]
                                    || issue["cvss_score"] || issue["CVSS score"] || issue["CVSS"]
                                    || issue["CVSS_score"]
                                }</td>
                                <td className="px-4 py-3 text-gray-600">
                                    {

                                        issue["Security Recommendations"] ||

                                        issue["recommendations"]
                                        || issue["recommendations"]?.join(", ")
                                    }
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {issue["fileName"]}
                                </td>
                            </tr>
                        }
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SecurityAuditTable;
