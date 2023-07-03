import React, { useState, useEffect } from 'react';
import { useHookstate, type State } from '@hookstate/core';
import { type NextPage } from 'next';

import { BiX } from "react-icons/bi"
import Head from 'next/head';
import AutoComplete from '~/components/search/expert/autofill_expert';

import Table from '~/components/search/table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { type IGroup, GroupSchema } from '~/common/filter/filter';
import { api } from '~/utils/api';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { SampleSchema } from '~/common/database/samples';
import HeaderNEW from '~/components/overall/header';
import ModalSaveExpert from '~/components/search/expert/modalSave';
import ModalLoadExpert from '~/components/search/expert/modalLoad';
import { Colors } from '~/common/styles';
import Footer from '~/components/overall/footer';
import useWindowSize from '~/utils/window';

const defaultGroup: IGroup = {
  not: false,
  link: 'AND',
  activated: true,
  mandatory: true,
  filter: [{
    col: 'CBH_Sample_ID',
    type: 'equal',
    values: [''],
    activated: true,
    mandatory: true,
  }],
  groups: []
}

const ExpertSearch: NextPage = () => {
  const [page, setPage] = useState<number>(1)
  const [pagelength, setPagelength] = useState<number>(50)
  const [search,] = useState<string | undefined>()
  const [newFilter, setNewFilter] = useState<IGroup>({
    not: false,
    link: 'AND',
    activated: true,
    mandatory: true,
    filter: [{
      col: 'CBH_Sample_ID',
      type: 'equal',
      values: [''],
      activated: true,
      mandatory: true,
    }],
    groups: []
  })
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);

  const state = useHookstate<IGroup>(defaultGroup);

  /*Search Bar function */
  const router = useRouter()
  const pathname = usePathname();
  const { f } = router.query

  const windowSize = useWindowSize()

  //Test
  const { data: samples, refetch: refetchSamples } = api.samples.applyFilter.useQuery({ group: newFilter, pages: page, pagelength: pagelength })
  const { data: count } = api.samples.countExpert.useQuery({ group: newFilter })

  useEffect(() => {
    void refetchSamples()
  }, [search, page, pagelength, refetchSamples])

  useEffect(() => {
    if(f !== undefined){
      state.set(GroupSchema.parse(JSON.parse(f.toString())))
      applyFilter()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f])

  function applyFilter () {
    console.log(JSON.stringify(state.value))
    void router.push(`${pathname}?f=${encodeURIComponent(JSON.stringify(state.value))}`, undefined, {shallow: true})
    const result = GroupSchema.safeParse(JSON.parse(JSON.stringify(state.value)))
    if(result.success){
      setNewFilter(result.data)
    }
  }

  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-full max-h-full min-w-full max-w-full overflow-hidden bg-gray-100 fixed flex flex-col">
        <HeaderNEW />
        <div className='max-h-[calc(100vh-80px)] overflow-y-scroll font-poppins overflow-x-hidden'>
          <div className={`flex flex-row w-full items-center justify-center text-[${Colors.dark}] border-[${Colors.dark}]`}>
            {(windowSize.width && windowSize.width < 900) ? ( 
              <>
                <h1 className="text-5xl mt-5 ml-5 mb-2 text-center"><b>EXPERT PRODUCT SEARCH</b></h1>
              </> 
            ) : (
              <>
                <div className="w-full border-2 border-solid h-1 border-inherit rounded-3xl m-5"></div>
                <h1 className="text-5xl mt-5 ml-5 mb-2 whitespace-nowrap"><b>EXPERT PRODUCT SEARCH</b></h1>
                <div className="w-full border-2 border-solid h-1 border-inherit rounded-3xl m-5"></div>
              </>
            )}
          </div>
          <div className={`${windowSize.width && windowSize.width < 900 ? "px-5" : "px-20"}`}>
            {(windowSize.width && windowSize.width < 900) ? ( 
              <p className={`my-7 text-xl text-center text-[${Colors.dark}]`}>
                <i>
                  Expert search is a tailor-made solution to improve your search by understanding the precise needs and search 
                  behavior of life science scientists and biomedical researchers worldwide.
                </i>
              </p>
            ) : (
              <p className={`my-7 text-xl text-center text-[${Colors.dark}]`}>
                <i>
                  Expert search is a tailor-made solution to improve your search by understanding the precise needs and search 
                  behavior of life science scientists and biomedical researchers worldwide. Therefore, we provide you with a wide array of search options, helping to dive deeper into our bio inventory 
                  to land on your matching human biospecimens within no time. Our inventory is vast, we offer well-annotated, high-quality biological specimens such as human serum, plasma, whole blood, 
                  human tissue samples, and more for research purposes.
                </i>
              </p>
            )}
            <section className='max-w-[95dvw] w-full overflow-x-auto'>
              <InitialContentEditor self={state}/>
            </section>
            <div className={`flex ${windowSize.width && windowSize.width < 800 ? "flex-col" : "flex-row"} w-full mt-3`}>
              <div className={`flex flex-row ${windowSize.width && windowSize.width < 800 ? "min-w-full mb-2" : "w-[50%]"}`}>
                <button className={`${windowSize.width && windowSize.width < 800 ? "w-full" : "w-[10rem]"} px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-l-2xl border-solid border-2 bg-[#D8E9D1] hover:bg-[#bfdab4] transition-colors ease-in-out border-[${Colors.dark}] border-r-0`} onClick={() => applyFilter()}>Apply Filter</button>
                <button className={`${windowSize.width && windowSize.width < 800 ? "w-full" : "w-[10rem]"} px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-r-2xl border-solid border-2 bg-[#F7D59B] hover:bg-[#d8b475] transition-colors ease-in-out border-[${Colors.dark}]`} onClick={() => state.set({ not: false, link: 'AND', activated: true, mandatory: true, filter: [{ col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true, mandatory: true }], groups: [] },)}>Reset</button>
              </div>
              <div className={`flex flex-row ${windowSize.width && windowSize.width < 800 ? "min-w-full mb-2" : "w-[50%] justify-end"}`}>
                <button className={`${windowSize.width && windowSize.width < 800 ? "w-full" : "w-[10rem]"} px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-l-2xl border-solid border-2 bg-[#D8E9D1] hover:bg-[#bfdab4] transition-colors ease-in-out border-[${Colors.dark}] border-r-0`} onClick={() => setShowLoad(true)}>Load Filter</button>
                <button className={`${windowSize.width && windowSize.width < 800 ? "w-full" : "w-[10rem]"} px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-r-2xl border-solid border-2 bg-[#F7D59B] hover:bg-[#d8b475] transition-colors ease-in-out border-[${Colors.dark}]`} onClick={() => setShowSave(true)}>Save Filter</button>
              </div>
            </div>
            <ModalSaveExpert showModal={showSave} setShowModal={setShowSave} filter={unfreeze(state)}/>
            <ModalLoadExpert showModal={showLoad} setShowModal={setShowLoad} filter={state} />
          </div>
          <div className="mx-4 my-2">
            <Table page={page} pagelength={pagelength} count={count} optionalSamples={samples} setPage={setPage} setPagelength={setPagelength} expert={true}/>
          </div>
          <Footer/>
        </div>
      </div>
    </>
  )
}

