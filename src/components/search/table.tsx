import React, { useState, useEffect, useContext, type Dispatch, type SetStateAction } from 'react';
import { type State } from '@hookstate/core';

import { BiCartAdd, BiDetail, BiCog } from "react-icons/bi"
import Footer from "~/components/search/footer";
import ModalSave from '~/components/search/normal/modalSave';
import ModalLoad from '~/components/search/normal/modalLoad';

import ShowRows from '~/components/search/showRows';
import Count from '~/components/search/count';

import { type IGroup, GroupSchema, type INormalFilter } from '~/common/filter/filter';
import { ExampleSample, SampleSchema } from '~/common/database/samples';

import { type Samples } from '@prisma/client';
import ModalLoadExpert from '~/components/search/expert/modalLoad';
import ModalSaveExpert from '~/components/search/expert/modalSave';
import ClickContext from '~/context/click';

export type OptionalSamples = {
  optional: boolean,
  data: Samples
}

export type TableSamples = {
    id:                                      string,
    CBH_Donor_ID?:                           string,
    CBH_Master_ID?:                          string,
    CBH_Sample_ID?:                          string,
    Price?:                                  number,
    Quantity?:                               number,
    Unit?:                                   string,
    Matrix?:                                 string,
    Storage_Temperature?:                    string,
    Freeze_Thaw_Cycles?:                     number,
    Sample_Condition?:                       string,
    Infectious_Disease_Test_Result?:         string,
    Gender?:                                 string,
    Age?:                                    number,
    Ethnicity?:                              string,
    BMI?:                                    number,
    Lab_Parameter?:                          string[],
    Result_Interpretation?:                  string[],
    Result_Raw?:                             string[],
    Result_Numerical?:                       number[],
    Result_Unit?:                            string[],
    Cut_Off_Raw?:                            string[],
    Cut_Off_Numerical?:                      number[],
    Test_Method?:                            string[],
    Test_System?:                            string[],
    Test_System_Manufacturer?:               string[],
    Result_Obtained_From?:                   string[],
    Diagnosis?:                              string[],
    Diagnosis_Remarks?:                      string[],
    ICD_Code?:                               string[],
    Pregnancy_Week?:                         number,
    Pregnancy_Trimester?:                    string,
    Medication?:                             string[],
    Therapy?:                                string[],
    Histological_Diagnosis?:                 string[],
    Organ?:                                  string,
    Disease_Presentation?:                   string,
    TNM_Class_T?:                            string,
    TNM_Class_N?:                            string,
    TNM_Class_M?:                            string,
    Tumour_Grade?:                           string,
    Tumour_Stage?:                           string,
    Viable_Cells__per_?:                     string,
    Necrotic_Cells__per_?:                   string,
    Tumour_Cells__per_ ?:                    string,
    Proliferation_Rate__Ki67_per_?:          string,
    Estrogen_Receptor?:                      string,
    Progesteron_Receptor?:                   string,
    HER_2_Receptor?:                         string,
    Other_Gene_Mutations?:                   string[],
    Country_of_Collection?:                  string,
    Date_of_Collection?:                     Date,
    Procurement_Type?:                       string,
    Informed_Consent?:                       string,
  }

  export type OptionalTableSamples = {
    optional: boolean,
    data: TableSamples
  }

  const defaultGroup: IGroup = {
    not: false,
    link: 'AND',
    activated: true,
    mandatory: true,
    filter: [{
      col: 'CBH_Donor_ID',
      type: 'equal',
      values: [],
      activated: true,
      mandatory: true,
    }],
    groups: []
  }  

  type props = { 
    filter: State<IGroup>,
    page: number,
    pagelength: number ,
    count: number | undefined,
    optionalSamples: OptionalSamples[] | undefined,
    setPage: Dispatch<SetStateAction<number>>,
    setPagelength: Dispatch<SetStateAction<number>>,
    applyFilter?: () => void,
    expert: boolean,
    filterNormal?: INormalFilter,
    setFilter?: Dispatch<SetStateAction<INormalFilter>>
  }

