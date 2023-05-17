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

type group = {
  not: boolean,
  link: string,
  activated: boolean,
  filter: {
    col: string,
    type: string,
    values: string[],
    activated: boolean,
  }[],
  groups?: group[],
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

function BuildQuery(group: State<group>): string {
  let sql = '';

  if (group !== undefined && group.activated.value === true) {
    if (group.groups.value && group.groups.value.length > 0) {
      group.groups.ornull?.map((g, i) => {
        if (i > 0 && sql !== '') {
          sql += ` ${group.link.value.toUpperCase()} `;
        }
        sql += BuildQuery(g)
      });
    }

    if (sql !== "" && group.filter.value && group.filter.value?.length > 0) {
      for (let i = 0; i < group.filter.length; i++) {
        if (group.filter[i] && group.filter[i]?.col && group.filter[i]?.type && group.filter[i]?.values && group.filter[i]?.values.length !== 0 && group.filter[i]?.activated.value === true) {
          sql += ` ${group.link.value.toUpperCase()} `;
          break
        }
      }
    }

    let filterCount = 0;
    if (group.filter.length > 0) {
      for (let i = 0; i < group.filter.length; i++) {
        if (group.filter[i] && group.filter[i]?.col && group.filter[i]?.type && group.filter[i]?.values && group.filter[i]?.values.length !== 0 && (getOperator(group.filter[i]?.type.value ?? 'invalid')) !== 'invalid' && group.filter[i]?.activated.value === true) {
          let tempSql = ""
          
          if (group.filter[i]?.type.value !== "between" && group.filter[i]?.type.value !== "in" && group.filter[i]?.values[0] && group.filter[i]?.values[0]?.value !== "") {
            tempSql += `"${group.filter[i]?.col.value ?? ""}" ${getOperator(group.filter[i]?.type.value ?? "invalid")} '${group.filter[i]?.values[0]?.value ?? ""}'`;
          } else {
            if (group.filter[i]?.type.value === "between" && group.filter[i]?.values[0] !== undefined && group.filter[i]?.values[0]?.value !== "" && group.filter[i]?.values[1] !== undefined && group.filter[i]?.values[1]?.value !== "") {
              tempSql += `"${group.filter[i]?.col.value ?? ""}" ${getOperator(group.filter[i]?.type.value ?? "invalid")} ${group.filter[i]?.values.value.map(v => `'${v}'`).join(' AND ') ?? ""}`;
            } else if (group.filter[i]?.type.value === "in" && group.filter[i]?.values[0] !== undefined) {
              tempSql += `"${group.filter[i]?.col.value ?? ""}" ${getOperator(group.filter[i]?.type.value ?? "invalid")} (${group.filter[i]?.values.value.map(v => `'${v}'`).join(', ') ?? ""})`;
            }
          }

          if(tempSql !== ""){
            if (filterCount !== 0 ) {
              tempSql = `${group.link.value?.toUpperCase()}` + tempSql;
            }
            sql += tempSql
            filterCount++;
          }
        }
      }
    }

    if (sql !== "") {
      if (group.not.value) {
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
      return 'invalid';
  }
}

const ExpertSearch: NextPage = () => {
  const state = useHookstate<group[] | undefined>([
    {
      not: false,
      link: 'AND',
      activated: true,
      filter: [{
        col: 'CBH_Donor_ID',
        type: 'equal',
        values: [],
        activated: true,
      }],
    },
  ]);

  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-200 min-h-screen max-h-screen overflow-x-hidden overflow-y-hidden">
        <div className="flex flex-col">
          <Header />
          <div className="flex flex-row">
            <Sidebar />
            <div className="col-span-6 h-[95vh] overflow-y-auto w-full overflow-x-hidden font-poppins">
              <h1 className="text-5xl mt-5 ml-5 mb-2 text-green-900">Expert Search</h1>
              <div className='max-h-[600px] mx-3 overflow-x-auto overflow-y-auto'>
                <GroupListEditor groups={state} deleteDisabled={true} />
              </div>
              <Table filter={state} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ExpertSearch;

function GroupContentEditor(props: { childrenState: State<group[] | undefined>, index: number, deleteDisabled: boolean, groupState: State<group[] | undefined>, linkState: State<string>, activatedState: State<boolean>, notState: State<boolean>, filterState: State<{ col: string, type: string, values: string[], activated: boolean }[]> }) {
  const link = useHookstate(props.linkState);
  const filter = useHookstate(props.filterState);
  const group = useHookstate(props.groupState);
  const not = useHookstate(props.notState);
  const children = useHookstate(props.childrenState);
  const activated = useHookstate(props.activatedState);

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
                  The buttons for AND or OR indicate how the different filters should be connected within the group. <br />
                  Underneath you select the column which should be filtered and in which form and then you enter the value.
                </div>
              </Popover.Body>
            </Popover>
          }>
            <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md rounded-lg">help</button>
          </OverlayTrigger>
        </div>
        <div className='bg-gray-300 rounded-sm px-3'>
          <input type="checkbox" id="not" name="not" value="not" onChange={() => not.set(!not.value)} /><label>NOT</label>
        </div>

        <button className={`${link.value === "AND" ? "bg-blue-700" : "bg-blue-400"} text-white px-3 rounded-sm`} onClick={() => link.set('AND')}>AND</button>
        <button className={`${link.value === "OR" ? "bg-blue-700" : "bg-blue-400"} text-white px-3 rounded-sm`} onClick={() => link.set('OR')}>OR</button>

        <div className='ml-96'>
          <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => children.set(groups => (groups || []).concat([{ not: false, link: 'AND', activated: true, filter: [{ col: 'CBH_Donor_ID', type: 'equal', values: [] , activated: true}] }]))}>new Group</button>
          <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => filter.set(filters => (filters || []).concat([{ col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true}]))}>new Rule</button>
          <button className={`bg-orange-400 text-white mx-2 px-2 rounded-sm `} onClick={() => activated.set(!activated.value)}>{activated.value ? "deactivate": "activate"}</button>
          <button className={`bg-red-500 text-white mx-2 px-2 rounded-sm ${disabled ? 'hidden' : ''}`} onClick={() => group.set((group) => group?.filter((_, index) => index !== i))} >delete</button>
        </div>
      </div>

      {filter.ornull && filter.ornull.map((filterState: State<{ col: string, type: string, values: string[], activated: boolean }>, i) =>
        <div key={i}>
          <ColSelect col={filterState.col} activated={activated} filterActivated={filterState.activated}/>
          <TypeSelect type={filterState.type} values={filterState.values} activated={activated} filterActivated={filterState.activated}/>
          <button className='bg-orange-400 text-white mx-2 px-2 rounded-sm' onClick={() => filterState.activated.set(!filterState.activated.value)} >{filterState.activated.value ? "deactivate": "activate"}</button>
          <button className='bg-red-500 text-white mx-2 px-2 rounded-sm' onClick={() => filter.set((filter) => filter.filter((_, index) => index !== i))} >delete</button>
          <ChooseValues type={filterState.type} values={filterState.values} activated={activated} filterActivated={filterState.activated}/>
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
          <GroupContentEditor linkState={groupState.link} activatedState={groupState.activated} childrenState={groupState.groups} filterState={groupState.filter} groupState={state} index={i} deleteDisabled={disabled} notState={groupState.not} />
          <GroupListEditor groups={groupState.groups} deleteDisabled={false} />
        </div>
      )}
    </div>
  )
}