export default ExpertSearch;

function unfreeze(group: State<IGroup>){
  return GroupSchema.parse(JSON.parse(JSON.stringify(group.value)))
}

function InitialContentEditor(props: { self: State<IGroup> }) {
  const self = useHookstate(props.self)

  function SetActivated(groupState: State<IGroup>, activated: boolean): void{
    groupState.activated.set(activated)
    groupState.groups.map((group: State<IGroup>) => {SetActivated(group, activated)})    
  }

  function SetOptional(groupState: State<IGroup>, optional: boolean): void{
    groupState.groups.map((group: State<IGroup>) => {SetOptional(group, optional)})    
    groupState.mandatory.set(optional)
    groupState.filter.forEach(filter => {filter.mandatory.set(optional)})
  }

  return <>
    <div className="w-fit min-w-full py-1 text-lg rounded-3xl mt-3 from-[#164A41] to-[#4D774E] bg-gradient-to-r">
      <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
        <div className='flex flex-row justify-start items-center w-[50%]'>
          <button className={`ml-5 w-[6rem] px-4 py-1 text-lg text-center rounded-l-2xl border-solid border-2 border-[#F1B24A] ${self.not.value === true ? "bg-[#F1B24A] text-white" : "bg-transparent text-white"} `} onClick={() => self.not.set(!self.not.value)}>NOT</button>
          <button className={`w-[6rem] px-4 py-1 text-lg text-center border-solid border-y-2 border-[#F1B24A] ${self.link.value === "AND" ? "bg-[#F1B24A] text-white" : "bg-transparent text-white"}`} onClick={() => self.link.set('AND')}>AND</button>
          <button className={`w-[6rem] px-4 py-1 text-lg text-center rounded-r-2xl border-solid border-2 border-[#F1B24A] ${self.link.value === "OR" ? "bg-[#F1B24A] text-white" : "bg-transparent text-white"}`} onClick={() => self.link.set('OR')}>OR</button>

          <OverlayTrigger trigger="hover" placement="bottom" rootClose={true} overlay={
            <Popover id="popover-basic" className='z-30'>
              <Popover.Body className="bg-white rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md text-center">
                <div>
                  The buttons for AND or OR indicate how the different filters should be connected within the group. <br />
                  Underneath you select the column which should be filtered and in which form and then you enter the value.
                </div>
              </Popover.Body>
            </Popover>
          }>
            <button className="ml-5 bg-[#9DC88D] rounded-full border-2 border-solid border-green-900 py-1 px-1 text-white text-lg w-[2.5rem] shadow-md">?</button>
          </OverlayTrigger>
        </div>
        <div className='flex flex-row justify-end items-center w-[50%] pr-3'>
          <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-l-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D] whitespace-nowrap' onClick={() => self.groups.set(groups => (groups || []).concat({ not: false, link: 'AND', activated: true, mandatory: true, filter: [{ col: 'CBH_Donor_ID', type: 'equal', values: [] , activated: true, mandatory: self.mandatory.value === true ? true : false}], groups: [] }))}>New Group</button>
          <button className='w-[10rem] px-4 py-1 text-lg text-center text-white border-solid border-2 bg-[#9DC88D] border-y-[#9DC88D] whitespace-nowrap' onClick={() => self.filter.set(filters => (filters || []).concat([{ col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true, mandatory: self.mandatory.value === true ? true : false}]))}>New Rule</button>
          <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-r-2xl border-solid border-2 bg-orange-400 border-orange-400 whitespace-nowrap' onClick={() => {SetActivated(self, !self.activated.value)}}>{self.activated.value ? "deactivate": "activate"}</button>
          <button className="relative w-fit bg-[#F1B24A] hover:bg-[#e8b25b] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition whitespace-nowrap" onClick={() => {SetOptional(self, !self.mandatory.value)}}>{self.mandatory.value ? "!": "?"}</button>
        </div>
      </div>

      {self.filter.map((filterState: State<{ col: string, type: string, values: string[], activated: boolean, mandatory: boolean }>, i) =>
        <div key={i}>  
          <div className='flex flex-row ml-5 my-1'>
            <ColSelect col={filterState.col} activated={self.activated} filterActivated={filterState.activated} values={filterState.values}/>
            <TypeSelect col={filterState.col} type={filterState.type} values={filterState.values} activated={self.activated} filterActivated={filterState.activated}/>
            <ChooseValues type={filterState.type} values={filterState.values} col={filterState.col} activated={self.activated} filterActivated={filterState.activated}/>
            <button className="relative w-[10rem] z-10 right-4 bg-orange-400 hover:bg-orange-300 text-white pr-3 pl-6 py-1 text-lg text-center rounded-r-2xl outline-none transition whitespace-nowrap" onClick={() => filterState.activated.set(!filterState.activated.value)} >{(!self.activated.value || !filterState.activated.value) ? "Activate" : "Deactivate"}</button>
            <button className="relative right-8 w-fit bg-red-500 hover:bg-red-400 text-white pr-3 pl-6 py-1 text-lg text-center rounded-r-2xl outline-none transition whitespace-nowrap" onClick={() => self.filter.set((filter) => filter.filter((_, index) => index !== i))} >delete</button>
            <button className="relative right-8 w-fit bg-[#F1B24A] hover:bg-[#e8b25b] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition whitespace-nowrap" onClick={() => filterState.mandatory.set(!filterState.mandatory.value)} >{(!self.mandatory.value || !filterState.mandatory.value) ? "?" : "!"}</button>
          </div>
          <div className="mx-10">
            {(filterState.type.value === 'in') && (  
              <>       
                {filterState.values.value.map((value: string, i) => (
                  <div key={i} className='bg-red-400 w-fit px-2 inline-block m-1'>
                    {value}
                    <button onClick={() => filterState.values.set((value) => value.filter((_, index) => index !== i))}><BiX /></button>
                  </div>
                ))}
              </>
            )}
          </div> 
        </div>
      )}

      <GroupListEditor groups={self} />
    </div>
  </>
}

