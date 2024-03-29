import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import { BiDetail, BiX } from "react-icons/bi";
import type { IOptionalTableSample, ITableSample } from "~/common/types";

import Header from "~/components/overall/header";
import ClickContext from "~/context/cart";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Central BioHub - Cart" />
        <link rel="icon" href="/CBH_Logo_NoText.png" />
      </Head>

      <div className="fixed max-h-full min-h-full min-w-full max-w-full overflow-hidden bg-gray-100">
        <div className="flex flex-col">
          <Header />
          <Content />
        </div>
      </div>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  // Retrieve and update cart samples from context
  const [cartSamples, setCartSamples] = useContext(ClickContext);

  // Define active columns
  const activeColumns = [
    "CBH_Donor_ID",
    "CBH_Sample_ID",
    "Matrix",
    "Quantity",
    "Unit",
    "Age",
    "Gender",
    "Price",
  ];

  // State variables
  const [sortBy, setSortBy] = useState("");
  type SampleKey = keyof ITableSample;
  const defaultShow: boolean[] = [];
  const [show, setShow] = useState<boolean[]>(defaultShow);

  // Initialize default show values
  for (let i = 0; i < cartSamples.length; i++) {
    defaultShow.push(false);
  }

  // Update show state for expanding/collapsing sample details
  const updateState = (index: number) => {
    const newArray = show.map((item, i) => {
      if (index === i) {
        return !item;
      } else {
        return item;
      }
    });
    setShow(newArray);
  };

  // Helper function to get property value from an object
  function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName];
  }

  // Delete a cart item from the cart samples
  function deleteCartItem(cartSample: ITableSample) {
    setCartSamples((current) =>
      current.filter((item) => item.data.id !== cartSample.id)
    );
  }

  // Handle sorting of cart samples
  const handleSort = (column: SampleKey) => {
    const sortArray = [...cartSamples].sort(
      (a: IOptionalTableSample, b: IOptionalTableSample) => {
        const a1 = getProperty(a.data, column);
        const b1 = getProperty(b.data, column);

        if (a1 !== null && b1 !== null) {
          if (a1 > b1) return column == sortBy ? -1 : 1;
          else if (b1 > a1) return column == sortBy ? 1 : -1;
          return 0;
        }
        return -1;
      }
    );

    setCartSamples(sortArray);
  };

  return (
    <div className="max-h-[calc(100vh-80px)] overflow-y-scroll font-poppins">
      <h1 className="mb-2 ml-5 mt-5 text-5xl text-green-900">
        <b>Cart</b>
      </h1>
      <div className="mx-4 my-5">
        {/* Display cart items */}
        {cartSamples.length > 0 ? (
          <>
            {/* Delete all button */}
            <button
              onClick={() => setCartSamples([])}
              className="relative mb-2 w-fit rounded-2xl border-2 border-black bg-red-500 px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-red-400"
            >
              delete all
            </button>

            {/* Cart table */}
            <table className="max-h-[50vh] w-full border-separate border-spacing-y-1 overflow-y-auto text-lg ">
              <thead>
                <tr className="bg-[#e0ecd4] font-extralight text-black">
                  {/* Cart column */}
                  <th className="rounded-l-xl border-r-2 border-dotted border-black py-2 font-extralight">
                    Cart
                  </th>

                  {/* Active columns */}
                  {activeColumns.map((column, i) => {
                    return (
                      <th
                        key={i}
                        className="border-r-2 border-dotted border-black py-2 font-extralight"
                      >
                        {/* Column header with sorting functionality */}
                        <button
                          onClick={() => {
                            sortBy === "" ? setSortBy(column) : setSortBy("");
                            handleSort(column as SampleKey);
                          }}
                        >
                          {column.replace(/_/g, " ")}
                        </button>
                      </th>
                    );
                  })}

                  {/* Details column */}
                  <th className="rounded-r-xl py-2 font-extralight">Details</th>
                </tr>
              </thead>
              <tbody>
                {/* Render cart samples */}
                {cartSamples.map((sample, index) => (
                  <>
                    <tr key={index} className="text-center">
                      <td className="items-center rounded-l-xl border-l-8 border-[#9DC88D] bg-gray-200 text-2xl">
                        <button onClick={() => deleteCartItem(sample.data)}>
                          <BiX className="relative top-1 rounded-lg border-2 border-[#164A41]" />
                        </button>
                      </td>

                      {/* Active columns cells */}
                      {activeColumns.map((column, i) => {
                        return (
                          <td key={i} className="bg-gray-200 px-3 py-2">
                            {/* Display property value */}
                            {getProperty(
                              sample.data,
                              column as SampleKey
                            )?.toString()}
                          </td>
                        );
                      })}

                      {/* Details cell */}
                      <td className="rounded-r-xl bg-gray-200 px-3 py-2">
                        <button
                          onClick={() => {
                            updateState(index);
                          }}
                        >
                          <BiDetail className="relative top-1" />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    <tr className={`mx-5 ${show[index] ? "" : "hidden"}`}>
                      {/* General Data */}
                      <td colSpan={2} className="bg-gray-200 px-5">
                        <div className="grid grid-cols-2">
                          <strong className="col-span-2">General Data</strong>
                          <span>CBH Master ID:</span>{" "}
                          {sample.data.CBH_Master_ID ?? "NaN"}
                          <span>Storage Temperature:</span>{" "}
                          {sample.data.Storage_Temperature ?? "NaN"}
                          <span>Freeze Thaw Cycles:</span>{" "}
                          {sample.data.Freeze_Thaw_Cycles ?? "NaN"}
                          <span>Infectious Disease Test Result:</span>{" "}
                          {sample.data.Infectious_Disease_Test_Result !==
                            null &&
                          sample.data.Infectious_Disease_Test_Result !== ""
                            ? sample.data.Infectious_Disease_Test_Result
                            : "NaN"}
                          <span>Sample Condition:</span>{" "}
                          {sample.data.Sample_Condition ?? "NaN"}
                        </div>
                      </td>

                      {/* Donor */}
                      <td
                        className="border-l-2 border-solid border-gray-300 px-2"
                        colSpan={2}
                      >
                        <div className="grid grid-cols-2 ">
                          <strong className="col-span-2">Donor</strong>
                          <span>Age:</span> {sample.data.Age ?? "NaN"}
                          <span>Gender:</span> {sample.data.Gender ?? "NaN"}
                          <span>Ethnicity:</span>{" "}
                          {sample.data.Ethnicity ?? "NaN"}
                          <strong className="col-span-2 mt-2">Ethics</strong>
                          <span>Procurement Type:</span>{" "}
                          {sample.data.Procurement_Type ?? "NaN"}
                        </div>
                      </td>

                      {/* Laboratory */}
                      <td
                        className="border-l-2 border-solid border-gray-300 px-2"
                        colSpan={2}
                      >
                        <div className="grid grid-cols-2">
                          <strong className="col-span-2">Laboratory</strong>
                          <span>Lab Parameter</span>{" "}
                          {sample.data.Lab_Parameter &&
                          sample.data.Lab_Parameter.length > 0
                            ? sample.data.Lab_Parameter.join(", ")
                            : "NaN"}
                          <span>Result Raw:</span>{" "}
                          {sample.data.Result_Raw &&
                          sample.data.Result_Raw.length > 0
                            ? sample.data.Result_Raw.join(", ")
                            : "NaN"}
                          <span>Result Unit:</span>{" "}
                          {sample.data.Result_Unit &&
                          sample.data.Result_Unit.length > 0
                            ? sample.data.Result_Unit.join(", ")
                            : "NaN"}
                          <span>Interpretation:</span>{" "}
                          {sample.data.Result_Interpretation &&
                          sample.data.Result_Interpretation.length > 0
                            ? sample.data.Result_Interpretation.join(", ")
                            : "NaN"}
                          <span>Cut Off Raw:</span>{" "}
                          {sample.data.Cut_Off_Raw
                            ? sample.data.Cut_Off_Raw.join(", ")
                            : "NaN"}
                          <span>Test Method:</span>{" "}
                          {sample.data.Test_Method &&
                          sample.data.Test_Method.length > 0
                            ? sample.data.Test_Method.join(", ")
                            : "NaN"}
                          <span>Test System:</span>{" "}
                          {sample.data.Test_System &&
                          sample.data.Test_System.length > 0
                            ? sample.data.Test_System.join(", ")
                            : "NaN"}
                          <span>Test System Manuf.:</span>{" "}
                          {sample.data.Test_System_Manufacturer &&
                          sample.data.Test_System_Manufacturer.length > 0
                            ? sample.data.Test_System_Manufacturer.join(", ")
                            : "NaN"}
                        </div>
                      </td>

                      {/* Clinical Diagnosis */}
                      <td
                        className="border-l-2 border-solid border-gray-300 px-2"
                        colSpan={4}
                      >
                        <div className="grid grid-cols-2">
                          <strong className="col-span-2">
                            Clinical Diagnosis
                          </strong>
                          <span>Diagnosis:</span>{" "}
                          {sample.data.Diagnosis &&
                          sample.data.Diagnosis.length > 0
                            ? sample.data.Diagnosis.join(", ")
                            : "NaN"}
                          <span>Diagnosis Remarks:</span>{" "}
                          {sample.data.Diagnosis_Remarks &&
                          sample.data.Diagnosis_Remarks.length > 0
                            ? sample.data.Diagnosis_Remarks.join(", ")
                            : "NaN"}
                          <span>ICD:</span>{" "}
                          {sample.data.ICD_Code &&
                          sample.data.ICD_Code.length > 0
                            ? sample.data.ICD_Code.join(", ")
                            : "NaN"}
                          <strong className="col-span-2 mt-2">
                            Preanalytics
                          </strong>
                          <span>Collection Country:</span>{" "}
                          {sample.data.Country_of_Collection ?? "NaN"}
                          <span>Collection Date:</span>{" "}
                          {sample.data.Date_of_Collection?.toDateString() ??
                            "NaN"}
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>

            {/* Delete all button */}
            <button
              onClick={() => setCartSamples([])}
              className="relative w-fit rounded-2xl bg-red-500 px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-red-400"
            >
              delete all
            </button>
          </>
        ) : (
          <h1>No samples in cart!</h1>
        )}
      </div>
    </div>
  );
};
