import React from "react"

const Footer: React.FC = () => {
    return(
        <>
            <div className="border-y-2 border-solid border-[#164A41] mt-1 text-center py-4 text-xl text-white bg-gradient-to-b from-[#164A41] to-[#9DC88D]">
                <div className="flex flex-row justify-evenly w-full">
                    <div className="flex flex-col justify-start items-center gap-2">
                        <p className="mb-3"><b>Company Information</b></p>
                        <button className="">Terms and Conditions</button>
                        <button className="">Privacy Policy</button>
                        <button className="">Ethical Statement</button>
                        <button className="mb-8">Quality Management</button>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                        <p className="mb-3"><b>Questions</b></p>
                        <button className="">Shipping Information</button>
                        <button className="">Career Opportunities</button>
                        <button className="">FAQs</button>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2">
                        <p className="mb-3"><b>Become a supplier</b></p>
                        <button className="">Sell at CBH</button>
                        <button className="">Supplier Login</button>
                        <button className="">Marketing</button>
                        <button className="mb-8">Sucess Stories</button>
                    </div>
                </div>
                <button className="w-[50vw] border-2 border-solid border-[#164A41] text-[#164A41] rounded-lg bg-[#FFFFFF]/[0.45] py-2 px-40">Contact Us!</button>
            </div>

            <div className="text-center text-lg bg-[#fff] py-2">
                <h1>
                    Central BioHub GmbH, Neuendorfstrasse 17, 16761 Hennigsdorf, Germany |
                    Call: +49 3302 230 91 66 | Email: info@centralbiohub.com
                </h1>
                <h1>
                    ©{new Date().getFullYear().toString()} www.centralbiohub.de - All Rights Reserved
                </h1>
            </div>
        </>
    )
}

export default Footer