function GroupContentEditor(props: { self: State<IGroup>, parent: State<IGroup>, index: number }) {
  const self = useHookstate(props.self)
  const parent = useHookstate(props.parent)

  const i = props.index;

  function SetActivated(groupState: State<IGroup>, activated: boolean): void{
    groupState.activated.set(activated)
    groupState.groups.map((group: State<IGroup>) => {SetActivated(group, activated)})    
  }

  function SetOptional(groupState: State<IGroup>, optional: boolean): void{
    groupState.groups.map((group: State<IGroup>) => {SetOptional(group, optional)})    
    groupState.mandatory.set(optional)
    groupState.filter.forEach(filter => {filter.mandatory.set(optional)})
  }

  return <>
    <div className="w-full py-1 text-lg rounded-3xl mt-1 bg-[rgb(131,182,94)] to-[#4D774E] bg-gradient-to-r">
      <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
        <div className='flex flex-row justify-start items-center w-[50%]'>
          <button className={`ml-5 w-[6rem] px-4 py-1 text-lg text-center rounded-l-2xl border-solid border-2 border-[#F1B24A] whitespace-nowrap ${self.not.value === true ? "bg-[#F1B24A] text-white" : "bg-transparent text-white"} `} onClick={() => self.not.set(!self.not.value)}>NOT</button>
          <button className={`w-[6rem] px-4 py-1 text-lg text-center border-solid border-y-2 border-[#F1B24A] whitespace-nowrap ${self.link.value === "AND" ? "bg-[#F1B24A] text-white" : "bg-transparent text-white"}`} onClick={() => self.link.set('AND')}>AND</button>
          <button className={`w-[6rem] px-4 py-1 text-lg text-center rounded-r-2xl border-solid border-2 border-[#F1B24A] whitespace-nowrap ${self.link.value === "OR" ? "bg-[#F1B24A] text-white" : "bg-transparent text-white"}`} onClick={() => self.link.set('OR')}>OR</button>
        </div>
        <div className='flex flex-row justify-end items-center w-[50%] pr-3'>
          <button className='w-[10rem] px-4 py-1 text-lg text-center text-white rounded-l-2xl border-solid border-2 bg-[#9DC88D] border-[#9DC88D] whitespace-nowrap' onClick={() => self.groups.set(groups => (groups || []).concat({ not: false, link: 'AND', activated: true, mandatory: self.mandatory.value === true ? true : false, filter: [{ col: 'CBH_Donor_ID', type: 'equal', values: [] , activated: true, mandatory: self.mandatory.value === true ? true : false}], groups: [] }))}>New Group</button>
          <button className='w-[10rem] px-4 py-1 text-lg text-center text-white border-solid border-2 bg-[#9DC88D] border-y-[#9DC88D] whitespace-nowrap' onClick={() => self.filter.set(filters => (filters || []).concat([{ col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true, mandatory: self.mandatory.value === true ? true : false}]))}>New Rule</button>
          <button className='w-[10rem] px-4 py-1 text-lg text-center text-white border-solid border-2 bg-orange-400 border-y-orange-400 border-l-orange-400 whitespace-nowrap' disabled={!parent.activated.value} onClick={() => {SetActivated(self, !self.activated.value)}}>{self.activated.value ? "Deactivate": "Activate"}</button>
          <button className="w-[6rem] border-2 bg-red-500 hover:bg-red-400 border-red-500 hover:border-red-400 text-white py-1 text-lg text-center rounded-r-2xl outline-none transition whitespace-nowrap" onClick={() => parent.groups.set((group) => group.filter((_, index) => index !== i))} >Delete</button>
          <button className="relative w-fit bg-[#F1B24A] hover:bg-[#e8b25b] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition whitespace-nowrap" disabled={!parent.mandatory.value} onClick={() => {SetOptional(self, !self.mandatory.value)}}>{self.mandatory.value ? "!": "?"}</button>
        </div>
      </div>

      {self.filter.map((filterState: State<{ col: string, type: string, values: string[], activated: boolean, mandatory: boolean }>, i) =>
        <div key={i}>  
          <div className='flex flex-row ml-5 my-1'>
            <ColSelect col={filterState.col} activated={self.activated} filterActivated={filterState.activated} values={filterState.values}/>
            <TypeSelect col={filterState.col} type={filterState.type} values={filterState.values} activated={self.activated} filterActivated={filterState.activated}/>
            <ChooseValues type={filterState.type} values={filterState.values} col={filterState.col} activated={self.activated} filterActivated={filterState.activated}/>
            <button className="relative w-[10rem] z-10 right-4 bg-orange-400 hover:bg-orange-300 text-white pr-3 pl-6 py-1 text-lg text-center rounded-r-2xl outline-none transition whitespace-nowrap" disabled={!self.activated.value} onClick={() => filterState.activated.set(!filterState.activated.value)} >{(!self.activated.value || !filterState.activated.value) ? "Activate" : "Deactivate"}</button>
            <button className="relative right-8 w-fit bg-red-500 hover:bg-red-400 text-white pr-3 pl-6 py-1 text-lg text-center rounded-r-2xl outline-none transition whitespace-nowrap" onClick={() => self.filter.set((filter) => filter.filter((_, index) => index !== i))}>Delete</button>
            <button className="relative w-fit bg-[#F1B24A] hover:bg-[#e8b25b] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition whitespace-nowrap" disabled={!self.mandatory.value} onClick={() => filterState.mandatory.set(!filterState.mandatory.value)} >{(!self.mandatory.value || !filterState.mandatory.value) ? "?" : "!"}</button>
          </div>
          <div className="mx-10">
            {(filterState.type.value === 'in') && (  
              <>       
                  {filterState.values.value.map((value: string, i) => (
                    <div key={i} className='bg-red-400 w-fit px-2 inline-block m-1'>
                      {value}
                      <button onClick={() => filterState.values.set((value) => value.filter((_, index) => index !== i))}><BiX /></button>
                    </div>
                  ))}
              </>
            )}
          </div> 
        </div>
      )}
    </div>
  </>
}

