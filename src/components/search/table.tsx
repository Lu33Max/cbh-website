import React, { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
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
    samples: Samples[] | undefined,
    setPage: Dispatch<SetStateAction<number>>,
    setPagelength: Dispatch<SetStateAction<number>>,
    applyFilter?: () => void,
    expert: boolean,
    filterNormal?: INormalFilter,
    setFilter?: Dispatch<SetStateAction<INormalFilter>>
  }

const Table: React.FC<props> = ({ filter, page, pagelength, count, samples, setPage, setPagelength, applyFilter, expert, filterNormal, setFilter}) => {

    const [range, setRange] = useState<number[]>([])
    const [showSave, setShowSave] = useState(false);
    const [showLoad, setShowLoad] = useState(false);
    const [sortBy, setSortBy] = useState('');
  
    const defaultShow: boolean[] = []
  
    const [tableSamples, setTableSamples] = useState<TableSamples[]>([])
    type SampleKey = keyof typeof tableSamples[0];

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
      const newArray: TableSamples[] = []
      if(samples !== undefined){
        samples.forEach(sample => {
          if(newArray.find(arraySample => arraySample.CBH_Sample_ID === sample.CBH_Sample_ID)){
            const sampleIndex = newArray.findIndex(arraySample => arraySample.CBH_Sample_ID === sample.CBH_Sample_ID)

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

            if(sample.Lab_Parameter && !newArray[sampleIndex]?.Lab_Parameter?.find(item => item === sample.Lab_Parameter)) newArray[sampleIndex]?.Lab_Parameter?.push(sample.Lab_Parameter)
            if(sample.Result_Interpretation && !newArray[sampleIndex]?.Result_Interpretation?.find(item => item === sample.Result_Interpretation)) newArray[sampleIndex]?.Result_Interpretation?.push(sample.Result_Interpretation)
            if(sample.Result_Raw && !newArray[sampleIndex]?.Result_Raw?.find(item => item === sample.Result_Raw)) newArray[sampleIndex]?.Result_Raw?.push(sample.Result_Raw)
            if(sample.Result_Numerical && !newArray[sampleIndex]?.Result_Numerical?.find(item => item === sample.Result_Numerical)) newArray[sampleIndex]?.Result_Numerical?.push(sample.Result_Numerical ?? 0)
            if(sample.Result_Unit && !newArray[sampleIndex]?.Result_Unit?.find(item => item === sample.Result_Unit)) newArray[sampleIndex]?.Result_Unit?.push(sample.Result_Unit)
            if(sample.Cut_Off_Raw && !newArray[sampleIndex]?.Cut_Off_Raw?.find(item => item === sample.Cut_Off_Raw)) newArray[sampleIndex]?.Cut_Off_Raw?.push(sample.Cut_Off_Raw)
            if(sample.Cut_Off_Numerical && !newArray[sampleIndex]?.Cut_Off_Numerical?.find(item => item === sample.Cut_Off_Numerical)) newArray[sampleIndex]?.Cut_Off_Numerical?.push(sample.Cut_Off_Numerical ?? 0)
            if(sample.Test_Method && !newArray[sampleIndex]?.Test_Method?.find(item => item === sample.Test_Method)) newArray[sampleIndex]?.Test_Method?.push(sample.Test_Method)
            if(sample.Test_System && !newArray[sampleIndex]?.Test_System?.find(item => item === sample.Test_System)) newArray[sampleIndex]?.Test_System?.push(sample.Test_System)
            if(sample.Test_System_Manufacturer && !newArray[sampleIndex]?.Test_System_Manufacturer?.find(item => item === sample.Test_System_Manufacturer)) newArray[sampleIndex]?.Test_System_Manufacturer?.push(sample.Test_System_Manufacturer)
            if(sample.Result_Obtained_From && !newArray[sampleIndex]?.Result_Obtained_From?.find(item => item === sample.Result_Obtained_From)) newArray[sampleIndex]?.Result_Obtained_From?.push(sample.Result_Obtained_From)
            if(sample.Diagnosis && !newArray[sampleIndex]?.Diagnosis?.find(item => item === sample.Diagnosis)) newArray[sampleIndex]?.Diagnosis?.push(sample.Diagnosis)
            if(sample.Diagnosis_Remarks && !newArray[sampleIndex]?.Diagnosis_Remarks?.find(item => item === sample.Diagnosis_Remarks)) newArray[sampleIndex]?.Diagnosis_Remarks?.push(sample.Diagnosis_Remarks)
            if(sample.ICD_Code && !newArray[sampleIndex]?.ICD_Code?.find(item => item === sample.ICD_Code)) newArray[sampleIndex]?.ICD_Code?.push(sample.ICD_Code)
            if(sample.Medication && !newArray[sampleIndex]?.Medication?.find(item => item === sample.Medication)) newArray[sampleIndex]?.Medication?.push(sample.Medication)
            if(sample.Therapy && !newArray[sampleIndex]?.Therapy?.find(item => item === sample.Therapy)) newArray[sampleIndex]?.Therapy?.push(sample.Therapy)
            if(sample.Histological_Diagnosis && !newArray[sampleIndex]?.Histological_Diagnosis?.find(item => item === sample.Histological_Diagnosis)) newArray[sampleIndex]?.Histological_Diagnosis?.push(sample.Histological_Diagnosis)
            if(sample.Other_Gene_Mutations && !newArray[sampleIndex]?.Other_Gene_Mutations?.find(item => item === sample.Other_Gene_Mutations)) newArray[sampleIndex]?.Other_Gene_Mutations?.push(sample.Other_Gene_Mutations)
          } else {
            newArray.push(
              { id:                               sample.id,
                CBH_Donor_ID:                     sample.CBH_Donor_ID ?? undefined,
                CBH_Master_ID:                    sample.CBH_Master_ID ?? undefined,
                CBH_Sample_ID:                    sample.CBH_Sample_ID ?? undefined,
                Price:                            sample.Price ?? undefined,
                Quantity:                         sample.Quantity ?? undefined,
                Unit:                             sample.Unit ?? undefined,
                Matrix:                           sample.Matrix ?? undefined,
                Storage_Temperature:              sample.Storage_Temperature ?? undefined,
                Freeze_Thaw_Cycles:               sample.Freeze_Thaw_Cycles ?? undefined,
                Sample_Condition:                 sample.Sample_Condition ?? undefined,
                Infectious_Disease_Test_Result:   sample.Infectious_Disease_Test_Result ?? undefined,
                Gender:                           sample.Gender ?? undefined,
                Age:                              sample.Age ?? undefined,
                Ethnicity:                        sample.Ethnicity ?? undefined,
                BMI:                              sample.BMI ?? undefined,
                Lab_Parameter:                    sample.Lab_Parameter ? [sample.Lab_Parameter] : [],
                Result_Interpretation:            sample.Result_Interpretation ? [sample.Result_Interpretation] : [],
                Result_Raw:                       sample.Result_Raw ? [sample.Result_Raw] : [],
                Result_Numerical:                 sample.Result_Numerical ? [sample.Result_Numerical ?? 0] : [],
                Result_Unit:                      sample.Result_Unit ? [sample.Result_Unit] : [],
                Cut_Off_Raw:                      sample.Cut_Off_Raw ? [sample.Cut_Off_Raw] : [],
                Cut_Off_Numerical:                sample.Cut_Off_Numerical ? [sample.Cut_Off_Numerical ?? 0] : [],
                Test_Method:                      sample.Test_Method ? [sample.Test_Method] : [],
                Test_System:                      sample.Test_System ? [sample.Test_System] : [],
                Test_System_Manufacturer:         sample.Test_System_Manufacturer ? [sample.Test_System_Manufacturer] : [],
                Result_Obtained_From:             sample.Result_Obtained_From ? [sample.Result_Obtained_From] : [],
                Diagnosis:                        sample.Diagnosis ? [sample.Diagnosis] : [],
                Diagnosis_Remarks:                sample.Diagnosis_Remarks ? [sample.Diagnosis_Remarks] : [],
                ICD_Code:                         sample.ICD_Code ? [sample.ICD_Code] : [],
                Pregnancy_Week:                   sample.Pregnancy_Week ?? undefined,
                Pregnancy_Trimester:              sample.Pregnancy_Trimester ?? undefined,
                Medication:                       sample.Medication ? [sample.Medication] : [],
                Therapy:                          sample.Therapy ? [sample.Therapy] : [],
                Histological_Diagnosis:           sample.Histological_Diagnosis ? [sample.Histological_Diagnosis] : [],
                Organ:                            sample.Organ ?? undefined,
                Disease_Presentation:             sample.Disease_Presentation ?? undefined,
                TNM_Class_T:                      sample.TNM_Class_T ?? undefined,
                TNM_Class_N:                      sample.TNM_Class_N ?? undefined,
                TNM_Class_M:                      sample.TNM_Class_M ?? undefined,
                Tumour_Grade:                     sample.Tumour_Grade ?? undefined,
                Tumour_Stage:                     sample.Tumour_Stage ?? undefined,
                Viable_Cells__per_:               sample.Viable_Cells__per_ ?? undefined,
                Necrotic_Cells__per_:             sample.Necrotic_Cells__per_ ?? undefined,
                Tumour_Cells__per_:               sample.Tumour_Cells__per_ ?? undefined,
                Proliferation_Rate__Ki67_per_:    sample.Proliferation_Rate__Ki67_per_ ?? undefined,
                Estrogen_Receptor:                sample.Estrogen_Receptor ?? undefined,
                Progesteron_Receptor:             sample.Progesteron_Receptor ?? undefined,
                HER_2_Receptor:                   sample.HER_2_Receptor ?? undefined,
                Other_Gene_Mutations:             sample.Other_Gene_Mutations ? [sample.Other_Gene_Mutations] : [],
                Country_of_Collection:            sample.Country_of_Collection ?? undefined,
                Date_of_Collection:               sample.Date_of_Collection ?? undefined,
                Procurement_Type:                 sample.Procurement_Type ?? undefined,
                Informed_Consent:                 sample.Informed_Consent ?? undefined,
              }
            )
          }
        })
      }
      
      setTableSamples(newArray)
    }, [samples])

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
      let sortArray: TableSamples[]=[]

      sortArray = [...tableSamples].sort((a: TableSamples, b: TableSamples) => {

        const a1 = getProperty(a, column)
        const b1 = getProperty(b, column)

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
              <Footer range={range} page={page} setPage={setPage} />
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
                    <td className="items-center text-2xl bg-gray-300 rounded-l-xl"><button><BiCartAdd className="relative top-1" /></button></td>
                    {activeColumns.map((column, i) => {
                      const prop = getProperty(sample, column as SampleKey)
                      return (
                        <td key={i} className="py-2 px-3 bg-gray-300">
                          {((!expert || (expert && formatting)) && (column === "Lab_Parameter" || column === "Diagnosis" || column === "Result_Interpretation") && Array.isArray(prop)) ? 
                            (prop as string[]).filter((item: string) => column === "Lab_Parameter" ? filterNormal?.labParameter.value.find(val => val === item) : column === "Diagnosis" ? filterNormal?.diagnosis.value.find(val => val === item) : filterNormal?.resultInterpretation.value.find(val => val === item))
                          :
                            prop?.toString()
                          }
                        </td>
                      )
                    })}
                    <td className="py-2 px-3 bg-gray-300 rounded-r-xl"><button onClick={() => { updateState(index) }}><BiDetail className="relative top-1" /></button></td>
                  </tr>
                  <tr className={`mx-5 ${show[index] ? "" : "hidden"}`}>
                    <td colSpan={2} className="px-5 bg-gray-200">
                      <div className="grid grid-cols-2">
                        <strong className="col-span-2">General Data</strong>
                        <span>CBH Master ID:</span> {sample.CBH_Master_ID ?? "NaN"}
                        <span>Storage Temperature:</span> {sample.Storage_Temperature ?? "NaN"}
                        <span>Freeze Thaw Cycles:</span> {sample.Freeze_Thaw_Cycles ?? "NaN"}
                        <span>Infectious Disease Test Result:</span> {(sample.Infectious_Disease_Test_Result !== null && sample.Infectious_Disease_Test_Result !== "") ? sample.Infectious_Disease_Test_Result : "NaN"}
                        <span>Sample Condition:</span> {sample.Sample_Condition ?? "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={2}>
                      <div className="grid grid-cols-2 ">
                        <strong className="col-span-2">Donor</strong>
                        <span>Age:</span> {sample.Age ?? "NaN"}
                        <span>Gender:</span> {sample.Gender ?? "NaN"}
                        <span>Ethnicity:</span> {sample.Ethnicity ?? "NaN"}
                        <strong className="col-span-2 mt-2">Ethics</strong>
                        <span>Procurement Type:</span> {sample.Procurement_Type ?? "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={2}>
                      <div className="grid grid-cols-2">
                      <strong className="col-span-2">Laboratory</strong>
                        <span>Lab Parameter</span> {(sample.Lab_Parameter && sample.Lab_Parameter.length > 0) ? sample.Lab_Parameter.join(", "): "NaN"}
                        <span>Result Raw:</span> {(sample.Result_Raw && sample.Result_Raw.length > 0) ? sample.Result_Raw.join(", "): "NaN"}
                        <span>Result Unit:</span> {(sample.Result_Unit && sample.Result_Unit.length > 0) ? sample.Result_Unit.join(", "): "NaN"}
                        <span>Interpretation:</span> {(sample.Result_Interpretation && sample.Result_Interpretation.length > 0) ? sample.Result_Interpretation.join(", "): "NaN"}
                        <span>Cut Off Raw:</span> {sample.Cut_Off_Raw ? sample.Cut_Off_Raw.join(", "): "NaN"}
                        <span>Test Method:</span> {(sample.Test_Method && sample.Test_Method.length > 0) ? sample.Test_Method.join(", "): "NaN"}
                        <span>Test System:</span> {(sample.Test_System && sample.Test_System.length > 0) ? sample.Test_System.join(", "): "NaN"}
                        <span>Test System Manuf.:</span> {(sample.Test_System_Manufacturer && sample.Test_System_Manufacturer.length > 0) ? sample.Test_System_Manufacturer.join(", "): "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={4}>
                      <div className="grid grid-cols-2">
                        <strong className="col-span-2">Clinical Diagnosis</strong>
                        <span>Diagnosis:</span> {(sample.Diagnosis && sample.Diagnosis.length > 0) ? sample.Diagnosis.join(", "): "NaN"}
                        <span>Diagnosis Remarks:</span> {(sample.Diagnosis_Remarks && sample.Diagnosis_Remarks.length > 0) ? sample.Diagnosis_Remarks.join(", "): "NaN"}
                        <span>ICD:</span> {(sample.ICD_Code && sample.ICD_Code.length > 0) ? sample.ICD_Code.join(", ") : "NaN"}
                        <strong className="col-span-2 mt-2">Preanalytics</strong>
                        <span>Collection Country:</span> {sample.Country_of_Collection ?? "NaN"}
                        <span>Collection Date:</span> {sample.Date_of_Collection?.toDateString() ?? "NaN"}
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row w-full justify-center items-center mt-2 mb-5">
          <Footer range={range} page={page} setPage={setPage} />
          <ShowRows pagelength={pagelength} setPagelength={setPagelength}/>
        </div>
      </>
    )
}

export default Table