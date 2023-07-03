import React, { useState, useEffect, useContext, type Dispatch, type SetStateAction } from 'react';

import { BiCartAdd, BiCog, BiInfoCircle } from "react-icons/bi"

import { type INormalFilter } from '~/common/filter/filter';
import { SampleSchema } from '~/common/database/samples';

import ClickContext from '~/context/click';
import { Colors } from '~/common/styles';
import { type IOptionalSample, type IOptionalTableSample, type ITableSample } from '~/common/types';
import Header from './header';
import useWindowSize from '~/utils/window';

type props = { 
  page: number,
  pagelength: number ,
  count: number | undefined,
  optionalSamples: IOptionalSample[] | undefined,
  setPage: Dispatch<SetStateAction<number>>,
  setPagelength: Dispatch<SetStateAction<number>>,
  expert: boolean,
  filterNormal?: INormalFilter,
}

const Table: React.FC<props> = ({ page, pagelength, count, optionalSamples, setPage, setPagelength, expert, filterNormal}) => {
  const [cartSamples, setCartSamples] = useContext(ClickContext)
  const [range, setRange] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('');
  const [showPage, setShowPage] = useState(page)
  const [samplesToAdd, setSamplesToAdd] = useState(0)

  const defaultShow: boolean[] = []

  const [tableSamples, setTableSamples] = useState<IOptionalTableSample[]>([])
  type SampleKey = keyof ITableSample

  const [settings, setSettings] = useState<boolean>(false)
  const [formatting, setFormatting] = useState<boolean>(false)

  const defaultColumns = ["CBH_Donor_ID","CBH_Sample_ID","Matrix","Quantity","Unit","Age","Gender","Price"]
  const [activeColumns, setActiveColumns] = useState<string[]>(defaultColumns)
  const [bufferColumns, setBufferColumns] = useState<string[]>(defaultColumns)
  const [filterState, setFilterState] = useState<INormalFilter | undefined>(filterNormal)

  const windowSize = useWindowSize()

  for (let i = 0; i < pagelength; i++) {
    defaultShow.push(false)
  }

  const [show, setShow] = useState<boolean[]>(defaultShow)

  useEffect(() => {
    setShowPage(page)
  }, [page])

  useEffect(() => {
    setFilterState(filterNormal)
  }, [filterNormal])

  useEffect(() => {
    if(filterState !== undefined){
      let tempBuffer = [...bufferColumns]
      let count = 0

      tempBuffer = tempBuffer.filter(item => item !== "Gender" && item !== "Age" && item !== "CBH_Donor_ID")

      if(filterState.Lab_Parameter && filterState.Lab_Parameter.value.length > 0){
        if(!activeColumns.find(item => item === "Lab_Parameter")){
          tempBuffer.push("Lab_Parameter")
        }
        count ++
      } else {
        tempBuffer = tempBuffer.filter(item => item !== "Lab_Parameter")
      }

      if(filterState.Result_Interpretation && filterState.Result_Interpretation.value.length > 0){
        if(!activeColumns.find(item => item === "Result_Interpretation")){
          tempBuffer.push("Result_Interpretation")
        }
        count ++
      } else {
        tempBuffer = tempBuffer.filter(item => item !== "Result_Interpretation")
      }

      if(filterState.Diagnosis && filterState.Diagnosis.value.length > 0){
        if(!activeColumns.find(item => item === "Diagnosis")){
          tempBuffer.push("Diagnosis")
        }
        count ++
      } else {
        tempBuffer = tempBuffer.filter(item => item !== "Diagnosis")
      }

      switch(count){
        case 0 : 
          if(!tempBuffer.find(col => col === "Gender")){
            tempBuffer.push("Gender")
          }

          if(!tempBuffer.find(col => col === "Age")){
            tempBuffer.push("Age")
          }

          if(!tempBuffer.find(col => col === "CBH_Donor_ID")){
            tempBuffer.push("CBH_Donor_ID")
          }
          break
        case 1 :
          if(!tempBuffer.find(col => col === "Age")){
            tempBuffer.push("Age")
          }

          if(!tempBuffer.find(col => col === "CBH_Donor_ID")){
            tempBuffer.push("CBH_Donor_ID")
          }
          break
        case 2:
          if(!tempBuffer.find(col => col === "CBH_Donor_ID")){
            tempBuffer.push("CBH_Donor_ID")
          }
          break
        default: 
          break
      }

      setBufferColumns(tempBuffer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState])

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
    const newArray: IOptionalTableSample[] = []
    if(optionalSamples !== undefined){
      optionalSamples.forEach(sample => {
        if(newArray.find(arraySample => arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID)){
          const sampleIndex = newArray.findIndex(arraySample => arraySample.data.CBH_Sample_ID === sample.data.CBH_Sample_ID)
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
            { optional: sample.optional, data: { 
                id:                               sample.data.id,
                CBH_Donor_ID:                     sample.data.CBH_Donor_ID,
                CBH_Master_ID:                    sample.data.CBH_Master_ID,
                CBH_Sample_ID:                    sample.data.CBH_Sample_ID,
                Price:                            sample.data.Price,
                Quantity:                         sample.data.Quantity,
                Unit:                             sample.data.Unit,
                Matrix:                           sample.data.Matrix ,
                Storage_Temperature:              sample.data.Storage_Temperature ,
                Freeze_Thaw_Cycles:               sample.data.Freeze_Thaw_Cycles ,
                Sample_Condition:                 sample.data.Sample_Condition ,
                Infectious_Disease_Test_Result:   sample.data.Infectious_Disease_Test_Result ,
                Gender:                           sample.data.Gender ,
                Age:                              sample.data.Age ,
                Ethnicity:                        sample.data.Ethnicity ,
                BMI:                              sample.data.BMI ,
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
                Pregnancy_Week:                   sample.data.Pregnancy_Week ,
                Pregnancy_Trimester:              sample.data.Pregnancy_Trimester ,
                Medication:                       sample.data.Medication ? [sample.data.Medication] : [],
                Therapy:                          sample.data.Therapy ? [sample.data.Therapy] : [],
                Histological_Diagnosis:           sample.data.Histological_Diagnosis ? [sample.data.Histological_Diagnosis] : [],
                Organ:                            sample.data.Organ ,
                Disease_Presentation:             sample.data.Disease_Presentation ,
                TNM_Class_T:                      sample.data.TNM_Class_T ,
                TNM_Class_N:                      sample.data.TNM_Class_N ,
                TNM_Class_M:                      sample.data.TNM_Class_M ,
                Tumour_Grade:                     sample.data.Tumour_Grade ,
                Tumour_Stage:                     sample.data.Tumour_Stage ,
                Viable_Cells__per_:               sample.data.Viable_Cells__per_ ,
                Necrotic_Cells__per_:             sample.data.Necrotic_Cells__per_ ,
                Tumour_Cells__per_:               sample.data.Tumour_Cells__per_ ,
                Proliferation_Rate__Ki67_per_:    sample.data.Proliferation_Rate__Ki67_per_ ,
                Estrogen_Receptor:                sample.data.Estrogen_Receptor ,
                Progesteron_Receptor:             sample.data.Progesteron_Receptor ,
                HER_2_Receptor:                   sample.data.HER_2_Receptor ,
                Other_Gene_Mutations:             sample.data.Other_Gene_Mutations ? [sample.data.Other_Gene_Mutations] : [],
                Country_of_Collection:            sample.data.Country_of_Collection ,
                Date_of_Collection:               sample.data.Date_of_Collection ,
                Procurement_Type:                 sample.data.Procurement_Type ,
                Informed_Consent:                 sample.data.Informed_Consent ,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bufferColumns])

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

  function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]
  }
  
  const handleSort = (column: SampleKey) => {
    let sortArray: IOptionalTableSample[]=[]

    sortArray = [...tableSamples].sort((a: IOptionalTableSample, b: IOptionalTableSample) => {

      const a1 = getProperty(a.data, column)
      const b1 = getProperty(b.data, column)

      if(a1 !== null && b1 !== null){
        if(a1 > b1) return (column == sortBy) ? -1 : 1;
        else if (b1 > a1) return (column == sortBy) ? 1 :  -1;
        return 0;
      }
      return(-1)
    }); 

    setTableSamples(sortArray);
  }

  function showColumns (column:string):void {
    if (bufferColumns.find(c => c === column)) {
      setBufferColumns(bufferColumns.filter(c => c !== column))
    } else {
      setBufferColumns([...bufferColumns, column])
    }
  }

  function sortColumns (){
    let sortArray: string[]=[]

    sortArray = [...bufferColumns].sort((a: string, b: string) => {
      if(Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === a) > Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === b)) return (1)
      else if (Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === b) > Object.getOwnPropertyNames(SampleSchema.shape).findIndex(i => i === a)) return (-1)
      return 0;
    })

    setActiveColumns(sortArray)
  }

  function addSamplesToCart(){
    const tempArray: IOptionalTableSample[] = []

    for (let i = 0; i < samplesToAdd; i++) {
      const tempSample = tableSamples[i]
      if (tempSample) {
        tempArray.push(tempSample)
      }        
    }
    setCartSamples([...cartSamples, ...tempArray])
  }

  const settingsButton: React.ReactNode = <>
    {(expert && windowSize.width && windowSize.width > 600) && (
      <button className='text-xl mx-3' onClick={() => setSettings(!settings)}><BiCog/></button>
    )}
  </>
  

  return (
    <> 
      <div className="my-5 font-poppins">
        <Header count={count} pagelength={pagelength} range={range} showPage={showPage} setPage={setPage} setPagelength={setPagelength} setSamplesToAdd={setSamplesToAdd} addSamplesToCart={addSamplesToCart}>{settingsButton}</Header>
        <div className='px-16 mb-6'>         
          {settings && (
            <div className='my-3'>
              <h1 className='text-2xl'>Settings</h1>
              <label>Auto-Formatting: </label><input type='checkbox' onChange={() => setFormatting(!formatting)} checked={formatting}></input>
              <button onClick={() => {setActiveColumns(defaultColumns); setBufferColumns(defaultColumns)}} className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-2xl border-solid border-2 bg-orange-300 border-orange-300'>Reset</button>
              <br/>
              {Object.getOwnPropertyNames(tableSamples[0]?.data).map((name, i) => {
                if (name !== "id") {
                  return (
                    <button key={i} onClick={() => showColumns(name)} disabled={formatting} className={`mx-1 my-1 rounded-lg p-2 ${activeColumns.find(c => c === name)? "bg-[#9DC88D]": "bg-gray-300"}`}>{name.replace(/_/g," ")}</button>
                  )
                }              
              })}
              <br/>
            </div>
          )}
        </div>
        <div className={`${windowSize.width && windowSize.width < 1000 ? "max-w-[95dvw] overflow-x-auto" : "w-full"}`}>
        <table className={`w-full text-lg border-separate border-spacing-y-1 overflow-y-auto`}>
          <thead>
            <tr className={`bg-[${Colors.light_light}] text-black font-extralight`}>
              <th className={`py-4 px-2 font-extralight border-dotted rounded-l-xl border-[${Colors.dark}] border-r-[1px]`}>Cart</th>
              {activeColumns.map((column, i) => {
                return(
                  <th key={i} className="py-4 whitespace-nowrap px-2 font-extralight border-dotted border-black border-r-[1px]"><button onClick={() => {sortBy === "" ? setSortBy(column): setSortBy(""); handleSort(column as SampleKey)}}>{column.replace(/_/g," ")}</button></th>
                )
              })}
              <th className="py-4 px-2 font-extralight rounded-r-xl">Details</th>
            </tr>
          </thead>
          <tbody>
            {tableSamples.map((sample, index) => (
              <>
                <tr key={index} className="text-center">
                  <td className={`bg-gray-200 items-center text-2xl rounded-l-xl ${sample.optional ? `border-l-8 border-[#9DC88D]` : ""}`} onClick={() => setCartSamples([...cartSamples, sample])}><button><BiCartAdd className="relative top-1" /></button></td>
                  
                  {activeColumns.map((column, i) => {
                    const prop = getProperty(sample.data, column as SampleKey)
                    return (
                      <td key={i} className={`bg-gray-200`}>
                        {((!expert || (expert && formatting)) && (column === "Lab_Parameter" || column === "Diagnosis" || column === "Result_Interpretation") && Array.isArray(prop)) ? 
                          (prop as string[]).filter((item: string) => column === "Lab_Parameter" ? filterNormal?.Lab_Parameter.value.find(val => val === item) : column === "Diagnosis" ? filterNormal?.Diagnosis.value.find(val => val === item) : filterNormal?.Result_Interpretation.value.find(val => val === item))
                        :
                          prop?.toString()
                        }
                      </td>
                    )
                  })}
                  <td className={`bg-gray-200 py-2 px-3 rounded-r-xl`}><button onClick={() => { updateState(index) }}><BiInfoCircle className="relative top-1" /></button></td>
                </tr>
                <tr className={`bg-gray-200 ${show[index] ? "" : "hidden"}`}>
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
      </div>
      <Header count={count} pagelength={pagelength} range={range} showPage={showPage} setPage={setPage} setPagelength={setPagelength} setSamplesToAdd={setSamplesToAdd} addSamplesToCart={addSamplesToCart}/>
    </>
  )
}

export default Table