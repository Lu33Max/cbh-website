import React, {
  useState,
  useEffect,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

import { BiCartAdd, BiCog } from "react-icons/bi";

import type { IGroup, INormalFilter } from "~/common/filter/filter";
import { SampleSchema } from "~/common/database/samples";
import { Colors } from "~/common/styles";
import ClickContext from "~/context/cart";
import {
  type IOptionalSample,
  type IOptionalTableSample,
  type ITableSample,
} from "~/common/types";

import Header from "./header";
import useWindowSize from "~/utils/window";
import { api } from "~/utils/api";

import SettingsContext from "~/context/settings";
import type { ImmutableObject } from "@hookstate/core";
import Image from "next/image";

type props = {
  page: number;
  pagelength: number;
  count: number | undefined;
  optionalSamples: IOptionalSample[] | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  setPagelength: Dispatch<SetStateAction<number>>;
  expert: boolean;
  filterNormal?: INormalFilter;
  filterExpert?: ImmutableObject<IGroup>;
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
  filterExpert,
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

  useEffect(() => {
    setShow(show.map(_ => false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterNormal, filterExpert , page]);

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
    // Initialize an empty array to store the new range
    const newRange = [];

    // Check if count is defined and not null
    if (count !== undefined && count !== null) {
      // Calculate the number of pages based on count and page length
      const num = Math.ceil(count / pagelength);
      
      // Loop through the calculated number of pages
      for (let i = 1; i <= num; i++) {
        // Push each page number to the new range array
        newRange.push(i);
      }
    }

    // Update the range state with the new range
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
    // Create a new array by mapping over the 'show' array
    const newArray = show.map((item, i) => {
        // If the index matches the current iteration index, toggle the value
        if (index === i) {
            return !item;
        } else {
            return item;
        }
    });

    // Update the 'show' state with the new array
    setShow(newArray);
};

  function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName];
  }

  const handleSort = (column: SampleKey) => {
    // Create a copy of the tableSamples array to avoid mutating the original array
    let sortArray: IOptionalTableSample[] = [...tableSamples];

    // Sort the copied array based on the specified column
    sortArray = sortArray.sort((a: IOptionalTableSample, b: IOptionalTableSample) => {
        // Retrieve the values of the specified column for the two samples
        const a1 = getProperty(a.data, column);
        const b1 = getProperty(b.data, column);

        // Compare the values and perform sorting
        if (a1 !== null && b1 !== null) {
            if (a1 > b1) return column == sortBy ? -1 : 1; // Sort in descending order if the column is already sorted by the same column, otherwise sort in ascending order
            else if (b1 > a1) return column == sortBy ? 1 : -1; // Sort in ascending order if the column is already sorted by the same column, otherwise sort in descending order
            return 0; // Return 0 if values are equal
        }
        return -1; // Return -1 if either value is null
    });

    // Update the tableSamples state with the sorted array
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
    // Initialize a new array to store the sorted columns
    let sortArray: string[] = [];

    // Create a copy of the input array to avoid mutating the original array
    sortArray = [...arrayToSort].sort((a: string, b: string) => {
        // Compare the indices of columns in the SampleSchema.shape object
        // Get the index of column 'a' in the SampleSchema.shape object
        const indexA = Object.getOwnPropertyNames(SampleSchema.shape).findIndex((i) => i === a);
        // Get the index of column 'b' in the SampleSchema.shape object
        const indexB = Object.getOwnPropertyNames(SampleSchema.shape).findIndex((i) => i === b);

        // Compare the indices and return the sorting order
        if (indexA > indexB)
            return 1;
        else if (indexB > indexA)
            return -1;
        return 0; // If indices are equal, maintain the order
    });

    return sortArray;
}


  function addSamplesToCart() {
    const tempArray: IOptionalTableSample[] = [];

    /*add samples to cart*/
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

  function switchBreakpoint(): string {
    breakpoint === 0 ? breakpoint = 1 : breakpoint = 0;
    return ""
  }

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
              <div className="text-center">
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
              </div>
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
                      const prop = getProperty(sample.data, column as SampleKey);
                      return (
                        <td key={i} className={`bg-gray-200`}>
                          {(!expert || (expert && settings.formatting)) &&
                            (column === "Lab_Parameter" ||
                              column === "Diagnosis" ||
                              column === "Result_Interpretation") &&
                            Array.isArray(prop)
                            ? (prop as string[]).filter((item: string) =>
                                column === "Lab_Parameter"
                                  ? filterNormal?.Lab_Parameter.value.find((val) => val === item)
                                  : column === "Diagnosis"
                                  ? filterNormal?.Diagnosis.value.find((val) => val === item)
                                  : filterNormal?.Result_Interpretation.value.find((val) => val === item)
                              )
                            : column === "Price" 
                            ? `${prop?.toString() ?? ""}${" €"}`
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
                        <Image alt="details" src="/comment-info_1.png" width={0} height={0} style={{width: "100%", height: "100%"}}></Image>
                      </button>
                    </td>
                  </tr>
                  <tr className={` ${show[index] ? "" : "hidden"}`}>
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
                              {i % 2 === breakpoint &&
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
                                          {columns[i+1]?.name && column.category === columns[i+1]?.category ? getColumnValue(sample.data, columns[i+1]?.name as string) : <>{switchBreakpoint()}</>}
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
