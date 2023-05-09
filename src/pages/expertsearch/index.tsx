import React, { useState, useEffect } from 'react';
import { useHookstate, type State } from '@hookstate/core';
import { type NextPage } from 'next';
import { api } from "~/utils/api";

import { BiCartAdd, BiDetail, BiX } from "react-icons/bi"
import Head from 'next/head';
import Header from '~/components/overall/header';
import Sidebar from '~/components/overall/sidebar';
import Footer from "~/components/search/footer";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

type group= {
    not: boolean,
    link: string,
    filter: {
        col: string,
        type: string,
        values: string[]
    }[],
    groups?: group[],
}

function BuildQuery(group: State<group>): string {
  let sql = '';  

  if (group !== undefined) {     
    if (group.groups.value && group.groups.value.length > 0) {
      group.groups.ornull?.map((g, i) => {
        if (i > 0 && sql !== '') {
          sql += ` ${group.link.value.toUpperCase()} `;
        }
        sql += BuildQuery(g)
      });
    }

    if(sql !== "" && group.groups.value && group.groups.value?.length > 0){
      sql += ` ${group.link.value.toUpperCase()} `;
    }
  
    if (group.filter.length > 0) {
      for (let i = 0; i < group.filter.length ; i++) {
        if (group.filter[i] && group.filter[i]?.col && group.filter[i]?.type && group.filter[i]?.values && group.filter[i]?.values.length !== 0) {
          if (i != 0) {
              sql += ` ${group.link.value?.toUpperCase()} `;
          }
          if (group.filter[i]?.type.value !== "between" && group.filter[i]?.type.value !== "in" && group.filter[i]?.values[0]) {
            sql += `"${group.filter[i]?.col.value ?? ""}" ${getOperator(group.filter[i]?.type.value ?? "invalid")} '${group.filter[i]?.values[0]?.value ?? ""}'`;
          } else {
            if (group.filter[i]?.type.value === "between" && group.filter[i]?.values[0] !== undefined && group.filter[i]?.values[1] !== undefined) {
              sql += `"${group.filter[i]?.col.value ?? ""}" ${getOperator(group.filter[i]?.type.value ?? "invalid")} ${group.filter[i]?.values.value.map(v => `'${v}'`).join(' AND ') ?? ""}`;
            } else if(group.filter[i]?.type.value === "in" && group.filter[i]?.values[0] !== undefined) {
              sql += `"${group.filter[i]?.col.value ?? ""}" ${getOperator(group.filter[i]?.type.value ?? "invalid")} (${group.filter[i]?.values.value.map(v => `'${v}'`).join(', ') ?? ""})`;
            }
          }
        }
      } 
    }

    if ( sql !== "") {
      if(group.not.value){
        sql = 'NOT ' + sql;
      }
      sql = "(" + sql + ")"
    }
  }

  return sql;
}

function getOperator(type: string): string {
  switch (type) {
    case 'equal':
      return '=';
    case 'in':
      return 'IN';
    case 'less':
      return '<';
    case 'lessequal':
      return '<=';
    case 'more':
      return '>';
    case 'moreequal':
      return '>=';
    case 'between':
      return 'BETWEEN';
    default:
      throw new Error(`Invalid filter type: ${type}`);
  }
}

const ExampleComponent: NextPage = () => {
  const state = useHookstate<group[] | undefined>([
    {
      not: false,
      link: 'AND',
      filter:[{
        col: 'CBH_Donor_ID',
        type: 'equal',
        values: [],
      }],         
    },
  ]);
  
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
                  <div className="col-span-6 h-[95vh] overflow-y-auto w-full overflow-x-hidden font-poppins">
                      <h1 className="text-5xl mt-5 ml-5 mb-2 text-green-900">Expert Search</h1>
                      <div className='max-h-[600px] mx-3 overflow-x-auto overflow-y-auto'>
                          <GroupListEditor groups={state} deleteDisabled={true} />
                      </div>
                      <Table filter={state}/>
                  </div>
              </span>
          </div>
          {/*<JsonDump state={state} />*/}
      </>
  )
}
export default ExampleComponent;

