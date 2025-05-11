import React from 'react';

const Modal = ({ data, jsonData }: any) => {
    // Format the JSON data into a pretty string
    let formattedJSON = JSON.stringify(data, null, 2);

    const _formattedJson = () => {
        if (data?.label?.includes("SG")) {
            // Filter the subnets and find the one that matches the data.id
            jsonData[0]?.VPCs[0]?.Subnets?.forEach((subnet: any) => {
                // console.log("subnets")
                if (subnet.Security_Groups[0].SG_ID) {
                    // Now, filter the Security Groups within the found subnet and match the SG_ID
                    const matchingSG = subnet.Security_Groups?.find((sg: any) => sg.SG_ID === data.id);

                    if (matchingSG) {
                        // console.log("Matching Security Group:", matchingSG);
                        formattedJSON = JSON.stringify(matchingSG, null, 2);
                    }
                }
            });
        }
    }


    _formattedJson()
    return (
        <>
            <dialog id="my_modal_3" className="modal p-4 rounded">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 border px-1 rounded">✕</button>
                    </form>
                    <h3 className="text-lg cursor-pointer p-1">copy</h3>
                    <div className="bg-black text-white p-2 rounded">
                        <pre className="py-4 whitespace-pre-wrap">{formattedJSON}</pre>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default Modal;
