import React from "react";

const SecurityAuditTable = ({ issues }) => {
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
                        {issues.map((issue, index) => (
                            <tr
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
                                    className={`px-4 py-3 font-bold ${issue.severity === "High"
                                            ? "text-red-600"
                                            : issue.severity === "Medium"
                                                ? "text-yellow-600"
                                                : "text-green-600"
                                        }`}
                                >
                                    {issue.severity}
                                </td>
                                <td className="px-4 py-3">{issue["CVSS score"] || issue["cvss"]}</td>
                                <td className="px-4 py-3 text-gray-600">
                                    {issue["Security Recommendations"]
                                    || issue["recommendations"]?.join(", ")
                                    }
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                    {issue["fileName"]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SecurityAuditTable;