function GroupContentEditor(props: {childrenState: State<group[] | undefined>, index: number, deleteDisabled: boolean, groupState: State<group[] | undefined>, linkState: State<string>, notState: State<boolean>, filterState: State<{col:string, type:string, values:string[]}[]>}) {
    const link = useHookstate(props.linkState);
    const filter = useHookstate(props.filterState);
    const group = useHookstate(props.groupState);
    const not = useHookstate(props.notState);
    const children = useHookstate(props.childrenState);

    const i = props.index;
    const disabled = props.deleteDisabled

    return <>
        <div className='bg-gray-100 mx-5'>
            <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
              <div className='mr-5'>
                <OverlayTrigger trigger="hover" placement="bottom" rootClose={true} overlay={
                  <Popover id="popover-basic">
                  <Popover.Body className="bg-white rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md text-center">
                    <div>
                      The buttons for AND or OR indicate how the different filters should be connected within the group. <br/>
                      Underneath you select the column which should be filtered and in which form and then you enter the value.                   
                    </div>
                  </Popover.Body>
                </Popover>
                }>
                <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md rounded-lg">help</button>
                </OverlayTrigger>
              </div>
                <div className='bg-gray-300 rounded-sm px-3'>
                    <input type="checkbox" id="not" name="not" value="not" onChange={() => not.set(!not.value)}/><label>NOT</label>
                </div>

                <button className={`${link.value === "AND" ? "bg-blue-700" : "bg-blue-400"} text-white px-3 rounded-sm`} onClick={() => link.set('AND')}>AND</button>
                <button className={`${link.value === "OR" ? "bg-blue-700" : "bg-blue-400"} text-white px-3 rounded-sm`} onClick={() => link.set('OR')}>OR</button>
            
                <div className='ml-96'>
                    <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => children.set(groups => (groups || []).concat([{not: false, link: 'AND', filter:[{col: 'CBH_Donor_ID', type: 'equal', values: []}]}]))}>new Group</button>
                    <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => filter.set(filters => (filters || []).concat([{col: 'CBH_Donor_ID', type: 'equal', values: []}]))}>new Rule</button>
                    <button className={`bg-red-500 text-white mx-2 px-2 rounded-sm ${disabled ? 'hidden' : ''}`} onClick={() => group.set((group) => group?.filter((_, index) => index !== i))} >delete</button>
                </div>
            </div>

            {filter.ornull && filter.ornull.map((filterState: State<{col:string, type:string, values:string[]}>, i) =>
                <div key={i}>
                    <ColSelect col= {filterState.col}/>
                    <TypeSelect type= {filterState.type} values={filterState.values}/>
                    <button className='bg-red-500 text-white mx-2 px-2 rounded-sm' onClick={() => filter.set((filter) => filter.filter((_, index) => index !== i))} >delete</button>
                    <ChooseValues type= {filterState.type} values={filterState.values}/>
                </div>
            )}
        </div>
    </>
}

function GroupListEditor(props: { groups: State<group[] | undefined>, deleteDisabled: boolean, }) {
    const state = useHookstate(props.groups);
    const disabled = props.deleteDisabled

    return (
        <div className={`bg-gray-100 mx-5 py-1 border-solid border-black min-w-[1100px] w-fit ${(state.value && state.value.length > 0) ? 'border-2' : 'border-0'}`} style={{ paddingLeft: 20 }}>
            {state.ornull && state.ornull.map((groupState: State<group>, i) =>
                <div key={i}>
                    <GroupContentEditor linkState={groupState.link} childrenState={groupState.groups} filterState={groupState.filter} groupState={state} index={i} deleteDisabled={disabled} notState={groupState.not}/>
                    <GroupListEditor groups={groupState.groups} deleteDisabled={false} />
                </div>
            )}
        </div>
    )
}

function JsonDump(props: { state: State<group[] | undefined> }) {
    const state = useHookstate(props.state);
    
    return <p>
        Current state: {JSON.stringify(state.value)} <br/>
    </p>
}