const Table: React.FC<props> = ({ filter, page, pagelength, count, optionalSamples, setPage, setPagelength, applyFilter, expert, filterNormal, setFilter}) => {

    const [cartSamples, addCartSamples] = useContext(ClickContext)
    const [range, setRange] = useState<number[]>([])
    const [showSave, setShowSave] = useState(false);
    const [showLoad, setShowLoad] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [showPage, setShowPage] = useState(page)
  
    const defaultShow: boolean[] = []
  
    const [tableSamples, setTableSamples] = useState<OptionalTableSamples[]>([])
    type SampleKey = keyof TableSamples

    const [settings, setSettings] = useState<boolean>(false)
    const [formatting, setFormatting] = useState<boolean>(false)

    const defaultColumns = ["CBH_Donor_ID","CBH_Sample_ID","Matrix","Quantity","Unit","Age","Gender","Price"]
    const [activeColumns, setActiveColumns] = useState<string[]>(defaultColumns)
    const [tempColumns, setTempColumns] = useState<string[]>(defaultColumns)
  
    for (let i = 0; i < pagelength; i++) {
      defaultShow.push(false)
    }
  
    const [show, setShow] = useState<boolean[]>(defaultShow)

    const [filterTest, setFilterTest] = useState<INormalFilter | undefined>(filterNormal)

    useEffect(() => {
      setShowPage(page)
    }, [page])

    useEffect(() => {
      setFilterTest(filterNormal)
    }, [filterNormal])

    useEffect(() => {
      if(filterTest != undefined){
        let tempTemp = [...tempColumns]
        let count = 0

        tempTemp = tempTemp.filter(item => item !== "Gender" && item !== "Age" && item !== "CBH_Donor_ID")

        if(filterTest.labParameter && filterTest.labParameter.value.length > 0){
          if(!activeColumns.find(item => item === "Lab_Parameter")){
            tempTemp.push("Lab_Parameter")
          }
          count ++
        } else {
          tempTemp = tempTemp.filter(item => item !== "Lab_Parameter")
        }

        if(filterTest.resultInterpretation && filterTest.resultInterpretation.value.length > 0){
          if(!activeColumns.find(item => item === "Result_Interpretation")){
            tempTemp.push("Result_Interpretation")
          }
          count ++
        } else {
          tempTemp = tempTemp.filter(item => item !== "Result_Interpretation")
        }

        if(filterTest.diagnosis && filterTest.diagnosis.value.length > 0){
          if(!activeColumns.find(item => item === "Diagnosis")){
            tempTemp.push("Diagnosis")
          }
          count ++
        } else {
          tempTemp = tempTemp.filter(item => item !== "Diagnosis")
        }

        switch(count){
          case 0 : 
            if(!tempTemp.find(col => col === "Gender")){
              tempTemp.push("Gender")
            }

            if(!tempTemp.find(col => col === "Age")){
              tempTemp.push("Age")
            }

            if(!tempTemp.find(col => col === "CBH_Donor_ID")){
              tempTemp.push("CBH_Donor_ID")
            }
           break
          case 1 :
            if(!tempTemp.find(col => col === "Age")){
              tempTemp.push("Age")
            }

            if(!tempTemp.find(col => col === "CBH_Donor_ID")){
              tempTemp.push("CBH_Donor_ID")
            }
            break
          case 2:
            if(!tempTemp.find(col => col === "CBH_Donor_ID")){
              tempTemp.push("CBH_Donor_ID")
            }
            break
          default: 
            break
        }

        setTempColumns(tempTemp)
      }
    }, [filterTest])
  
    useEffect(() => {
      const newRange = [];
      if (count !== undefined && count !== null) {
        const num = Math.ceil(count / pagelength);
        for (let i = 1; i <= num; i++) {
          newRange.push(i);
        }
      }
      setRange(newRange);
    }, [count, pagelength])
  
    useEffect(() => {
      const newShow: boolean[] = []
      for (let i = 0; i < pagelength; i++) {
        newShow.push(false)
      }
      setShow(newShow)
    }, [pagelength])
  
    useEffect(() => {
      const newArray: OptionalTableSamples[] = []
      if(optionalSamples !== undefined){
        optionalSamples.forEach(sample => {
          if(newArray.find(arraySample => arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID)){
            const sampleIndex = newArray.findIndex(arraySample => arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID)

            /*const stringArray = [""]

            if(sampleIndex){
              for (const [key, value] of Object.entries(sampleIndex)) {
                if(getProperty(sampleIndex, key as SampleKey)) {
                  const property = getProperty(sampleIndex, key as SampleKey)
                  if(Array.isArray(property)){
                    if(typeof property === typeof stringArray){
                      property.push(value.toString())
                    } else {
                      property.push(Number(value))
                    } 
                    setProperty(sampleIndex, key as SampleKey, property)
                  }
                }
              }
            }*/

            if(sample.data.Lab_Parameter && !newArray[sampleIndex]?.data.Lab_Parameter?.find(item => item === sample.data.Lab_Parameter)) newArray[sampleIndex]?.data.Lab_Parameter?.push(sample.data.Lab_Parameter)
            if(sample.data.Result_Interpretation && !newArray[sampleIndex]?.data.Result_Interpretation?.find(item => item === sample.data.Result_Interpretation)) newArray[sampleIndex]?.data.Result_Interpretation?.push(sample.data.Result_Interpretation)
            if(sample.data.Result_Raw && !newArray[sampleIndex]?.data.Result_Raw?.find(item => item === sample.data.Result_Raw)) newArray[sampleIndex]?.data.Result_Raw?.push(sample.data.Result_Raw)
            if(sample.data.Result_Numerical && !newArray[sampleIndex]?.data.Result_Numerical?.find(item => item === sample.data.Result_Numerical)) newArray[sampleIndex]?.data.Result_Numerical?.push(sample.data.Result_Numerical ?? 0)
            if(sample.data.Result_Unit && !newArray[sampleIndex]?.data.Result_Unit?.find(item => item === sample.data.Result_Unit)) newArray[sampleIndex]?.data.Result_Unit?.push(sample.data.Result_Unit)
            if(sample.data.Cut_Off_Raw && !newArray[sampleIndex]?.data.Cut_Off_Raw?.find(item => item === sample.data.Cut_Off_Raw)) newArray[sampleIndex]?.data.Cut_Off_Raw?.push(sample.data.Cut_Off_Raw)
            if(sample.data.Cut_Off_Numerical && !newArray[sampleIndex]?.data.Cut_Off_Numerical?.find(item => item === sample.data.Cut_Off_Numerical)) newArray[sampleIndex]?.data.Cut_Off_Numerical?.push(sample.data.Cut_Off_Numerical ?? 0)
            if(sample.data.Test_Method && !newArray[sampleIndex]?.data.Test_Method?.find(item => item === sample.data.Test_Method)) newArray[sampleIndex]?.data.Test_Method?.push(sample.data.Test_Method)
            if(sample.data.Test_System && !newArray[sampleIndex]?.data.Test_System?.find(item => item === sample.data.Test_System)) newArray[sampleIndex]?.data.Test_System?.push(sample.data.Test_System)
            if(sample.data.Test_System_Manufacturer && !newArray[sampleIndex]?.data.Test_System_Manufacturer?.find(item => item === sample.data.Test_System_Manufacturer)) newArray[sampleIndex]?.data.Test_System_Manufacturer?.push(sample.data.Test_System_Manufacturer)
            if(sample.data.Result_Obtained_From && !newArray[sampleIndex]?.data.Result_Obtained_From?.find(item => item === sample.data.Result_Obtained_From)) newArray[sampleIndex]?.data.Result_Obtained_From?.push(sample.data.Result_Obtained_From)
            if(sample.data.Diagnosis && !newArray[sampleIndex]?.data.Diagnosis?.find(item => item === sample.data.Diagnosis)) newArray[sampleIndex]?.data.Diagnosis?.push(sample.data.Diagnosis)
            if(sample.data.Diagnosis_Remarks && !newArray[sampleIndex]?.data.Diagnosis_Remarks?.find(item => item === sample.data.Diagnosis_Remarks)) newArray[sampleIndex]?.data.Diagnosis_Remarks?.push(sample.data.Diagnosis_Remarks)
            if(sample.data.ICD_Code && !newArray[sampleIndex]?.data.ICD_Code?.find(item => item === sample.data.ICD_Code)) newArray[sampleIndex]?.data.ICD_Code?.push(sample.data.ICD_Code)
            if(sample.data.Medication && !newArray[sampleIndex]?.data.Medication?.find(item => item === sample.data.Medication)) newArray[sampleIndex]?.data.Medication?.push(sample.data.Medication)
            if(sample.data.Therapy && !newArray[sampleIndex]?.data.Therapy?.find(item => item === sample.data.Therapy)) newArray[sampleIndex]?.data.Therapy?.push(sample.data.Therapy)
            if(sample.data.Histological_Diagnosis && !newArray[sampleIndex]?.data.Histological_Diagnosis?.find(item => item === sample.data.Histological_Diagnosis)) newArray[sampleIndex]?.data.Histological_Diagnosis?.push(sample.data.Histological_Diagnosis)
            if(sample.data.Other_Gene_Mutations && !newArray[sampleIndex]?.data.Other_Gene_Mutations?.find(item => item === sample.data.Other_Gene_Mutations)) newArray[sampleIndex]?.data.Other_Gene_Mutations?.push(sample.data.Other_Gene_Mutations)
          } else {
            newArray.push(
              {optional: sample.optional, data: 
                { id:                               sample.data.id,
                  CBH_Donor_ID:                     sample.data.CBH_Donor_ID ?? undefined,
                  CBH_Master_ID:                    sample.data.CBH_Master_ID ?? undefined,
                  CBH_Sample_ID:                    sample.data.CBH_Sample_ID ?? undefined,
                  Price:                            sample.data.Price ?? undefined,
                  Quantity:                         sample.data.Quantity ?? undefined,
                  Unit:                             sample.data.Unit ?? undefined,
                  Matrix:                           sample.data.Matrix ?? undefined,
                  Storage_Temperature:              sample.data.Storage_Temperature ?? undefined,
                  Freeze_Thaw_Cycles:               sample.data.Freeze_Thaw_Cycles ?? undefined,
                  Sample_Condition:                 sample.data.Sample_Condition ?? undefined,
                  Infectious_Disease_Test_Result:   sample.data.Infectious_Disease_Test_Result ?? undefined,
                  Gender:                           sample.data.Gender ?? undefined,
                  Age:                              sample.data.Age ?? undefined,
                  Ethnicity:                        sample.data.Ethnicity ?? undefined,
                  BMI:                              sample.data.BMI ?? undefined,
                  Lab_Parameter:                    sample.data.Lab_Parameter ? [sample.data.Lab_Parameter] : [],
                  Result_Interpretation:            sample.data.Result_Interpretation ? [sample.data.Result_Interpretation] : [],
                  Result_Raw:                       sample.data.Result_Raw ? [sample.data.Result_Raw] : [],
                  Result_Numerical:                 sample.data.Result_Numerical ? [sample.data.Result_Numerical ?? 0] : [],
                  Result_Unit:                      sample.data.Result_Unit ? [sample.data.Result_Unit] : [],
                  Cut_Off_Raw:                      sample.data.Cut_Off_Raw ? [sample.data.Cut_Off_Raw] : [],
                  Cut_Off_Numerical:                sample.data.Cut_Off_Numerical ? [sample.data.Cut_Off_Numerical ?? 0] : [],
                  Test_Method:                      sample.data.Test_Method ? [sample.data.Test_Method] : [],
                  Test_System:                      sample.data.Test_System ? [sample.data.Test_System] : [],
                  Test_System_Manufacturer:         sample.data.Test_System_Manufacturer ? [sample.data.Test_System_Manufacturer] : [],
                  Result_Obtained_From:             sample.data.Result_Obtained_From ? [sample.data.Result_Obtained_From] : [],
                  Diagnosis:                        sample.data.Diagnosis ? [sample.data.Diagnosis] : [],
                  Diagnosis_Remarks:                sample.data.Diagnosis_Remarks ? [sample.data.Diagnosis_Remarks] : [],
                  ICD_Code:                         sample.data.ICD_Code ? [sample.data.ICD_Code] : [],
                  Pregnancy_Week:                   sample.data.Pregnancy_Week ?? undefined,
                  Pregnancy_Trimester:              sample.data.Pregnancy_Trimester ?? undefined,
                  Medication:                       sample.data.Medication ? [sample.data.Medication] : [],
                  Therapy:                          sample.data.Therapy ? [sample.data.Therapy] : [],
                  Histological_Diagnosis:           sample.data.Histological_Diagnosis ? [sample.data.Histological_Diagnosis] : [],
                  Organ:                            sample.data.Organ ?? undefined,
                  Disease_Presentation:             sample.data.Disease_Presentation ?? undefined,
                  TNM_Class_T:                      sample.data.TNM_Class_T ?? undefined,
                  TNM_Class_N:                      sample.data.TNM_Class_N ?? undefined,
                  TNM_Class_M:                      sample.data.TNM_Class_M ?? undefined,
                  Tumour_Grade:                     sample.data.Tumour_Grade ?? undefined,
                  Tumour_Stage:                     sample.data.Tumour_Stage ?? undefined,
                  Viable_Cells__per_:               sample.data.Viable_Cells__per_ ?? undefined,
                  Necrotic_Cells__per_:             sample.data.Necrotic_Cells__per_ ?? undefined,
                  Tumour_Cells__per_:               sample.data.Tumour_Cells__per_ ?? undefined,
                  Proliferation_Rate__Ki67_per_:    sample.data.Proliferation_Rate__Ki67_per_ ?? undefined,
                  Estrogen_Receptor:                sample.data.Estrogen_Receptor ?? undefined,
                  Progesteron_Receptor:             sample.data.Progesteron_Receptor ?? undefined,
                  HER_2_Receptor:                   sample.data.HER_2_Receptor ?? undefined,
                  Other_Gene_Mutations:             sample.data.Other_Gene_Mutations ? [sample.data.Other_Gene_Mutations] : [],
                  Country_of_Collection:            sample.data.Country_of_Collection ?? undefined,
                  Date_of_Collection:               sample.data.Date_of_Collection ?? undefined,
                  Procurement_Type:                 sample.data.Procurement_Type ?? undefined,
                  Informed_Consent:                 sample.data.Informed_Consent ?? undefined,
                }
              }
              
            )
          }
        })
      }
      
      setTableSamples(newArray)
    }, [optionalSamples])

    useEffect(() => {
      void sortColumns()
    }, [tempColumns])
  
    const updateState = (index: number) => {
      const newArray = show.map((item, i) => {
        if (index === i) {
          return !item
        } else {
          return item
        }
      })
      setShow(newArray)
    }
  
    function unfreeze(): IGroup {
      const result = GroupSchema.safeParse(JSON.parse(JSON.stringify(filter.value)))
  
      if(result.success){
        return result.data
      } else {
        return defaultGroup
      }
    }

    function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
      return o[propertyName]
    }
    
    const handleSort = (column: SampleKey) => {
      let sortArray: OptionalTableSamples[]=[]

      sortArray = [...tableSamples].sort((a: OptionalTableSamples, b: OptionalTableSamples) => {

        const a1 = getProperty(a.data, column as SampleKey)
        const b1 = getProperty(b.data, column as SampleKey)

        if(a1 !== undefined && b1 !== undefined){
          if(a1 > b1) return (column == sortBy) ? -1 : 1;
          else if (b1 > a1) return (column == sortBy) ? 1 :  -1;
          return 0;
        }
        return(-1)
      }); 

      setTableSamples(sortArray);
    }

    function showColumns (column:string):void {
      if (tempColumns.find(c => c === column)) {
        setTempColumns(tempColumns.filter(c => c !== column))
      } else {
        setTempColumns([...tempColumns, column])
      }
    }

    function sortColumns (){
      let sortArray: string[]=[]

      sortArray = [...tempColumns].sort((a: string, b: string) => {
        if(Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === a) > Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === b)) return (1)
        else if (Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === b) > Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === a)) return (-1)
        return 0;
      })

      setActiveColumns(sortArray)
    }
  
    return (
      <> 
        <div className="mx-4 my-5">
          <div className='flex flex-row'>

            {(expert && applyFilter) && (
              <>
                <div className='flex flex-row w-[50%] justify-start'>
                  <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-l-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D]' onClick={() => applyFilter()}>Apply Filter</button>
                  <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-r-2xl border-solid border-2 bg-orange-300 border-orange-300 border-l-white' onClick={() => filter.set({ not: false, link: 'AND', activated: true, mandatory: true, filter: [{ col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true, mandatory: true }], groups: [] },)}>Reset</button>
                </div>
                <div className='flex flex-row w-[50%] justify-end'>
                  <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-l-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D]' onClick={() => setShowLoad(true)}>Load Filter</button>
                  <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-r-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D] border-l-white' onClick={() => setShowSave(true)}>Save Filter</button>
                </div>
              </>
            )}            
          </div>

              
          {expert &&(
            <>
              <ModalSaveExpert showModal={showSave} setShowModal={setShowSave} filter={unfreeze()} />
              <ModalLoadExpert showModal={showLoad} setShowModal={setShowLoad} filter={filter} />
            </>
          )}
          {(!expert && filterNormal && setFilter) &&(
              <>
                <ModalSave showModal={showSave} setShowModal={setShowSave} filter={filterNormal}/>
                <ModalLoad showModal={showLoad} setShowModal={setShowLoad} setFilter={setFilter} />
              </>
          )}
          
          <div className="flex flex-row w-full items-center mt-3 mb-2">
            <Count count={count}/>
  
            <div className="mx-auto">
              <Footer range={range} page={showPage} setPage={setPage} />
            </div> 

            {!expert && (
              <div className='mr-2'>
                <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-l-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D]' onClick={() => setShowLoad(true)}>Load Filter</button>
                <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-r-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D] border-l-white' onClick={() => setShowSave(true)}>Save Filter</button>
              </div>
            )}          
  
            <ShowRows pagelength={pagelength} setPagelength={setPagelength}/>
            {expert &&(
              <button className='text-xl mx-3' onClick={() => setSettings(!settings)}><BiCog/></button>
            )}
          </div>

          {settings &&(
            <div className='my-3'>
            <h1 className='text-2xl'>Settings</h1>
            {/*<label>Auto-Formatting: </label><input type='checkbox' onChange={() => setFormatting(!formatting)} checked={formatting}></input>*/}
            <button onClick={() => {setActiveColumns(defaultColumns); setTempColumns(defaultColumns)}} className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-2xl border-solid border-2 bg-orange-300 border-orange-300'>Reset</button>
            <br/>
            {Object.getOwnPropertyNames(tableSamples[0]).map((name, i) => {
              if (name !== "id") {
                return (
                  <button key={i} onClick={() => showColumns(name)} disabled={formatting} className={`mx-1 my-1 rounded-lg p-2 ${activeColumns.find(c => c === name)? "bg-[#9DC88D]": "bg-gray-300"}`}>{name.replace(/_/g," ")}</button>
                )
              }              
            })}
            <br/>
            </div>
          )}
  
          <table className="w-full text-lg border-separate border-spacing-y-1 max-h-[50vh] overflow-y-auto">
            <thead>
              <tr className="bg-[rgb(131,182,94)] text-gray-100 font-extralight">
                <th className="py-2 font-extralight border-dotted rounded-l-xl border-black border-r-2">Cart</th>
                {activeColumns.map((column, i) => {
                  return(
                    <th key={i} className="py-2 font-extralight border-dotted border-black border-r-2"><button onClick={() => {sortBy === "" ? setSortBy(column): setSortBy(""); handleSort(column as SampleKey)}}>{column.replace(/_/g," ")}</button></th>
                  )
                })}
                <th className="py-2 font-extralight rounded-r-xl">Details</th>
              </tr>
            </thead>
            <tbody>
              {tableSamples.map((sample, index) => (
                <>
                  <tr key={index} className="text-center">
                    <td className={`${sample.optional ? "bg-green-300 items-center text-2xl rounded-l-xl" : "bg-gray-300 items-center text-2xl rounded-l-xl"}`} onClick={() => addCartSamples([...cartSamples, sample])}><button><BiCartAdd className="relative top-1" /></button></td>
                    
                    {activeColumns.map((column, i) => {
                      const prop = getProperty(sample.data, column as SampleKey)
                      return (
                        <td key={i} className={`${sample.optional ? "bg-green-300" : "bg-gray-300"}`}>
                          {((!expert || (expert && formatting)) && (column === "Lab_Parameter" || column === "Diagnosis" || column === "Result_Interpretation") && Array.isArray(prop)) ? 
                            (prop as string[]).filter((item: string) => column === "Lab_Parameter" ? filterNormal?.labParameter.value.find(val => val === item) : column === "Diagnosis" ? filterNormal?.diagnosis.value.find(val => val === item) : filterNormal?.resultInterpretation.value.find(val => val === item))
                          :
                            prop?.toString()
                          }
                        </td>
                      )
                    })}
                    <td className={`${sample.optional ? "bg-green-300 py-2 px-3 rounded-r-xl" : "bg-gray-300 py-2 px-3 rounded-r-xl"}`}><button onClick={() => { updateState(index) }}><BiDetail className="relative top-1" /></button></td>
                  </tr>
                  <tr className={`mx-5 ${show[index] ? "" : "hidden"}`}>
                    <td colSpan={2} className="px-5 bg-gray-200">
                      <div className="grid grid-cols-2">
                        <strong className="col-span-2">General Data</strong>
                        <span>CBH Master ID:</span> {sample.data.CBH_Master_ID ?? "NaN"}
                        <span>Storage Temperature:</span> {sample.data.Storage_Temperature ?? "NaN"}
                        <span>Freeze Thaw Cycles:</span> {sample.data.Freeze_Thaw_Cycles ?? "NaN"}
                        <span>Infectious Disease Test Result:</span> {(sample.data.Infectious_Disease_Test_Result !== null && sample.data.Infectious_Disease_Test_Result !== "") ? sample.data.Infectious_Disease_Test_Result : "NaN"}
                        <span>Sample Condition:</span> {sample.data.Sample_Condition ?? "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={2}>
                      <div className="grid grid-cols-2 ">
                        <strong className="col-span-2">Donor</strong>
                        <span>Age:</span> {sample.data.Age ?? "NaN"}
                        <span>Gender:</span> {sample.data.Gender ?? "NaN"}
                        <span>Ethnicity:</span> {sample.data.Ethnicity ?? "NaN"}
                        <strong className="col-span-2 mt-2">Ethics</strong>
                        <span>Procurement Type:</span> {sample.data.Procurement_Type ?? "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={2}>
                      <div className="grid grid-cols-2">
                      <strong className="col-span-2">Laboratory</strong>
                        <span>Lab Parameter</span> {(sample.data.Lab_Parameter && sample.data.Lab_Parameter.length > 0) ? sample.data.Lab_Parameter.join(", "): "NaN"}
                        <span>Result Raw:</span> {(sample.data.Result_Raw && sample.data.Result_Raw.length > 0) ? sample.data.Result_Raw.join(", "): "NaN"}
                        <span>Result Unit:</span> {(sample.data.Result_Unit && sample.data.Result_Unit.length > 0) ? sample.data.Result_Unit.join(", "): "NaN"}
                        <span>Interpretation:</span> {(sample.data.Result_Interpretation && sample.data.Result_Interpretation.length > 0) ? sample.data.Result_Interpretation.join(", "): "NaN"}
                        <span>Cut Off Raw:</span> {sample.data.Cut_Off_Raw ? sample.data.Cut_Off_Raw.join(", "): "NaN"}
                        <span>Test Method:</span> {(sample.data.Test_Method && sample.data.Test_Method.length > 0) ? sample.data.Test_Method.join(", "): "NaN"}
                        <span>Test System:</span> {(sample.data.Test_System && sample.data.Test_System.length > 0) ? sample.data.Test_System.join(", "): "NaN"}
                        <span>Test System Manuf.:</span> {(sample.data.Test_System_Manufacturer && sample.data.Test_System_Manufacturer.length > 0) ? sample.data.Test_System_Manufacturer.join(", "): "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={4}>
                      <div className="grid grid-cols-2">
                        <strong className="col-span-2">Clinical Diagnosis</strong>
                        <span>Diagnosis:</span> {(sample.data.Diagnosis && sample.data.Diagnosis.length > 0) ? sample.data.Diagnosis.join(", "): "NaN"}
                        <span>Diagnosis Remarks:</span> {(sample.data.Diagnosis_Remarks && sample.data.Diagnosis_Remarks.length > 0) ? sample.data.Diagnosis_Remarks.join(", "): "NaN"}
                        <span>ICD:</span> {(sample.data.ICD_Code && sample.data.ICD_Code.length > 0) ? sample.data.ICD_Code.join(", ") : "NaN"}
                        <strong className="col-span-2 mt-2">Preanalytics</strong>
                        <span>Collection Country:</span> {sample.data.Country_of_Collection ?? "NaN"}
                        <span>Collection Date:</span> {sample.data.Date_of_Collection?.toDateString() ?? "NaN"}
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row w-full justify-center items-center mt-2 mb-5">
          <Footer range={range} page={showPage} setPage={setPage} />
          <ShowRows pagelength={pagelength} setPagelength={setPagelength}/>
        </div>
      </>
    )
}

export default Table