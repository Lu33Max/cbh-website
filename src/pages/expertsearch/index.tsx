import React from 'react';
import { useHookstate, State } from '@hookstate/core';
import { NextPage } from 'next';

import { BiCartAdd, BiDetail, BiX } from "react-icons/bi"
import { group } from 'console';


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

const ExampleComponent:NextPage = () => {
    const state = useHookstate<group[] | undefined>([
        {
            not: false,
            link: 'AND',
            filter:[{
                col: 'CBH_Donor_ID',
                type: 'equal',
                values: [],
            }],
            groups: [{
                not: false,
                link: 'AND',
                filter:[{
                    col: 'CBH_Donor_ID',
                    type: 'equal',
                    values: [],
                }],                
            }],            
        },
    ]);
    return <>
        <JsonDump state={state} />
        <GroupListEditor groups={state} />
    </>
}
export default ExampleComponent;

function GroupNameEditor(props: {childrenState: State<group[] | undefined>, index: number, groupState: State<group[] | undefined>, linkState: State<string>, notState: State<boolean>, filterState: State<{col:string, type:string, values:string[]}[]>}) {
    // scoped state is optional for performance
    // could have used props.nameState everywhere instead
    const link = useHookstate(props.linkState);
    const filter = useHookstate(props.filterState);
    const group = useHookstate(props.groupState);
    const not = useHookstate(props.notState);
    const children = useHookstate(props.childrenState);

    const i = props.index;

    return <>
        <div className='bg-orange-100 mx-5'>
            <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
                <div className='bg-gray-300 rounded-s px-3'>
                    <input type="checkbox" id="not" name="not" value="not" onChange={() => not.set(!not.value)}/><label>NOT</label>
                </div>
                <button className='bg-blue-700 text-white px-3 rounded-s' onClick={() => link.set('AND')}>AND</button>
                <button className='bg-blue-400 text-white px-3 rounded-s' onClick={() => link.set('OR')}>OR</button>
            
                <div className='ml-96'>
                    <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => children.set(groups => (groups || []).concat([{not: false, link: 'and', filter:[{col: 'CBH_Donor_ID', type: 'equal', values: []}]}]))}>new Group</button>
                    <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg' onClick={() => filter.set(filters => (filters || []).concat([{col: 'CBH_Donor_ID', type: 'equal', values: []}]))}>new Rule</button>
                    <button className='bg-red-500 text-white mx-2 px-2 rounded-sm' onClick={() => group.set((group) => group?.filter((_, index) => index !== i))} >delete</button>
                </div>
            </div>
            {filter.ornull && filter.ornull.map((filterState: State<{col:string, type:string, values:string[]}>, i) =>
            <div key={i}>
                <ColSelect col= {filterState.col}/>
                <TypeSelect type= {filterState.type} values={filterState.values}/>
                <button className='bg-red-500 text-white mx-2 px-2 rounded-sm' onClick={() => filter.set((filter) => filter.filter((_, index) => index !== i))} >delete</button>
                <ChooseValues type= {filterState.type} values={filterState.values}/>
                {/*
                <FilterNameEditor filterState={filterState} />
                <GroupNameEditor nameState={state} filterState={filter} /> 
                */}
            </div>
            )}
        </div>
    </>
}
function FilterNameEditor(props: { filterState: State<{col:string, type:string, values?:string[]}>}){
    const filter = useHookstate(props.filterState);
    return<>
    hallo
    </>

}

function GroupListEditor(props: { groups: State<group[] | undefined> }) {
    // scoped state is optional for performance
    // could have used props.groups everywhere instead
    const state = useHookstate(props.groups);
    return <div className='bg-orange-100 mx-5' style={{ paddingLeft: 20 }}>
        {state.ornull && state.ornull.map((groupState: State<group>, i) =>
            <div key={i}>
                <GroupNameEditor linkState={groupState.link} childrenState={groupState.groups} filterState={groupState.filter} groupState={state} index={i} notState={groupState.not}/>
                <GroupListEditor groups={groupState.groups} />
            </div>
        )}
    </div>
}

function JsonDump(props: { state: State<group[] | undefined> }) {
    // scoped state is optional for performance
    // could have used props.state everywhere instead
    const state = useHookstate(props.state);
    return <p>
        Current state: {JSON.stringify(state.value)} <br/>
    </p>
}

function ColSelect(props: {col: State<string>}) {

    const col = useHookstate(props.col);

    return(
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

    return(
    <select className='mr-10' onChange={(e) => {values.set([]); type.set(e.target.value); }}>
            <option value={'equal'}>equal</option>
            <option value={'in'}>in</option>
            <option value={'less'}>less</option>
            <option value={'more'}>more</option>
            <option value={'between'}>between</option>
    </select>
    )
}

function ChooseValues(props: {values: State<string[]>, type: State<string>}) {
    const type = useHookstate(props.type);
    const values = useHookstate(props.values);
    var valuesvalue = values.value;

    return(
        <>
        {(type.value !== 'between' && type.value !== 'in') && (
            <input className='border-solid border-black border-2 mx-2' 
            onChange={(e) => values.set([e.target.value])} value={values[0]?.value ?? ''}></input>
        )}
        {(type.value === 'between') && (
            <>
            <input className='border-solid border-black border-2 mx-2' onChange={(e) => {if (values.length < 2) {
                values.set([e.target.value])} else {
                    values.set(a => [e.target.value, a[1] ?? ''])
            }}} value={values[0]?.value ?? ''}></input>
            <input className='border-solid border-black border-2 mx-2' onChange={(e) => {if (values.length === 0){
                values.set(['', e.target.value])} else{
                    values.set(a => [a[0] ?? '', e.target.value])
                }
            }} value={values[1]?.value ?? ''}></input>
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