function ColSelect(props: {col: State<string>}) {
    const col = useHookstate(props.col);

    return (
        <select name="col" id="col" onChange={(e) => col.set(e.target.value)}>
            <option value={'CBH_Donor_ID'}>CBH_Donor_ID</option>
            <option value={'CBH_Master_ID'}>CBH_Master_ID</option>
            <option value={'CBH_Sample_ID'}>CBH_Sample_ID</option>
            <option value={'Price'}>Price</option>
            <option value={'Quantity'}>Quantity</option>
            <option value={'Unit'}>Unit</option>
            <option value={'Matrix'}>Matrix</option>
            <option value={'Storage_Temperature'}>Storage_Temperature</option>
            <option value={'Freeze_Thaw_Cycles'}>Freeze_Thaw_Cycles</option>
            <option value={'Sample_Condition'}>Sample_Condition</option>
            <option value={'Infectious_Disease_Test_Result'}>Infectious_Disease_Test_Result</option>
            <option value={'Gender'}>Gender</option>
            <option value={'Age'}>Age</option>
            <option value={'Ethnicity'}>Ethnicity</option>
            <option value={'BMI'}>BMI</option>
            <option value={'Lab_Parameter'}>Lab_Parameter</option>
            <option value={'Result_Interpretation'}>Result_Interpretation</option>
            <option value={'Result_Raw'}>Result_Raw</option>
            <option value={'Result_Numerical'}>Result_Numerical</option>
            <option value={'Result_Unit'}>Result_Unit</option>
            <option value={'Cut_Off_Raw'}>Cut_Off_Raw</option>
            <option value={'Cut_Off_Numerical'}>Cut_Off_Numerical</option>
            <option value={'Test_Method'}>Test_Method</option>
            <option value={'Test_System'}>Test_System</option>
            <option value={'Test_System_Manufacturer'}>Test_System_Manufacturer</option>
            <option value={'Result_Obtained_From'}>Result_Obtained_From</option>
            <option value={'Diagnosis'}>Diagnosis</option>
            <option value={'Diagnosis_Remarks'}>Diagnosis_Remarks</option>
            <option value={'ICD_Code'}>ICD_Code</option>
            <option value={'Pregnancy_Week'}>Pregnancy_Week</option>
            <option value={'Pregnancy_Trimester'}>Pregnancy_Trimester</option>
            <option value={'Medication'}>Medication</option>
            <option value={'Therapy'}>Therapy</option>
            <option value={'Histological_Diagnosis'}>Histological_Diagnosis</option>
            <option value={'Organ'}>Organ</option>
            <option value={'Disease_Presentation'}>Disease_Presentation</option>
            <option value={'TNM_Class_T'}>TNM_Class_T</option>
            <option value={'TNM_Class_N'}>TNM_Class_N</option>
            <option value={'TNM_Class_M'}>TNM_Class_M</option>
            <option value={'Tumour_Grade'}>Tumour_Grade</option>
            <option value={'Tumour_Stage'}>Tumour_Stage</option>
            <option value={'Viable_Cells__per_'}>Viable_Cells__per_</option>
            <option value={'Necrotic_Cells__per_'}>Necrotic_Cells__per_</option>
            <option value={'Tumour_Cells__per_'}>Tumour_Cells__per_</option>
            <option value={'Proliferation_Rate__Ki67_per_'}>Proliferation_Rate__Ki67_per_</option>
            <option value={'Estrogen_Receptor'}>Estrogen_Receptor</option>
            <option value={'Progesteron_Receptor'}>Progesteron_Receptor</option>
            <option value={'HER_2_Receptor'}>HER_2_Receptor</option>
            <option value={'Other_Gene_Mutations'}>Other_Gene_Mutations</option>
            <option value={'Country_of_Collection'}>Country_of_Collection</option>
            <option value={'Date_of_Collection'}>Date_of_Collection</option>
            <option value={'Procurement_Type'}>Procurement_Type</option>
            <option value={'Informed_Consent'}>Informed_Consent</option>
        </select>
    )
}

