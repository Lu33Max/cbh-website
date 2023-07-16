import { type NextPage } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import { BiDetail, BiX } from "react-icons/bi";
import { type IOptionalTableSample, type ITableSample } from "~/common/types";

import Header from "~/components/overall/header";
import ClickContext from "~/context/click";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
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
  const [cartSamples, setCartSamples] = useContext(ClickContext);
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
  const [sortBy, setSortBy] = useState("");
  type SampleKey = keyof ITableSample;
  const defaultShow: boolean[] = [];
  const [show, setShow] = useState<boolean[]>(defaultShow);

  for (let i = 0; i < cartSamples.length; i++) {
    defaultShow.push(false);
  }

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

  function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName];
  }

  function deleteCartItem(cartSample: ITableSample) {
    setCartSamples((current) =>
      current.filter((item) => item.data.id !== cartSample.id)
    );
  }

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
        {cartSamples.length > 0 ? (
          <>
            <button
              onClick={() => setCartSamples([])}
              className="relative mb-2 w-fit rounded-2xl border-2 border-black bg-red-500 px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-red-400"
            >
              delete all
            </button>
            <table className="max-h-[50vh] w-full border-separate border-spacing-y-1 overflow-y-auto text-lg ">
              <thead>
                <tr className="bg-[#e0ecd4] font-extralight text-black">
                  <th className="rounded-l-xl border-r-2 border-dotted border-black py-2 font-extralight">
                    Cart
                  </th>
                  {activeColumns.map((column, i) => {
                    return (
                      <th
                        key={i}
                        className="border-r-2 border-dotted border-black py-2 font-extralight"
                      >
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
                  <th className="rounded-r-xl py-2 font-extralight">Details</th>
                </tr>
              </thead>
              <tbody>
                {cartSamples.map((sample, index) => (
                  <>
                    <tr key={index} className="text-center">
                      <td className="items-center rounded-l-xl border-l-8 border-[#9DC88D] bg-gray-200 text-2xl">
                        <button onClick={() => deleteCartItem(sample.data)}>
                          <BiX className="relative top-1 rounded-lg border-2 border-[#164A41]" />
                        </button>
                      </td>
                      {activeColumns.map((column, i) => {
                        return (
                          <td key={i} className="bg-gray-200 px-3 py-2">
                            {getProperty(
                              sample.data,
                              column as SampleKey
                            )?.toString()}
                          </td>
                        );
                      })}
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
                    <tr className={`mx-5 ${show[index] ? "" : "hidden"}`}>
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
