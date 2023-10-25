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

import ClickContext from "~/context/click";
import { Colors } from "~/common/styles";
import {
  type IOptionalSample,
  type IOptionalTableSample,
  type ITableSample,
} from "~/common/types";
import Header from "./header";
import useWindowSize from "~/utils/window";
import { api } from "~/utils/api";
import { array, object } from "zod";

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

export const ExampleSample: ITableSample = {
  id: "",
  CBH_Donor_ID:                   "",
  CBH_Master_ID:                  "",
  CBH_Sample_ID:                  "",
  Price:                          0,
  Quantity:                       0,
  Unit:                           "",
  Matrix:                         "",
  Storage_Temperature:            "",
  Freeze_Thaw_Cycles:             0,
  Sample_Condition:               "",
  Infectious_Disease_Test_Result: "",
  Gender:                         "",
  Age:                            0,
  Ethnicity:                      "",
  BMI:                            0,
  Lab_Parameter:                  [],
  Result_Interpretation:          [],
  Result_Raw:                     [],
  Result_Numerical:               [],
  Result_Unit:                    [],
  Cut_Off_Raw:                    [],
  Cut_Off_Numerical:              [],
  Test_Method:                    [],
  Test_System:                    [],
  Test_System_Manufacturer:       [],
  Result_Obtained_From:           [],
  Diagnosis:                      [],
  Diagnosis_Remarks:              [],
  ICD_Code:                       [],
  Pregnancy_Week:                 0,
  Pregnancy_Trimester:            "",
  Medication:                     [],
  Therapy:                        [],
  Histological_Diagnosis:         [],
  Organ:                          "",
  Disease_Presentation:           "",
  TNM_Class_T:                    "",
  TNM_Class_N:                    "",
  TNM_Class_M:                    "",
  Tumour_Grade:                   "",
  Tumour_Stage:                   "",
  Viable_Cells__per_:             "",
  Necrotic_Cells__per_:           "",
  Tumour_Cells__per_:             "",
  Proliferation_Rate__Ki67_per_:  "",
  Estrogen_Receptor:              "",
  Progesteron_Receptor:           "",
  HER_2_Receptor:                 "",
  Other_Gene_Mutations:           [],
  Country_of_Collection:          "",
  Date_of_Collection:             new Date(),
  Procurement_Type:               "",
  Informed_Consent:               "",
}

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

  const [settings, setSettings] = useState<boolean>(false);
  const [formatting, setFormatting] = useState<boolean>(false);

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
  const [activeColumns, setActiveColumns] = useState<string[]>(defaultColumns);
  const [bufferColumns, setBufferColumns] = useState<string[]>(defaultColumns);
  const [filterState, setFilterState] = useState(filterNormal);

  const windowSize = useWindowSize();

  const { data: columns } = api.columns.getAll.useQuery();

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
      let tempBuffer = [...bufferColumns];
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
        if (!activeColumns.find((item) => item === "Lab_Parameter")) {
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
        if (!activeColumns.find((item) => item === "Result_Interpretation")) {
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
        if (!activeColumns.find((item) => item === "Diagnosis")) {
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

      setBufferColumns(tempBuffer);
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

useEffect(() => {
  if (optionalSamples === undefined) return;

  // Erstellen Sie ein neues Array, um die modifizierten Daten zu speichern
  const newArray: IOptionalTableSample[] = [];

  optionalSamples.forEach((sample) => {
    const existingSample = newArray.find((arraySample) =>
      arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID
    );

    if (existingSample) {
      // Update mehrwertige Eigenschaften
      const multiValueProps: (keyof IOptionalTableSample['data'])[] = [
        'Lab_Parameter',
        'Result_Interpretation',
        // ...
        'Other_Gene_Mutations',
      ];

      multiValueProps.forEach((prop) => {
        if (Array.isArray(existingSample.data[prop]) && typeof sample.data[prop] !== 'undefined' && typeof sample.data[prop] !== null && (typeof sample.data[prop] === 'string' && sample.data[prop] !== '')) {
          // Wenn beide Arrays sind, fügen Sie sie zusammen
          //@ts-ignore
          existingSample.data[prop] = existingSample.data[prop].push(sample.data[prop]);
        }
      });
    } else {
      let newTablesample = ExampleSample;

      Object.getOwnPropertyNames(newTablesample).forEach(prop => {
        if (Array.isArray(getProperty(newTablesample, prop as keyof typeof newTablesample))) {
          newTablesample[prop as keyof typeof newTablesample].push(sample.data[prop as keyof typeof sample.data])
        } else {
          if (typeof newTablesample[prop as keyof typeof newTablesample] === typeof sample.data[prop as keyof typeof sample.data]) {
            newTablesample[prop as keyof typeof newTablesample] = sample.data[prop as keyof typeof sample.data]
          }          
        }
      })

      // Hinzufügen eines neuen Eintrags, falls der Sample nicht existiert
      newArray.push({
        optional: sample.optional,
        data: {
          ...newTablesample,
        },
      });
    }
  });

  // Aktualisieren Sie den tableSamples-Zustand mit dem modifizierten newArray
  setTableSamples(newArray);
}, [optionalSamples]);

  useEffect(() => {
    void sortColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bufferColumns]);

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
    if (bufferColumns.find((c) => c === column)) {
      setBufferColumns(bufferColumns.filter((c) => c !== column));
    } else {
      setBufferColumns([...bufferColumns, column]);
    }
  }

  function sortColumns() {
    let sortArray: string[] = [];

    {
      /*sort the columns*/
    }
    sortArray = [...bufferColumns].sort((a: string, b: string) => {
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

    setActiveColumns(sortArray);
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
        <button className="mx-3 text-xl" onClick={() => setSettings(!settings)}>
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
          {settings && (
            <div className="my-3">
              <h1 className="text-2xl">Settings</h1>
              <label>Auto-Formatting: </label>
              <input
                type="checkbox"
                onChange={() => setFormatting(!formatting)}
                checked={formatting}
              ></input>
              <button
                onClick={() => {
                  setActiveColumns(defaultColumns);
                  setBufferColumns(defaultColumns);
                }}
                className="w-[10rem] rounded-2xl border-2 border-solid border-orange-300 bg-orange-300 px-4 py-1 text-center text-lg text-white"
              >
                Reset
              </button>
              <br />
              {Object.getOwnPropertyNames(tableSamples[0]?.data).map(
                (name, i) => {
                  if (name !== "id") {
                    return (
                      <button
                        key={i}
                        onClick={() => showColumns(name)}
                        disabled={formatting}
                        className={`mx-1 my-1 rounded-lg p-2 ${
                          activeColumns.find((c) => c === name)
                            ? "bg-[#9DC88D]"
                            : "bg-gray-300"
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
                {activeColumns.map((column, i) => {
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
                        <BiCartAdd className="relative top-1" />
                      </button>
                    </td>

                    {activeColumns.map((column, i) => {
                      const prop = getProperty(
                        sample.data,
                        column as SampleKey
                      );
                      return (
                        <td key={i} className={`bg-gray-200`}>
                          {(!expert || (expert && formatting)) &&
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
                        <BiInfoCircle className="relative top-1" />
                      </button>
                    </td>
                  </tr>
                  <tr className={`bg-gray-200 ${show[index] ? "" : "hidden"}`}>
                    <td colSpan={activeColumns.length + 2}>
                      {columns?.map((column, i) => {
                        return (
                          <>
                            {(i === 0 ||
                              column.category !== columns[i - 1]?.category) && (
                              <h2>
                                <b>{column.category}</b>
                              </h2>
                            )}
                            <label className="">{column.name}:</label>
                            <label className="mx-2">
                              {getColumnValue(sample.data, column.name)}
                            </label>
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
