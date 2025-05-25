import React, { useMemo, useRef, useState } from 'react';
import { MdOutlineContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const Modal = ({ data, jsonData }: any) => {

    const preRef = useRef(null);
    const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (preRef.current) {
      const text = preRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1000); // Reset after 1 minute
        })
        .catch(err => {
          console.error('Failed to copy!', err);
        });
    }
  };

const formattedJSON = useMemo(() => {
    if (!data || !jsonData?.length) return "{}";

    const vpcs = jsonData[0]?.VPCs || [];
    console.log("data", data)
    // VPC
    if (data.label?.includes("VPC")) {
        const matchingVPC = vpcs.find((vpc: any) => vpc?.VPC_ID === data.id);
        if (matchingVPC) return JSON.stringify(matchingVPC, null, 2);
    }

    // Subnet
    if (data.label?.includes("Subnet")) {
        for (const vpc of vpcs) {
            const subnet = vpc.Subnets?.find((subnet: any) => subnet?.Subnet_ID === data.id);
            if (subnet) return JSON.stringify(subnet, null, 2);
        }
    }

    // Internet Gateway
    if (data.label?.includes("IGW")) {
        for (const vpc of vpcs) {
            if (vpc?.Internet_Gateway?.IGW_ID === data.id) {
                return JSON.stringify(vpc.Internet_Gateway, null, 2);
            }
        }
    }

    // Security Group
    if (data.label?.includes("SG") || data.label?.includes("sg")) {
        for (const vpc of vpcs) {
            for (const subnet of vpc.Subnets || []) {
                const sg = subnet.Security_Groups?.find((sg: any) => sg.SG_ID === data.id);
                if (sg) return JSON.stringify(sg, null, 2);
            }
        }
    }

    // NACL
    if (data.label?.includes("NACL")) {
        for (const vpc of vpcs) {
            for (const subnet of vpc.Subnets || []) {
                if (subnet?.NACL?.NACL_ID === data.id) {
                    return JSON.stringify(subnet.NACL, null, 2);
                }
            }
        }
    }

    // EC2 Instance
    if (data.label?.includes("EC2")) {
        for (const vpc of vpcs) {
            for (const subnet of vpc.Subnets || []) {
                for (const sg of subnet.Security_Groups || []) {
                    const instance = sg.EC2_Instances?.find((ec2: any) => ec2.Instance_ID === data.id);
                    if (instance) return JSON.stringify(instance, null, 2);
                }
            }
        }
    }

    return JSON.stringify(data, null, 2);
}, [data, jsonData]);

return (
    <dialog id="my_modal_3" className="modal shadow-md shadow-blue-500 border bg-white p-4 rounded">
        <div className="modal-box w-[25rem] p-0">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-white z-10 py-4 border-b">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 border px-1 rounded">✕</button>
                </form>
                <div onClick={handleCopy} className="text-lg cursor-pointer flex items-center gap-2"> {copied ? <><FaCheck />Copied!</>: <><MdOutlineContentCopy />Copy </>}</div>
            </div>

            {/* Scrollable Content */}
            <div className="bg-gray-900 text-white max-h-[60vh] overflow-auto p-4 rounded-b">
                <pre ref={preRef} className="whitespace-pre-wrap">{formattedJSON}</pre>
            </div>
        </div>
    </dialog>

);
};

export default Modal;