function ColSelect(props: { col: State<string>, activated: State<boolean>, filterActivated: State<boolean>}) {
  const col = useHookstate(props.col);
  const activated = useHookstate(props.activated);
  const filterActivated = useHookstate(props.filterActivated);

  return (
    <select name="col" id="col" onChange={(e) => col.set(e.target.value)} disabled = {!(activated.value && filterActivated.value)}>
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

function TypeSelect(props: { type: State<string>, values: State<string[]>, activated: State<boolean>, filterActivated: State<boolean>}) {
  const type = useHookstate(props.type);
  const values = useHookstate(props.values);
  const activated = useHookstate(props.activated);
  const filterActivated = useHookstate(props.filterActivated);

  return (
    <select className='mr-10' onChange={(e) => { values.set([]); type.set(e.target.value); }} disabled = {!(activated.value && filterActivated.value)}>
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

function ChooseValues(props: { values: State<string[]>, type: State<string>, activated: State<boolean>, filterActivated: State<boolean>}) {
  const type = useHookstate(props.type);
  const values = useHookstate(props.values);
  const activated = useHookstate(props.activated);
  const filterActivated = useHookstate(props.filterActivated);

  return (
    <>
      {(type.value !== 'between' && type.value !== 'in') && (
        <input className='border-solid border-black border-2 mx-2' value={values[0]?.value ?? ''} onChange={(e) => {e.target.value !== "" ? values.set([e.target.value]) : values.set([])}} disabled = {!(activated.value && filterActivated.value)}></input>
      )}
      {(type.value === 'between') && (
        <>
          <input className='border-solid border-black border-2 mx-2' value={values[0]?.value ?? ''} onChange={(e) => {
            if (values.length < 2) {
              values.set([e.target.value])
            } else {
              values.set(a => [e.target.value, a[1] ?? ''])
            }
          }} disabled = {!(activated.value && filterActivated.value)}></input>
          <input className='border-solid border-black border-2 mx-2' value={values[1]?.value ?? ''} onChange={(e) => {
            if (values.length === 0) {
              values.set(['', e.target.value])
            } else {
              values.set(a => [a[0] ?? '', e.target.value])
            }
          }} disabled = {!(activated.value && filterActivated.value)}></input>
        </>
      )}
      {(type.value === 'in') && (
        <>
          <input className='border-solid border-black border-2 mx-2' onKeyDown={e => {
            if (e.key === "Enter" && e.currentTarget.value !== "") {
              values.set(v => (v || []).concat([e.currentTarget.value]))
              e.currentTarget.value = ""
            }
          }} disabled = {!(activated.value && filterActivated.value)}></input>

          {values.value.map((value: string, i) => {
            return (
              <div key={i} className='bg-red-400 w-fit px-2'>
                {value}
                <button onClick={() => values.set((value) => value.filter((_, index) => index !== i))}><BiX /></button>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}

type props = { filter: State<group[] | undefined> }

const Table: React.FC<props> = ({ filter }) => {
  const [page, setPage] = useState<number>(1)
  const [pagelength, setPagelength] = useState<number>(50)
  const [search,] = useState<string | undefined>()
  const [range, setRange] = useState<number[]>([])
  const [filterQuery, setFilterQuery] = useState<string>("")

  const filters = useHookstate(filter)
  const defaultShow: boolean[] = []

  const [tableSamples, setTableSamples] = useState<TableSamples[]>([])

  for (let i = 0; i < pagelength; i++) {
    defaultShow.push(false)
  }

  const [show, setShow] = useState<boolean[]>(defaultShow)

  //Test
  const { data: samples, refetch: refetchSamples } = api.samples.applyFilter.useQuery({ query: filterQuery, pages: page, pagelength: pagelength })
  const { data: count } = api.samples.countExpert.useQuery({ query: filterQuery })

  useEffect(() => {
    void refetchSamples()
  }, [search, page, pagelength, refetchSamples])

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
      for(let i = 0; i<samples?.length; i++){
        if(newArray.find(sample => sample.CBH_Sample_ID === samples[i]?.CBH_Sample_ID)){
          const sampleIndex = newArray.findIndex(sample => sample.CBH_Sample_ID === samples[i]?.CBH_Sample_ID)
          if(samples[i]?.Lab_Parameter) newArray[sampleIndex]?.Lab_Parameter?.push(samples[i]?.Lab_Parameter ?? "")
          if(samples[i]?.Result_Interpretation) newArray[sampleIndex]?.Result_Interpretation?.push(samples[i]?.Result_Interpretation ?? "")
          if(samples[i]?.Result_Raw) newArray[sampleIndex]?.Result_Raw?.push(samples[i]?.Result_Raw ?? "")
          if(samples[i]?.Result_Numerical) newArray[sampleIndex]?.Result_Numerical?.push(samples[i]?.Result_Numerical ?? 0)
          if(samples[i]?.Result_Unit) newArray[sampleIndex]?.Result_Unit?.push(samples[i]?.Result_Unit ?? "")
          if(samples[i]?.Cut_Off_Raw) newArray[sampleIndex]?.Cut_Off_Raw?.push(samples[i]?.Cut_Off_Raw ?? "")
          if(samples[i]?.Cut_Off_Numerical) newArray[sampleIndex]?.Cut_Off_Numerical?.push(samples[i]?.Cut_Off_Numerical ?? 0)
          if(samples[i]?.Test_Method) newArray[sampleIndex]?.Test_Method?.push(samples[i]?.Test_Method ?? "")
          if(samples[i]?.Test_System) newArray[sampleIndex]?.Test_System?.push(samples[i]?.Test_System ?? "")
          if(samples[i]?.Test_System_Manufacturer) newArray[sampleIndex]?.Test_System_Manufacturer?.push(samples[i]?.Test_System_Manufacturer ?? "")
          if(samples[i]?.Result_Obtained_From) newArray[sampleIndex]?.Result_Obtained_From?.push(samples[i]?.Result_Obtained_From ?? "")
          if(samples[i]?.Diagnosis) newArray[sampleIndex]?.Diagnosis?.push(samples[i]?.Diagnosis ?? "")
          if(samples[i]?.Diagnosis_Remarks) newArray[sampleIndex]?.Diagnosis_Remarks?.push(samples[i]?.Diagnosis_Remarks ?? "")
          if(samples[i]?.ICD_Code) newArray[sampleIndex]?.ICD_Code?.push(samples[i]?.ICD_Code ?? "")
          if(samples[i]?.Medication) newArray[sampleIndex]?.Medication?.push(samples[i]?.Medication ?? "")
          if(samples[i]?.Therapy) newArray[sampleIndex]?.Therapy?.push(samples[i]?.Therapy ?? "")
          if(samples[i]?.Histological_Diagnosis) newArray[sampleIndex]?.Histological_Diagnosis?.push(samples[i]?.Histological_Diagnosis ?? "")
          if(samples[i]?.Other_Gene_Mutations) newArray[sampleIndex]?.Other_Gene_Mutations?.push(samples[i]?.Other_Gene_Mutations ?? "")
        } else{
          newArray.push(
            { id:                               samples[i]?.id ?? "",
              CBH_Donor_ID:                     samples[i]?.CBH_Donor_ID ?? undefined,
              CBH_Master_ID:                    samples[i]?.CBH_Master_ID ?? undefined,
              CBH_Sample_ID:                    samples[i]?.CBH_Sample_ID ?? undefined,
              Price:                            samples[i]?.Price ?? undefined,
              Quantity:                         samples[i]?.Quantity ?? undefined,
              Unit:                             samples[i]?.Unit ?? undefined,
              Matrix:                           samples[i]?.Matrix ?? undefined,
              Storage_Temperature:              samples[i]?.Storage_Temperature ?? undefined,
              Freeze_Thaw_Cycles:               samples[i]?.Freeze_Thaw_Cycles ?? undefined,
              Sample_Condition:                 samples[i]?.Sample_Condition ?? undefined,
              Infectious_Disease_Test_Result:   samples[i]?.Infectious_Disease_Test_Result ?? undefined,
              Gender:                           samples[i]?.Gender ?? undefined,
              Age:                              samples[i]?.Age ?? undefined,
              Ethnicity:                        samples[i]?.Ethnicity ?? undefined,
              BMI:                              samples[i]?.BMI ?? undefined,
              Lab_Parameter:                    samples[i]?.Lab_Parameter ? [samples[i]?.Lab_Parameter ?? ""] : [],
              Result_Interpretation:            samples[i]?.Result_Interpretation ? [samples[i]?.Result_Interpretation ?? ""] : [],
              Result_Raw:                       samples[i]?.Result_Raw ? [samples[i]?.Result_Raw ?? ""] : [],
              Result_Numerical:                 samples[i]?.Result_Numerical ? [samples[i]?.Result_Numerical ?? 0] : [],
              Result_Unit:                      samples[i]?.Result_Unit ? [samples[i]?.Result_Unit ?? ""] : [],
              Cut_Off_Raw:                      samples[i]?.Cut_Off_Raw ? [samples[i]?.Cut_Off_Raw ?? ""] : [],
              Cut_Off_Numerical:                samples[i]?.Cut_Off_Numerical ? [samples[i]?.Cut_Off_Numerical ?? 0] : [],
              Test_Method:                      samples[i]?.Test_Method ? [samples[i]?.Test_Method ?? ""] : [],
              Test_System:                      samples[i]?.Test_System ? [samples[i]?.Test_System ?? ""] : [],
              Test_System_Manufacturer:         samples[i]?.Test_System_Manufacturer ? [samples[i]?.Test_System_Manufacturer ?? ""] : [],
              Result_Obtained_From:             samples[i]?.Result_Obtained_From ? [samples[i]?.Result_Obtained_From ?? ""] : [],
              Diagnosis:                        samples[i]?.Diagnosis ? [samples[i]?.Diagnosis ?? ""] : [],
              Diagnosis_Remarks:                samples[i]?.Diagnosis_Remarks ? [samples[i]?.Diagnosis_Remarks ?? ""] : [],
              ICD_Code:                         samples[i]?.ICD_Code ? [samples[i]?.ICD_Code ?? ""] : [],
              Pregnancy_Week:                   samples[i]?.Pregnancy_Week ?? undefined,
              Pregnancy_Trimester:              samples[i]?.Pregnancy_Trimester ?? undefined,
              Medication:                       samples[i]?.Medication ? [samples[i]?.Medication ?? ""] : [],
              Therapy:                          samples[i]?.Therapy ? [samples[i]?.Therapy ?? ""] : [],
              Histological_Diagnosis:           samples[i]?.Histological_Diagnosis ? [samples[i]?.Histological_Diagnosis ?? ""] : [],
              Organ:                            samples[i]?.Organ ?? undefined,
              Disease_Presentation:             samples[i]?.Disease_Presentation ?? undefined,
              TNM_Class_T:                      samples[i]?.TNM_Class_T ?? undefined,
              TNM_Class_N:                      samples[i]?.TNM_Class_N ?? undefined,
              TNM_Class_M:                      samples[i]?.TNM_Class_M ?? undefined,
              Tumour_Grade:                     samples[i]?.Tumour_Grade ?? undefined,
              Tumour_Stage:                     samples[i]?.Tumour_Stage ?? undefined,
              Viable_Cells__per_:               samples[i]?.Viable_Cells__per_ ?? undefined,
              Necrotic_Cells__per_:             samples[i]?.Necrotic_Cells__per_ ?? undefined,
              Tumour_Cells__per_:               samples[i]?.Tumour_Cells__per_ ?? undefined,
              Proliferation_Rate__Ki67_per_:    samples[i]?.Proliferation_Rate__Ki67_per_ ?? undefined,
              Estrogen_Receptor:                samples[i]?.Estrogen_Receptor ?? undefined,
              Progesteron_Receptor:             samples[i]?.Progesteron_Receptor ?? undefined,
              HER_2_Receptor:                   samples[i]?.HER_2_Receptor ?? undefined,
              Other_Gene_Mutations:             samples[i]?.Other_Gene_Mutations ? [samples[i]?.Other_Gene_Mutations ?? ""] : [],
              Country_of_Collection:            samples[i]?.Country_of_Collection ?? undefined,
              Date_of_Collection:               samples[i]?.Date_of_Collection ?? undefined,
              Procurement_Type:                 samples[i]?.Procurement_Type ?? undefined,
              Informed_Consent:                 samples[i]?.Informed_Consent ?? undefined,
            }
          )
        }
      }
    }
    
    setTableSamples(newArray)

  }, [samples])

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

  const handlePageLengthChange = (length: number) => {
    setPagelength(length);
  };


  return (
    <>
      
      <div className="mx-4 my-5">
        <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => { filters.ornull && filters.ornull.map((group: State<group>) => { setFilterQuery(BuildQuery(group)) }) }}>Apply Filter</button>
        <button className='bg-[rgb(208,165,96)] text-white px-3 rounded-lg' onClick={() => filters.set([{ not: false, link: 'AND', activated: true, filter: [{ col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true }], }],)}>Reset</button>

        <div className="flex flex-row w-full items-center justify-center mt-5">
          <Footer range={range} page={page} setPage={setPage} />

          <p className="ml-4">Show rows</p>
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
            {tableSamples?.map((sample, index) => (
              <>
                <tr key={index} className="text-center">
                  <td className="items-center text-2xl bg-gray-300 rounded-l-xl"><button><BiCartAdd className="relative top-1" /></button></td>
                  <td className="py-2 px-3 bg-gray-300">{sample.CBH_Donor_ID}</td>
                  <td className="py-2 px-3 bg-gray-300">{sample.CBH_Sample_ID}</td>
                  <td className="items-center text-2xl bg-gray-300"><button onClick={() => { updateState(index) }}><BiDetail className="relative top-1" /></button></td>
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
      <div className="flex flex-row w-full items-center justify-center">
        <Footer range={range} page={page} setPage={setPage} />

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