function GroupListEditor(props: { groups: State<IGroup> }) {
  const state = useHookstate(props.groups);

  return (
    <>
      {(state.groups.length > 0) && (
        <div className='border-4 mx-2 mb-1 rounded-3xl'>
          {state.groups.map((groupState: State<IGroup>, i) =>
            <div key={i}>
              <GroupContentEditor self={groupState} parent={state} index={i}/>
              <GroupListEditor groups={groupState}/>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function ColSelect(props: { col: State<string>, activated: State<boolean>, filterActivated: State<boolean>, values: State<string[]>}) {
  const col = useHookstate(props.col);
  const activated = useHookstate(props.activated);
  const filterActivated = useHookstate(props.filterActivated);
  const values = useHookstate(props.values);

  useEffect(() => {
    values.set([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col.value]);

  return (
    <select name="col" id="col" className="w-fit z-20 px-3 py-1 text-lg rounded-l-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" value={col.value} onChange={(e) => {col.set(e.target.value); values.set([])}} disabled = {!(activated.value && filterActivated.value)}>
      {Object.getOwnPropertyNames(SampleSchema.shape).map((property, i) => {
        if (property !== "id") {
          return (
            <option key={1000 + i} value={property}>{property.replaceAll("_"," ")}</option>
          )
        }
      })}  
    </select>
  )
}

function TypeSelect(props: { type: State<string>, col: State<string>, values: State<string[]>, activated: State<boolean>, filterActivated: State<boolean>}) {
  const type = useHookstate(props.type);
  const values = useHookstate(props.values);
  const activated = useHookstate(props.activated);
  const filterActivated = useHookstate(props.filterActivated);
  const numberCol = ["Age", "BMI", "Cut_Off_Numerical", "Freeze_Thaw_Cycles", "Pregnancy_Week", "Price", "Quantity", "Result_Numerical"]

  return (
    <select className="w-fit z-20 px-3 py-1 text-lg text-center border-y-2 border-gray-500 focus:border-gray-700 outline-none transition" value={type.value} onChange={(e) => { values.set([]); type.set(e.target.value)}} disabled = {!(activated.value && filterActivated.value)}>
      <option className='text-left' value={'equal'}>=</option>
      <option className='text-left' value={'in'}>in</option>
      {numberCol.find(item => item === props.col.value) && (
        <>
          <option className='text-left' value={'less'}>&lt;</option>
          <option className='text-left' value={'lessequal'}>&lt;=</option>
          <option className='text-left' value={'more'}>&gt;</option>
          <option className='text-left' value={'moreequal'}>&gt;=</option>
          <option className='text-left' value={'between'}>&lt;x&lt;</option>
        </>
      )}
    </select>
  )
}

function ChooseValues(props: { values: State<string[]>, type: State<string>, col: State<string>, activated: State<boolean>, filterActivated: State<boolean>}) {
  const type = useHookstate(props.type);
  const values = useHookstate(props.values);
  const col = useHookstate(props.col);

  function SetValues(value: string): void {
    values.set([value])
  }

  function SetValuesBetween1(value: string): void {
    values.set(a => [value, a[1] ?? ''])
  }

  function SetValuesBetween2(value: string): void {
    values.set(a => [a[0] ?? '', value])
  }

  function In(value: string): void {
    if (!values.value.find(v => v === value)) {
      values.set(v => (v || []).concat([value]));
    }
  }

  return (
    <>
      <div className='w-full'>
        {(type.value !== 'between' && type.value !== 'in') && (
          <>
            <AutoComplete col={col.value} onSelect={SetValues} value={values[0]?.value ?? ""} />
          </>
        )}
        {(type.value === 'between') && (
          <div className='flex flex-row'>
            <div className='w-full'>
              <AutoComplete col={col.value} onSelect={SetValuesBetween1} value={values[0]?.value ?? ""} />
            </div>
            <div className='w-full'>
              <AutoComplete col={col.value} onSelect={SetValuesBetween2} value={values[1]?.value ?? ""} />
            </div>
          </div>
        )}
        {(type.value === 'in') && (
          <>
            <AutoComplete col={col.value} onSelect={In} value={values[values.length-1]?.value ?? ""} />
          </>
        )}
      </div>
    </>
  )
}