import React, {
  useState,
  useEffect,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

import { BiCartAdd, BiCog, BiInfoCircle } from "react-icons/bi";

import { type INormalFilter } from "~/common/filter/filter";
import { SampleSchema } from "~/common/database/samples";

import ClickContext from "~/context/cart";
import { Colors } from "~/common/styles";
import {
  type IOptionalSample,
  type IOptionalTableSample,
  type ITableSample,
} from "~/common/types";
import Header from "./header";
import useWindowSize from "~/utils/window";
import { api } from "~/utils/api";
import SettingsContext from "~/context/settings";

type props = {
  page: number;
  pagelength: number;
  count: number | undefined;
  optionalSamples: IOptionalSample[] | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  setPagelength: Dispatch<SetStateAction<number>>;
  expert: boolean;
  filterNormal?: INormalFilter;
};

const Table: React.FC<props> = ({
  page,
  pagelength,
  count,
  optionalSamples,
  setPage,
  setPagelength,
  expert,
  filterNormal,
}) => {
  const [cartSamples, setCartSamples] = useContext(ClickContext);
  const [range, setRange] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [showPage, setShowPage] = useState(page);
  const [samplesToAdd, setSamplesToAdd] = useState(0);

  const defaultShow: boolean[] = [];
  const [show, setShow] = useState<boolean[]>(defaultShow);

  const [tableSamples, setTableSamples] = useState<IOptionalTableSample[]>([]);
  type SampleKey = keyof ITableSample;

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useContext(SettingsContext)

  /*
  const [formatting, setFormatting] = useState<boolean>(false);

  
  
  const [activeColumns, setActiveColumns] = useState<string[]>(defaultColumns);
  const [bufferColumns, setBufferColumns] = useState<string[]>(defaultColumns);
  */

  const defaultColumns = [
    "CBH_Donor_ID",
    "CBH_Sample_ID",
    "Matrix",
    "Quantity",
    "Unit",
    "Age",
    "Gender",
    "Price",
  ];

  const [filterState, setFilterState] = useState(filterNormal);

  const windowSize = useWindowSize();

  const { data: columns } = api.columns.getAll.useQuery();

  let breakpoint = 0;

  for (let i = 0; i < pagelength; i++) {
    defaultShow.push(false);
  }

  useEffect(() => {
    setShowPage(page);
    setShow(defaultShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setFilterState(filterNormal);
  }, [filterNormal]);

  // Define a useEffect hook that triggers when the filterState variable changes
  useEffect(() => {
    // Check if filterState is not undefined
    if (filterState !== undefined) {
      let tempBuffer = [...settings.activeColumns];
      let count = 0;

      // Remove specific items from tempBuffer (excluding "Gender", "Age", and "CBH_Donor_ID")
      tempBuffer = tempBuffer.filter(
        (item) => item !== "Gender" && item !== "Age" && item !== "CBH_Donor_ID"
      );

      // Check if filterState.Lab_Parameter has a value
      if (
        filterState.Lab_Parameter &&
        filterState.Lab_Parameter.value.length > 0
      ) {
        // If "Lab_Parameter" is not in activeColumns, add it to tempBuffer
        if (!settings.activeColumns.find((item) => item === "Lab_Parameter")) {
          tempBuffer.push("Lab_Parameter");
        }
        count++;
      } else {
        // If "Lab_Parameter" doesn't have a value, remove it from tempBuffer
        tempBuffer = tempBuffer.filter((item) => item !== "Lab_Parameter");
      }

      // Check if filterState.Result_Interpretation has a value
      if (
        filterState.Result_Interpretation &&
        filterState.Result_Interpretation.value.length > 0
      ) {
        // If "Result_Interpretation" is not in activeColumns, add it to tempBuffer
        if (!settings.activeColumns.find((item) => item === "Result_Interpretation")) {
          tempBuffer.push("Result_Interpretation");
        }
        count++;
      } else {
        // If "Result_Interpretation" doesn't have a value, remove it from tempBuffer
        tempBuffer = tempBuffer.filter(
          (item) => item !== "Result_Interpretation"
        );
      }

      // Check if filterState.Diagnosis has a value
      if (filterState.Diagnosis && filterState.Diagnosis.value.length > 0) {
        // If "Diagnosis" is not in activeColumns, add it to tempBuffer
        if (!settings.activeColumns.find((item) => item === "Diagnosis")) {
          tempBuffer.push("Diagnosis");
        }
        count++;
      } else {
        // If "Diagnosis" doesn't have a value, remove it from tempBuffer
        tempBuffer = tempBuffer.filter((item) => item !== "Diagnosis");
      }

      // Update tempBuffer based on the count
      switch (count) {
        case 0:
          // If count is 0, add "Gender", "Age", and "CBH_Donor_ID" to tempBuffer if they're not already present
          if (!tempBuffer.find((col) => col === "Gender")) {
            tempBuffer.push("Gender");
          }
          if (!tempBuffer.find((col) => col === "Age")) {
            tempBuffer.push("Age");
          }
          if (!tempBuffer.find((col) => col === "CBH_Donor_ID")) {
            tempBuffer.push("CBH_Donor_ID");
          }
          break;
        case 1:
          // If count is 1, add "Age" and "CBH_Donor_ID" to tempBuffer if they're not already present
          if (!tempBuffer.find((col) => col === "Age")) {
            tempBuffer.push("Age");
          }
          if (!tempBuffer.find((col) => col === "CBH_Donor_ID")) {
            tempBuffer.push("CBH_Donor_ID");
          }
          break;
        case 2:
          // If count is 2, add "CBH_Donor_ID" to tempBuffer if it's not already present
          if (!tempBuffer.find((col) => col === "CBH_Donor_ID")) {
            tempBuffer.push("CBH_Donor_ID");
          }
          break;
        default:
          break;
      }

      setSettings({formatting: settings.formatting, activeColumns: sortColumns(tempBuffer)});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState]);

  useEffect(() => {
    const newRange = [];
    if (count !== undefined && count !== null) {
      const num = Math.ceil(count / pagelength);
      for (let i = 1; i <= num; i++) {
        newRange.push(i);
      }
    }
    setRange(newRange);
  }, [count, pagelength]);

  useEffect(() => {

    const newShow: boolean[] = [];
    for (let i = 0; i < pagelength; i++) {
      newShow.push(false);
    }
    setShow(newShow);
  }, [pagelength]);

  // Define a useEffect hook that triggers when the optionalSamples variable changes
  useEffect(() => {
    // Create a new array to store the modified data
    const newArray: IOptionalTableSample[] = [];

    // Check if optionalSamples is not undefined
    if (optionalSamples !== undefined) {
      // Iterate over each sample in optionalSamples
      optionalSamples.forEach((sample) => {
        // Check if the sample with the same CBH_Sample_ID already exists in the newArray
        if (
          newArray.find(
            (arraySample) =>
              arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID
          )
        ) {
          // Get the index of the existing sample in newArray
          const sampleIndex = newArray.findIndex(
            (arraySample) =>
              arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID
          );

          // Update the arrays in the existing sample based on specific conditions
          if (
            sample.data.Lab_Parameter &&
            !newArray[sampleIndex]?.data.Lab_Parameter?.find(
              (item) => item === sample.data.Lab_Parameter
            )
          )
            newArray[sampleIndex]?.data.Lab_Parameter?.push(
              sample.data.Lab_Parameter
            );
          if (
            sample.data.Result_Interpretation &&
            !newArray[sampleIndex]?.data.Result_Interpretation?.find(
              (item) => item === sample.data.Result_Interpretation
            )
          )
            newArray[sampleIndex]?.data.Result_Interpretation?.push(
              sample.data.Result_Interpretation
            );
          if (
            sample.data.Result_Raw &&
            !newArray[sampleIndex]?.data.Result_Raw?.find(
              (item) => item === sample.data.Result_Raw
            )
          )
            newArray[sampleIndex]?.data.Result_Raw?.push(
              sample.data.Result_Raw
            );
          if (
            sample.data.Result_Numerical &&
            !newArray[sampleIndex]?.data.Result_Numerical?.find(
              (item) => item === sample.data.Result_Numerical
            )
          )
            newArray[sampleIndex]?.data.Result_Numerical?.push(
              sample.data.Result_Numerical ?? 0
            );
          if (
            sample.data.Result_Unit &&
            !newArray[sampleIndex]?.data.Result_Unit?.find(
              (item) => item === sample.data.Result_Unit
            )
          )
            newArray[sampleIndex]?.data.Result_Unit?.push(
              sample.data.Result_Unit
            );
          if (
            sample.data.Cut_Off_Raw &&
            !newArray[sampleIndex]?.data.Cut_Off_Raw?.find(
              (item) => item === sample.data.Cut_Off_Raw
            )
          )
            newArray[sampleIndex]?.data.Cut_Off_Raw?.push(
              sample.data.Cut_Off_Raw
            );
          if (
            sample.data.Cut_Off_Numerical &&
            !newArray[sampleIndex]?.data.Cut_Off_Numerical?.find(
              (item) => item === sample.data.Cut_Off_Numerical
            )
          )
            newArray[sampleIndex]?.data.Cut_Off_Numerical?.push(
              sample.data.Cut_Off_Numerical ?? 0
            );
          if (
            sample.data.Test_Method &&
            !newArray[sampleIndex]?.data.Test_Method?.find(
              (item) => item === sample.data.Test_Method
            )
          )
            newArray[sampleIndex]?.data.Test_Method?.push(
              sample.data.Test_Method
            );
          if (
            sample.data.Test_System &&
            !newArray[sampleIndex]?.data.Test_System?.find(
              (item) => item === sample.data.Test_System
            )
          )
            newArray[sampleIndex]?.data.Test_System?.push(
              sample.data.Test_System
            );
          if (
            sample.data.Test_System_Manufacturer &&
            !newArray[sampleIndex]?.data.Test_System_Manufacturer?.find(
              (item) => item === sample.data.Test_System_Manufacturer
            )
          )
            newArray[sampleIndex]?.data.Test_System_Manufacturer?.push(
              sample.data.Test_System_Manufacturer
            );
          if (
            sample.data.Result_Obtained_From &&
            !newArray[sampleIndex]?.data.Result_Obtained_From?.find(
              (item) => item === sample.data.Result_Obtained_From
            )
          )
            newArray[sampleIndex]?.data.Result_Obtained_From?.push(
              sample.data.Result_Obtained_From
            );
          if (
            sample.data.Diagnosis &&
            !newArray[sampleIndex]?.data.Diagnosis?.find(
              (item) => item === sample.data.Diagnosis
            )
          )
            newArray[sampleIndex]?.data.Diagnosis?.push(sample.data.Diagnosis);
          if (
            sample.data.Diagnosis_Remarks &&
            !newArray[sampleIndex]?.data.Diagnosis_Remarks?.find(
              (item) => item === sample.data.Diagnosis_Remarks
            )
          )
            newArray[sampleIndex]?.data.Diagnosis_Remarks?.push(
              sample.data.Diagnosis_Remarks
            );
          if (
            sample.data.ICD_Code &&
            !newArray[sampleIndex]?.data.ICD_Code?.find(
              (item) => item === sample.data.ICD_Code
            )
          )
            newArray[sampleIndex]?.data.ICD_Code?.push(sample.data.ICD_Code);
          if (
            sample.data.Medication &&
            !newArray[sampleIndex]?.data.Medication?.find(
              (item) => item === sample.data.Medication
            )
          )
            newArray[sampleIndex]?.data.Medication?.push(
              sample.data.Medication
            );
          if (
            sample.data.Therapy &&
            !newArray[sampleIndex]?.data.Therapy?.find(
              (item) => item === sample.data.Therapy
            )
          )
            newArray[sampleIndex]?.data.Therapy?.push(sample.data.Therapy);
          if (
            sample.data.Histological_Diagnosis &&
            !newArray[sampleIndex]?.data.Histological_Diagnosis?.find(
              (item) => item === sample.data.Histological_Diagnosis
            )
          )
            newArray[sampleIndex]?.data.Histological_Diagnosis?.push(
              sample.data.Histological_Diagnosis
            );
          if (
            sample.data.Other_Gene_Mutations &&
            !newArray[sampleIndex]?.data.Other_Gene_Mutations?.find(
              (item) => item === sample.data.Other_Gene_Mutations
            )
          )
            newArray[sampleIndex]?.data.Other_Gene_Mutations?.push(
              sample.data.Other_Gene_Mutations
            );
        } else {
          // If the sample doesn't exist in newArray, add it as a new entry
          newArray.push({
            optional: sample.optional,
            data: {
              // Assign the data properties from the sample to the new entry
              id: sample.data.id,
              CBH_Donor_ID: sample.data.CBH_Donor_ID,
              CBH_Master_ID: sample.data.CBH_Master_ID,
              CBH_Sample_ID: sample.data.CBH_Sample_ID,
              Price: sample.data.Price,
              Quantity: sample.data.Quantity,
              Unit: sample.data.Unit,
              Matrix: sample.data.Matrix,
              Storage_Temperature: sample.data.Storage_Temperature,
              Freeze_Thaw_Cycles: sample.data.Freeze_Thaw_Cycles,
              Sample_Condition: sample.data.Sample_Condition,
              Infectious_Disease_Test_Result:
                sample.data.Infectious_Disease_Test_Result,
              Gender: sample.data.Gender,
              Age: sample.data.Age,
              Ethnicity: sample.data.Ethnicity,
              BMI: sample.data.BMI,
              Lab_Parameter: sample.data.Lab_Parameter
                ? [sample.data.Lab_Parameter]
                : [],
              Result_Interpretation: sample.data.Result_Interpretation
                ? [sample.data.Result_Interpretation]
                : [],
              Result_Raw: sample.data.Result_Raw
                ? [sample.data.Result_Raw]
                : [],
              Result_Numerical: sample.data.Result_Numerical
                ? [sample.data.Result_Numerical ?? 0]
                : [],
              Result_Unit: sample.data.Result_Unit
                ? [sample.data.Result_Unit]
                : [],
              Cut_Off_Raw: sample.data.Cut_Off_Raw
                ? [sample.data.Cut_Off_Raw]
                : [],
              Cut_Off_Numerical: sample.data.Cut_Off_Numerical
                ? [sample.data.Cut_Off_Numerical ?? 0]
                : [],
              Test_Method: sample.data.Test_Method
                ? [sample.data.Test_Method]
                : [],
              Test_System: sample.data.Test_System
                ? [sample.data.Test_System]
                : [],
              Test_System_Manufacturer: sample.data.Test_System_Manufacturer
                ? [sample.data.Test_System_Manufacturer]
                : [],
              Result_Obtained_From: sample.data.Result_Obtained_From
                ? [sample.data.Result_Obtained_From]
                : [],
              Diagnosis: sample.data.Diagnosis ? [sample.data.Diagnosis] : [],
              Diagnosis_Remarks: sample.data.Diagnosis_Remarks
                ? [sample.data.Diagnosis_Remarks]
                : [],
              ICD_Code: sample.data.ICD_Code ? [sample.data.ICD_Code] : [],
              Pregnancy_Week: sample.data.Pregnancy_Week,
              Pregnancy_Trimester: sample.data.Pregnancy_Trimester,
              Medication: sample.data.Medication
                ? [sample.data.Medication]
                : [],
              Therapy: sample.data.Therapy ? [sample.data.Therapy] : [],
              Histological_Diagnosis: sample.data.Histological_Diagnosis
                ? [sample.data.Histological_Diagnosis]
                : [],
              Organ: sample.data.Organ,
              Disease_Presentation: sample.data.Disease_Presentation,
              TNM_Class_T: sample.data.TNM_Class_T,
              TNM_Class_N: sample.data.TNM_Class_N,
              TNM_Class_M: sample.data.TNM_Class_M,
              Tumour_Grade: sample.data.Tumour_Grade,
              Tumour_Stage: sample.data.Tumour_Stage,
              Viable_Cells__per_: sample.data.Viable_Cells__per_,
              Necrotic_Cells__per_: sample.data.Necrotic_Cells__per_,
              Tumour_Cells__per_: sample.data.Tumour_Cells__per_,
              Proliferation_Rate__Ki67_per_:
                sample.data.Proliferation_Rate__Ki67_per_,
              Estrogen_Receptor: sample.data.Estrogen_Receptor,
              Progesteron_Receptor: sample.data.Progesteron_Receptor,
              HER_2_Receptor: sample.data.HER_2_Receptor,
              Other_Gene_Mutations: sample.data.Other_Gene_Mutations
                ? [sample.data.Other_Gene_Mutations]
                : [],
              Country_of_Collection: sample.data.Country_of_Collection,
              Date_of_Collection: sample.data.Date_of_Collection,
              Procurement_Type: sample.data.Procurement_Type,
              Informed_Consent: sample.data.Informed_Consent,
            },
          });
        }
      });
    }

    // Update the tableSamples state with the modified newArray
    setTableSamples(newArray);
  }, [optionalSamples]);

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

  const handleSort = (column: SampleKey) => {
    let sortArray: IOptionalTableSample[] = [];

    sortArray = [...tableSamples].sort(
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

    setTableSamples(sortArray);
  };

  function showColumns(column: string): void {
    if (settings.activeColumns.find((c) => c === column)) {
      setSettings({formatting: settings.formatting, activeColumns: sortColumns(settings.activeColumns.filter((c) => c !== column))});
    } else {
      setSettings({activeColumns: sortColumns([...settings.activeColumns, column]), formatting: settings.formatting});
    }
  }

  function sortColumns(arrayToSort: string[]): string[] {
    let sortArray: string[] = [];

    sortArray = [...arrayToSort].sort((a: string, b: string) => {
      if (
        Object.getOwnPropertyNames(SampleSchema.shape).findIndex(
          (i) => i === a
        ) >
        Object.getOwnPropertyNames(SampleSchema.shape).findIndex((i) => i === b)
      )
        return 1;
      else if (
        Object.getOwnPropertyNames(SampleSchema.shape).findIndex(
          (i) => i === b
        ) >
        Object.getOwnPropertyNames(SampleSchema.shape).findIndex((i) => i === a)
      )
        return -1;
      return 0;
    });

    return sortArray
  }

  function addSamplesToCart() {
    const tempArray: IOptionalTableSample[] = [];

    {
      /*add samples to cart*/
    }
    for (let i = 0; i < samplesToAdd; i++) {
      const tempSample = tableSamples[i];
      if (tempSample) {
        tempArray.push(tempSample);
      }
    }
    setCartSamples([...cartSamples, ...tempArray]);
  }

  function getColumnValue(sample: ITableSample, column: string) {
    const value = getProperty(sample, column as keyof typeof sample);
    if (value !== null && value !== undefined) {
      return value.toString();
    }
    return "nothing";
  }

  const settingsButton: React.ReactNode = (
    <>
      {expert && windowSize.width && windowSize.width > 600 && (
        <button className="mx-3 text-xl" onClick={() => setShowSettings(!showSettings)}>
          <BiCog />
        </button>
      )}
    </>
  );

  return (
    <>
      <div className="my-5 font-poppins">
        <Header
          count={count}
          pagelength={pagelength}
          range={range}
          showPage={showPage}
          setPage={setPage}
          setPagelength={setPagelength}
          setSamplesToAdd={setSamplesToAdd}
          addSamplesToCart={addSamplesToCart}
        >
          {settingsButton}
        </Header>
        <div className="mb-6 px-16">
          {/*settings*/}
          {showSettings && (
            <div className="my-3">
              <h1 className={`text-2xl text-[${Colors.dark}]`}><b>SETTINGS</b></h1>
              <label className={`text-2xl text-[${Colors.dark}] mb-2`}>auto-formatting</label>
              <input
                type="checkbox"
                onChange={() => setSettings({formatting: !settings.formatting, activeColumns: settings.activeColumns})}
                checked={settings.formatting}
                className="ml-2 mr-5"
              ></input>
              <button
                onClick={() => {
                  setSettings({formatting: settings.formatting, activeColumns: sortColumns(defaultColumns)});
                }}
                className="w-[10rem] rounded-2xl border-2 border-solid border-orange-300 bg-orange-300 px-4 py-1 text-center text-lg text-white mb-2"
              >
                <b>
                  RESET
                </b>
              </button>
              <br />
              {Object.getOwnPropertyNames(tableSamples[0]?.data).map(
                (name, i) => {
                  if (name !== "id") {
                    return (
                      <button
                        key={i}
                        onClick={() => showColumns(name)}
                        disabled={settings.formatting}
                        className={`mx-2 my-1 rounded-2xl p-2 ${
                          settings.activeColumns.find((c) => c === name)
                            ? `bg-[${Colors.light_light}]`
                            : "bg-white border-solid border-2 border-gray-300"
                        }`}
                      >
                        {name.replace(/_/g, " ")}
                      </button>
                    );
                  }
                }
              )}
              <br />
            </div>
          )}
        </div>
        <div
          className={`${
            windowSize.width && windowSize.width < 1000
              ? "max-w-[95dvw] overflow-x-auto"
              : "w-full"
          }`}
        >
          {/*table with samples*/}
          <table
            className={`w-full border-separate border-spacing-y-1 overflow-y-auto text-lg`}
          >
            <thead>
              <tr
                className={`bg-[${Colors.light_light}] font-extralight text-black`}
              >
                <th
                  className={`rounded-l-xl border-dotted px-2 py-4 font-extralight border-[${Colors.dark}] border-r-[1px]`}
                >
                  Cart
                </th>
                {settings.activeColumns.map((column, i) => {
                  return (
                    <th
                      key={i}
                      className="whitespace-nowrap border-r-[1px] border-dotted border-black px-2 py-4 font-extralight"
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
                <th className="rounded-r-xl px-2 py-4 font-extralight">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {tableSamples.map((sample, index) => (
                <>
                  <tr key={index} className="text-center">
                    <td
                      className={`items-center rounded-l-xl bg-gray-200 text-2xl ${
                        sample.optional ? `border-l-8 border-[#9DC88D]` : ""
                      }`}
                      onClick={() => setCartSamples([...cartSamples, sample])}
                    >
                      <button>
                        <BiCartAdd className="relative top-1 active:bg-[#aabda3]" />
                      </button>
                    </td>

                    {settings.activeColumns.map((column, i) => {
                      const prop = getProperty(
                        sample.data,
                        column as SampleKey
                      );
                      return (
                        <td key={i} className={`bg-gray-200`}>
                          {(!expert || (expert && settings.formatting)) &&
                          (column === "Lab_Parameter" ||
                            column === "Diagnosis" ||
                            column === "Result_Interpretation") &&
                          Array.isArray(prop)
                            ? (prop as string[]).filter((item: string) =>
                                column === "Lab_Parameter"
                                  ? filterNormal?.Lab_Parameter.value.find(
                                      (val) => val === item
                                    )
                                  : column === "Diagnosis"
                                  ? filterNormal?.Diagnosis.value.find(
                                      (val) => val === item
                                    )
                                  : filterNormal?.Result_Interpretation.value.find(
                                      (val) => val === item
                                    )
                              )
                            : prop?.toString()}
                        </td>
                      );
                    })}
                    <td className={`rounded-r-xl bg-gray-200 px-3 py-2`}>
                      <button
                        onClick={() => {
                          updateState(index);
                        }}
                      >
                        <img src="/comment-info_1.png"></img>
                      </button>
                    </td>
                  </tr>
                  <tr className={` ${show[index] ? "" : "hidden"}`}>
                    <>{console.log(columns)}</>
                    <td colSpan={settings.activeColumns.length + 2}>
                      {columns?.map((column, i, columns) => {
                        return (
                          <>
                          <table className="w-full">
                          {(i === 0 || column.category !== columns[i - 1]?.category) && (
                            <thead>
                                <tr>
                                  
                                    <th  className=" text-left bg-[#D8E9D1] rounded-2xl" colSpan={4}>
                                        
                                            <h2 className="mx-3">
                                                <b>{column.category}</b>
                                            </h2>
                                        
                                    </th>
                                </tr>
                            </thead>
                          )}
                            { i % 2 === breakpoint &&
                            <tbody className="rounded-xl">
                                <tr>
                                    <td className=" w-1/4 bg-gray-100 border-r-gray-500 border-r-2 border-b-gray-300 border-b-4 text-center border-l-2 rounded-l-xl">
                                      {column.name.replaceAll("_"," ")}
                                    </td>
                                    <td className="w-1/4 bg-gray-200 border-b-gray-300 border-b-4 text-center">
                                      {getColumnValue(sample.data, column.name)}
                                    </td>                                    
                                    <td className=" w-1/4 bg-gray-100  border-r-gray-500 border-r-2 border-b-gray-300 border-b-4 text-center">                                      
                                      {column.category === columns[i+1]?.category ? columns[i+1]?.name.replaceAll("_"," ") : ""}
                                    </td>
                                    <td className="w-1/4 bg-gray-200  border-b-gray-300 border-b-4  text-center rounded-r-xl">
                                      {columns[i+1]?.name && column.category === columns[i+1]?.category ? getColumnValue(sample.data, columns[i+1]?.name as string): (breakpoint === 0 ? breakpoint = 1 : breakpoint = 0)}
                                    </td>                                    
                                </tr>
                            </tbody>
                            }
                          </table>
                          </>
                        );
                      })}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Header
        count={count}
        pagelength={pagelength}
        range={range}
        showPage={showPage}
        setPage={setPage}
        setPagelength={setPagelength}
        setSamplesToAdd={setSamplesToAdd}
        addSamplesToCart={addSamplesToCart}
      />
    </>
  );
};

export default Table;
