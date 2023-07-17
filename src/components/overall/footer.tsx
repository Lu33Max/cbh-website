import React from "react";
import useWindowSize from "~/utils/window";

const Footer: React.FC = () => {
  const windowSize = useWindowSize();

  return (
    <>
    {/*Information that can be found at the bottom of the page*/}
      <div className="mt-1 border-y-2 border-solid border-[#164A41] bg-gradient-to-b from-[#164A41] to-[#9DC88D] py-4 text-center text-xl text-white">
        {windowSize.width && windowSize.width < 800 ? (
          <div className="mb-4 flex flex-col">
            <h3 className="mb-2 flex flex-row justify-center">
              <b>Company Information</b>
            </h3>
            <div className="flex flex-row justify-center">
              <button className="w-[50dvw]">Terms and Conditions</button>
              <button className="w-[50dvw]">Privacy Policy</button>
            </div>
            <div className="flex flex-row justify-center">
              <button className="w-[50dvw]">Ethical Statement</button>
              <button className="w-[50dvw]">Quality Management</button>
            </div>
            <h3 className="mb-2 mt-4 flex flex-row justify-center">
              <b>Become a supplier</b>
            </h3>
            <div className="flex flex-row justify-center">
              <button className="w-[50dvw]">Sell at CBH</button>
              <button className="w-[50dvw]">Supplier Login</button>
            </div>
            <div className="flex flex-row justify-center">
              <button className="w-[50dvw]">Marketing</button>
              <button className="w-[50dvw]">Sucess Stories</button>
            </div>
            <h3 className="mb-2 mt-4 flex flex-row justify-center">
              <b>Questions</b>
            </h3>
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
            <div className="flex w-full flex-row justify-evenly">
              <div className="flex flex-col items-center justify-start gap-2">
                <p className="mb-3">
                  <b>Company Information</b>
                </p>
                <button className="">Terms and Conditions</button>
                <button className="">Privacy Policy</button>
                <button className="">Ethical Statement</button>
                <button className="mb-8">Quality Management</button>
              </div>
              <div className="flex flex-col items-center justify-start gap-2">
                <p className="mb-3">
                  <b>Questions</b>
                </p>
                <button className="">Shipping Information</button>
                <button className="">Career Opportunities</button>
                <button className="">FAQs</button>
              </div>
              <div className="flex flex-col items-center justify-start gap-2">
                <p className="mb-3">
                  <b>Become a supplier</b>
                </p>
                <button className="">Sell at CBH</button>
                <button className="">Supplier Login</button>
                <button className="">Marketing</button>
                <button className="mb-8">Sucess Stories</button>
              </div>
            </div>
            <button className="mx-2 w-[50dvw] whitespace-nowrap rounded-lg border-2 border-solid border-[#164A41] bg-[#FFFFFF]/[0.45] py-2 text-[#164A41]">
              Contact Us!
            </button>
          </>
        )}
      </div>

      {/*address and contact information*/}
      <div className="bg-[#fff] py-2 text-center text-lg">
        <label className=" flex flex-wrap justify-center">
          <p>Central BioHub GmbH,</p>&nbsp;<p>Neuendorfstrasse 17,</p>&nbsp;
          <p>16761 Hennigsdorf,</p>&nbsp;<p>Germany</p>&nbsp;|&nbsp;
          <p>Call: +49 3302 230 91 66</p>&nbsp;|&nbsp;
          <p>Email: info@centralbiohub.com</p>
        </label>
        <h1>
          ©{new Date().getFullYear().toString()} www.centralbiohub.de - All
          Rights Reserved
        </h1>
      </div>
    </>
  );
};

export default Footer;