function TypeSelect(props: {type: State<string>, values: State<string[]>}){
    const type = useHookstate(props.type);
    const values = useHookstate(props.values);

    return (
        <select className='mr-10' onChange={(e) => {values.set([]); type.set(e.target.value); }}>
            <option value={'equal'}>equal to</option>
            <option value={'in'}>in</option>
            <option value={'less'}>less than</option>
            <option value={'lessequal'}>less than or equal to</option>
            <option value={'more'}>greater than</option>
            <option value={'moreequal'}>greater than or equal to</option>
            <option value={'between'}>between</option>
        </select>
    )
}

function ChooseValues(props: {values: State<string[]>, type: State<string>}) {
    const type = useHookstate(props.type);
    const values = useHookstate(props.values);

    return (
        <>
            {(type.value !== 'between' && type.value !== 'in') && (
                <input className='border-solid border-black border-2 mx-2' value={values[0]?.value ?? ''} onChange={(e) => values.set([e.target.value])}></input>
            )}
            {(type.value === 'between') && (
                <>
                    <input className='border-solid border-black border-2 mx-2' value={values[0]?.value ?? ''} onChange={(e) => {
                        if (values.length < 2) { 
                            values.set([e.target.value])
                        } else { 
                            values.set(a => [e.target.value, a[1] ?? ''])
                        }
                    }}></input>
                    <input className='border-solid border-black border-2 mx-2' value={values[1]?.value ?? ''} onChange={(e) => {
                        if (values.length === 0){
                            values.set(['', e.target.value])
                        } else {
                            values.set(a => [a[0] ?? '', e.target.value])
                        }
                    }}></input>
                </>
            )}
            {(type.value === 'in') && (
                <>
                    <input className='border-solid border-black border-2 mx-2' onKeyDown={e => {
                        if(e.key === "Enter"){
                            values.set(v => (v || []).concat([e.currentTarget.value]))
                            e.currentTarget.value = ""
                        }
                    }}></input>

                    {values.value.map((value: string, i) => {
                        return(
                            <div key={i} className='bg-red-400 w-fit px-2'>
                                {value}                  
                                <button onClick={() => values.set((value) => value.filter((_, index) => index !== i))}><BiX/></button>
                            </div> 
                        )
                    })}
                </>
            )}
        </>
    )
}

type props = { filter: State<group[] | undefined> }

const Table: React.FC<props> = ({filter}) => {
      const [page, setPage] = useState<number>(1)
      const [pagelength, setPagelength] = useState<number>(50)
      const [search, ] = useState<string | undefined>()
      const [range, setRange] = useState<number[]>([])
      const [filterQuery, setFilterQuery] = useState<string>("")
      
      const filters = useHookstate(filter)
      const defaultShow: boolean[] = []
    
      for(let i = 0; i < pagelength; i++){
        defaultShow.push(false)
      }
    
      const [show, setShow] = useState<boolean[]>(defaultShow)

      const { data: samples, refetch: refetchSamples } = api.samples.applyFilter.useQuery({query: filterQuery, pages: page , pagelength: pagelength})
      const { data: count } = api.samples.count.useQuery()
      
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
    
      useEffect(() => {
        const newShow: boolean[] = []
        for(let i = 0; i < pagelength; i++){
          newShow.push(false)
        }
        setShow(newShow)
      }, [pagelength])
    
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

      const handlePageLengthChange = (length: number) => {
        setPagelength(length);
      };


    return(
        <>
            <div className="mx-4 my-5">
              <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => {filters.ornull && filters.ornull.map((group: State<group>) => { setFilterQuery(BuildQuery(group))})}}>Apply Filter</button>
              <button className='bg-[rgb(208,165,96)] text-white px-3 rounded-lg' onClick={() => filters.set([{not: false, link: 'AND', filter:[{col: 'CBH_Donor_ID', type: 'equal', values: [],}],}],)}>Reset</button>
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
        </>
    )
}