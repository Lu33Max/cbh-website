import React from "react"
import useWindowSize from "~/utils/window"

const Footer: React.FC = () => {
    const windowSize = useWindowSize()

    return (
        <>
            <div className="border-y-2 border-solid border-[#164A41] mt-1 text-center py-4 text-xl text-white bg-gradient-to-b from-[#164A41] to-[#9DC88D]">
                {windowSize.width && windowSize.width < 800 ? (
                    <div className="flex flex-col mb-4">
                        <h3 className="flex flex-row justify-center mb-2"><b>Company Information</b></h3>
                        <div className="flex flex-row justify-center">
                            <button className="w-[50dvw]">Terms and Conditions</button>
                            <button className="w-[50dvw]">Privacy Policy</button>
                        </div>
                        <div className="flex flex-row justify-center">
                            <button className="w-[50dvw]">Ethical Statement</button>
                            <button className="w-[50dvw]">Quality Management</button>
                        </div>
                        <h3 className="flex flex-row justify-center mt-4 mb-2"><b>Become a supplier</b></h3>
                        <div className="flex flex-row justify-center">
                            <button className="w-[50dvw]">Sell at CBH</button>
                            <button className="w-[50dvw]">Supplier Login</button>
                        </div>
                        <div className="flex flex-row justify-center">
                            <button className="w-[50dvw]">Marketing</button>
                            <button className="w-[50dvw]">Sucess Stories</button>
                        </div>
                        <h3 className="flex flex-row justify-center mt-4 mb-2"><b>Questions</b></h3>
                        <div className="flex flex-row justify-center">
                            <button className="w-[50dvw]">Shipping Information</button>
                            <button className="w-[50dvw]">Career Opportunities</button>
                        </div>
                        <div className="flex flex-row justify-center">
                            <button className="w-[50dvw]">FAQ</button>
                        </div>
                    </div>
                ) : (
                    <>
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
                        <button className="w-[50dvw] border-2 border-solid border-[#164A41] text-[#164A41] rounded-lg bg-[#FFFFFF]/[0.45] py-2 whitespace-nowrap mx-2">Contact Us!</button>
                    </>
                )}  
            </div> 

            <div className="text-center text-lg bg-[#fff] py-2">
                <label className=" flex flex-wrap justify-center">
                    <p>Central BioHub GmbH,</p>&nbsp;<p>Neuendorfstrasse 17,</p>&nbsp;<p>16761 Hennigsdorf,</p>&nbsp;<p>Germany</p>&nbsp;|&nbsp;
                    <p>Call: +49 3302 230 91 66</p>&nbsp;|&nbsp;<p>Email: info@centralbiohub.com</p>
                </label>
                <h1>
                    ©{new Date().getFullYear().toString()} www.centralbiohub.de - All Rights Reserved
                </h1>
            </div>
        </>
    )
}

export default Footer