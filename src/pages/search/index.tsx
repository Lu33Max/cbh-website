import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import Header from "~/components/header";
import Sidebar from "~/components/sidebar";
import { useEffect, useState } from "react";
import Footer from "~/components/footer";

import { BiCartAdd, BiDetail, BiX } from "react-icons/bi"

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Samples } from "@prisma/client";
import { set } from "zod";

type Filter = {
  cbhMasterID: string | undefined,
  cbhDonorID: string | undefined,
  cbhSampleID: string | undefined,
  price: { 
    min: number | undefined, 
    max: number | undefined 
  },
  matrix: string[],
  quantity: {
    min: number | undefined,
    max: number | undefined,
  },
  unit: string[],
  labParameter: string[],
  resultInterpretation: string[],
  //resultNumericals
  resultUnit: string[],
  diagnosis: string[],
  ICDCode: string[]
}

const Search: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      
      <div className="bg-gray-200 min-h-screen overflow-y-hidden">
        <Header/>
        <span className="grid grid-cols-7">
            <div className="col-span-1">
              <Sidebar/>
            </div>
            <div className="col-span-6 h-[95vh] overflow-y-auto">
              <Content/>
            </div>
        </span>
      </div>
    </>
  );
};

export default Search;

const Content: React.FC = () => {
  const defaultFilter: Filter = {
    cbhMasterID: undefined, 
    cbhDonorID: undefined, 
    cbhSampleID: undefined,
    price: {
      min: undefined,
      max: undefined,
    },
    matrix: [],
    quantity: {
      min: undefined,
      max: undefined,
    },
    unit: [],
    labParameter: [],
    resultInterpretation: [],
    resultUnit: [],
    diagnosis: [],
    ICDCode: []
  }
  const defaultShow: boolean[] = []

  const [page, setPage] = useState<number>(1)
  const [pagelength, setPagelength] = useState<number>(10)
  const [search, setSearch] = useState<string | undefined>()
  const [filter, setFilter] = useState<Filter>(defaultFilter)
  const [range, setRange] = useState<number[]>([])

  for(let i = 0; i < pagelength; i++){
    defaultShow.push(false)
  }

  const handlePageLengthChange = (length: number) => {
    setPagelength(length);
  };

  const [show, setShow] = useState<boolean[]>(defaultShow)

  const { data: samples, refetch: refetchSamples } = api.samples.getAll.useQuery(
    { pages: page, lines: pagelength, search: search, filter: filter }
  )

  const { data: count, refetch: refetchCount } = api.samples.count.useQuery()
  
  useEffect(() => {
    void refetchSamples()
  }, [search, page, pagelength, refetchSamples])

  useEffect(() => {
    const newRange = [];
    if (count !== undefined){
      const num = Math.ceil(count / pagelength);
      for (let i = 1; i <= num; i++) {
        newRange.push(i);
      }
    }
    setRange(newRange);
  }, [count, pagelength])

  type stringFilter = {
    link: string,
    filter: string[],
    groups: stringFilter[]
  }

  const updateState = (index: number) => {
    const newArray = show.map((item, i) => {
      if(index === i){
        return !item
      } else {
        return item
      }
    })
    setShow(newArray)
  }

  return(
      <div className="w-full overflow-x-hidden font-poppins">
        {/*<input type="text" onKeyDown={e => {
          if(e.key === "Enter"){
            setSearch(e.currentTarget.value)
            e.currentTarget.value = ""
          }
        }}/>*/}

        <h1 className="text-5xl mt-5 ml-5 mb-2 text-green-900">Overall Search</h1>
     
        {/* Input fields */}   
        <div className="px-5 py-3 items-center justify-center">
          <div className="grid grid-cols-4 gap-2 max-w-full">
            {/* CBH Master ID */}
            <div className="items-center text-center w-full">
              <input type="text" className="bg-gray-50 min-w-full rounded-lg px-2 py-1 items-center justify-center shadow-md text-center text-lg" placeholder="CBHMasterID" onKeyDown={e => {
                if(e.key === "Enter"){
                  const temp = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined
                  setFilter(filter => ({...filter, cbhMasterID: temp}))
                }
              }}/>
            </div>
            {/* CBH Donor ID */}
            <div className="items-center text-center">
              <input type="text" className="bg-gray-50 min-w-full rounded-lg px-2 py-1  items-center justify-center shadow-md text-center text-lg" placeholder="CBHDonorID" onKeyDown={e => {
                if(e.key === "Enter"){
                  const temp = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined
                  setFilter(filter => ({...filter, cbhDonorID: temp}))
                }
              }}/>
            </div>
            {/* CBH Sample ID */}
            <div className="items-center text-center">
              <input type="text" className="bg-gray-50 min-w-full rounded-lg px-2 py-1 items-center justify-center shadow-md text-center text-lg" placeholder="CBHSampleID" onKeyDown={e => {
                if(e.key === "Enter"){
                  const temp = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined
                  setFilter(filter => ({...filter, cbhSampleID: temp}))
                }
              }}/>
            </div>
            {/* Price */}
            <div className="items-center text-center">
              <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                <Popover id="popover-basic" className="bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md text-center">
                  <Popover.Body>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        Min:
                      </div>
                      <input type="number" className="text-center col-span-3" placeholder="Min price" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.price
                          temp.min = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, price: temp}))
                        }
                      }}/>
                      <div className="col-span-1">
                        Max:
                      </div>
                      <input type="number" className="text-center col-span-3" placeholder="Max price" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.price
                          temp.max = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, price: temp}))
                        }
                      }}/>
                    </div>
                  </Popover.Body>
                </Popover>
              }>
                <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md rounded-lg">Price</button>
              </OverlayTrigger>
            </div>
          </div>
          <div className="grid grid-cols-4 max-w-full gap-2 mt-2">
            {/* General Data */}
            <div className="items-center text-center">
              <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                <Popover id="popover-basic" className="bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                  <Popover.Body>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        Matrix:
                      </div>
                      <input type="text" className="col-span-3 text-center" placeholder="Matrix" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.matrix
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, matrix: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                    </div>
                  </Popover.Body>
                </Popover>
              }>
                <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md rounded-lg">General Data</button>
              </OverlayTrigger>
            </div>
            {/* Quantity Information */}
            <div className="items-center text-center">
              <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                <Popover id="popover-basic" className="bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                  <Popover.Body>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        Min:
                      </div>
                      <input type="text" className="col-span-3 text-center" placeholder="Min quantity" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.quantity
                          temp.min = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, quantity: temp}))
                        }
                      }}/>
                      <div className="col-span-1">
                        Max:
                      </div>
                      <input type="text" className="col-span-3 text-center" placeholder="Max quantity" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.quantity
                          temp.max = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, quantity: temp}))
                        }
                      }}/>
                      <div className="col-span-1">
                        Unit:
                      </div>
                      <input type="text" className="col-span-3 text-center" placeholder="Unit" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.unit
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, unit: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                    </div>
                  </Popover.Body>
                </Popover>
              }>
                <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md  rounded-lg">Quantity Information</button>
              </OverlayTrigger>
            </div>
            {/* Laboratory */}
            <div className="items-center text-center">
              <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                <Popover id="popover-basic" className="bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                  <Popover.Body>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 text-right">
                        Parameter:
                      </div>
                      <input type="text" className="col-span-2 text-center" placeholder="LabParameter" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.labParameter
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, labParameter: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                      <div className="col-span-1 text-right">
                        Result Interpretation:
                      </div>
                      <input type="text" className="col-span-2 text-center" placeholder="Result Interpretation" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.resultInterpretation
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, resultInterpretation: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                      <div className="col-span-1 text-right">
                        Unit:
                      </div>
                      <input type="text" className="col-span-2 text-center" placeholder="Result Unit" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.resultUnit
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, resultUnit: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                    </div>
                  </Popover.Body>
                </Popover>
              }>
                <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md  rounded-lg">Laboratory</button>
              </OverlayTrigger>
            </div>
            {/* Clinical Diagnosis */}
            <div className="items-center text-center">
              <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                <Popover id="popover-basic" className="bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                  <Popover.Body>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1">
                        Diagnosis:
                      </div>
                      <input type="text" className="col-span-3 text-center" placeholder="Diagnosis" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.diagnosis
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, diagnosis: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                      <div className="col-span-1">
                        ICD Code:
                      </div>
                      <input type="text" className="col-span-3 text-center" placeholder="ICD Code" onKeyDown={e => {
                        if(e.key === "Enter"){
                          const temp = filter.ICDCode
                          temp.push(e.currentTarget.value)
                          setFilter(filter => ({...filter, ICDCode: temp}))
                          e.currentTarget.value = ""
                        }
                      }}/>
                    </div>
                  </Popover.Body>
                </Popover>
              }>
                <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md  rounded-lg">Laboratory</button>
              </OverlayTrigger>
            </div>
          </div>
        </div>

        {/* Displaying active filters */}
        <div className="flex flex-row mx-5 max-w-full overflow-x-auto overflow-y-hidden whitespace-nowrap">
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${search ? "" : "hidden"}`}>
            Search: {search} <button className="text-xl relative top-1" onClick={() => setSearch(undefined)}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.matrix.length > 0 ? "" : "hidden"}`}>
            Matrix:&nbsp;
            {filter.matrix.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, matrix: []}))}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.unit.length > 0 ? "" : "hidden"}`}>
            Unit:&nbsp;
            {filter.unit.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, unit: []}))}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.labParameter.length > 0 ? "" : "hidden"}`}>
            Parameter:&nbsp;
            {filter.labParameter.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, labParameter: []}))}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.resultInterpretation.length > 0 ? "" : "hidden"}`}>
            Res.Interpretation:&nbsp;
            {filter.resultInterpretation.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, resultInterpretation: []}))}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.resultUnit.length > 0 ? "" : "hidden"}`}>
            Res.Unit:&nbsp;
            {filter.resultUnit.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, resultUnit: []}))}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.diagnosis.length > 0 ? "" : "hidden"}`}>
            Diagnosis:&nbsp;
            {filter.diagnosis.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, diagnosis: []}))}><BiX/></button>
          </span>
          <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.ICDCode.length > 0 ? "" : "hidden"}`}>
            ICD:&nbsp;
            {filter.ICDCode.map((item, i) => (
              <>
                {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
              </>
            ))}
            <button className="text-xl relative top-1" onClick={() => setFilter(filter => ({...filter, ICDCode: []}))}><BiX/></button>
          </span>
        </div>

        <div className="mx-4 my-5">
          <table className="w-full text-lg border-separate border-spacing-y-1 max-h-[50vh] overflow-y-auto">
            <thead>
              <tr className="bg-[rgb(131,182,94)] text-gray-100 font-extralight">
                <th className="py-2 font-extralight border-dotted rounded-l-xl border-black border-r-2">Cart</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">CBHDonorID</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">CBHSampleID</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">Details</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">Matrix</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">Quantity</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">Unit</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">Age</th>
                <th className="py-2 font-extralight border-dotted border-black border-r-2">Gender</th>
                <th className="py-2 font-extralight rounded-r-xl">Price</th>
              </tr>
            </thead>
            <tbody>
              {samples?.map((sample, index) => (
                <>
                  <tr key={index} className="text-center">
                    <td className="items-center text-2xl bg-gray-300 rounded-l-xl"><button><BiCartAdd className="relative top-1"/></button></td>
                    <td className="py-2 px-3 bg-gray-300">{sample.CBH_Donor_ID}</td>
                    <td className="py-2 px-3 bg-gray-300">{sample.CBH_Sample_ID}</td>
                    <td className="items-center text-2xl bg-gray-300"><button onClick={() => {updateState(index)}}><BiDetail className="relative top-1"/></button></td>
                    <td className="py-2 px-3 bg-gray-300">{sample.Matrix}</td>
                    <td className="py-2 px-3 bg-gray-300">{sample.Quantity}</td>
                    <td className="py-2 px-3 bg-gray-300">{sample.Unit}</td>
                    <td className="py-2 px-3 bg-gray-300">{sample.Age}</td>
                    <td className="py-2 px-3 bg-gray-300">{sample.Gender}</td>
                    <td className="py-2 px-3 bg-gray-300 rounded-r-xl">{sample.Price} €</td> 
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
                        <span>Lab Parameter</span> {sample.Lab_Parameter ?? "NaN"}
                        <span>Result Raw:</span> {sample.Result_Raw ?? "NaN"}
                        <span>Result Unit:</span> {sample.Result_Unit ?? "NaN"}
                        <span>Interpretation:</span> {sample.Result_Interpretation ?? "NaN"}
                        <span>Cut Off Raw:</span> {sample.Cut_Off_Raw ?? "NaN"}
                        <span>Cut Off Unit:</span> {sample.Result_Unit ?? "NaN"}
                        <span>Test Method:</span> {sample.Test_Method ?? "NaN"}
                        <span>Test System:</span> {sample.Test_System ?? "NaN"}
                        <span>Test System Manuf.:</span> {sample.Test_System_Manufacturer ?? "NaN"}
                      </div>
                    </td>
                    <td className="border-l-2 border-solid border-gray-300 px-2" colSpan={4}>
                      <div className="grid grid-cols-2">
                        <strong className="col-span-2">Clinical Diagnosis</strong>
                        <span>Diagnosis:</span> {(sample.Diagnosis !== null && sample.Diagnosis !== "") ? sample.Diagnosis : "NaN"}
                        <span>Diagnosis Remarks:</span> {(sample.Diagnosis_Remarks !== null && sample.Diagnosis_Remarks !== "") ? sample.Diagnosis_Remarks : "NaN"}
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
        <div className="flex flex-row w-full items-center justify-center">
          <Footer range={range} page={page} setPage={setPage}/>

          <p>Show rows</p>
          <select name="pagelength" id="pagelength" onChange={e => handlePageLengthChange(parseInt(e.target.value))}>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
        </div>
      </div>
  )
}