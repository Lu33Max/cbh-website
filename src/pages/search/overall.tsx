import { type NextPage } from "next";
import Head from "next/head";
import { NormalFilterSchema } from '~/common/filter/filter';
import { api } from "~/utils/api";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { BiHome, BiX } from "react-icons/bi";

import HeaderNEW from "~/components/overall/header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Table from "~/components/search/table";
import ModalLoad from "~/components/search/normal/modalLoad";
import ModalSave from "~/components/search/normal/modalSave";

import { type INormalFilter } from "~/common/filter/filter";
import Footer from "~/components/overall/footer";
import { usePathname } from "next/navigation";
import { Colors } from "~/common/styles";
import Link from "next/link";
import AutoComplete from "~/components/search/normal/autofill";
import useWindowSize from "~/utils/window";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-full max-h-full min-w-full max-w-full overflow-hidden bg-gray-100 fixed">
        <div className="flex flex-col">
          <HeaderNEW />
          <Content />
        </div>
      </div>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  const defaultFilter: INormalFilter = {
    CBH_Master_ID: {
      value: undefined,
      mandatory: true
    },
    CBH_Donor_ID: {
      value: undefined,
      mandatory: true
    },
    CBH_Sample_ID: {
      value: undefined,
      mandatory: true
    },
    Price: { 
      min: undefined, 
      max: undefined,
      mandatory: true
    },
    Matrix: {
      value: [],
      mandatory: true
    },
    Quantity: {
      min: undefined,
      max: undefined,
      mandatory: true
    },
    Unit: {
      value: [],
      mandatory: true
    },
    Lab_Parameter: {
      value: [],
      mandatory: true
    }, 
    Result_Interpretation: {
      value: [],
      mandatory: true
    }, 
    Result_Unit: {
      value: [],
      mandatory: true
    }, 
    Result_Numerical: {
      min: undefined,
      max: undefined,
      mandatory: true
    }, 
    Diagnosis: {
      value: [],
      mandatory: true
    }, 
    ICD_Code: {
      value: [],
      mandatory: true
    } 
  }

  /*Search Bar function */
  const router = useRouter()
  const pathname = usePathname();
  const { q, f, c } = router.query
  
  const [page, setPage] = useState<number>(1)
  const [pagelength, setPagelength] = useState<number>(50)
  const [search, setSearch] = useState<string | undefined>()
  const [filter, setFilter] = useState<INormalFilter>(defaultFilter)
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [categoryQuery, setCategoryQuery] = useState<string>("Overall");

  const windowSize = useWindowSize()

  const { data: samples } = api.samples.getAll.useQuery(
    { pages: page, lines: pagelength, search: search, filter: filter }
  )
  const { data: count } = api.samples.countNormal.useQuery({ search: search, filter: filter })

  useEffect(() => {
    setPage(1)
  }, [search, pagelength, filter])

  useEffect(() => {
    setSearch(q ? q.toString() : undefined)
  }, [q])

  useEffect(() => {
    setCategoryQuery(c ? c.toString() : "Overall")
  }, [c])

  useEffect(() => {
    if(f !== undefined){
      setFilter(NormalFilterSchema.parse(JSON.parse(f.toString())))
    }
  }, [f])

  useEffect(() => {
    if(!(JSON.stringify(filter) === JSON.stringify(defaultFilter))){
      void router.push(`${pathname}?${search ? `q=${encodeURIComponent(search)}&` : ""}f=${encodeURIComponent(JSON.stringify(filter))}&c=${encodeURIComponent(categoryQuery)}`, undefined, {shallow: true})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, categoryQuery])

  function handleFilterChange(value: string, column: string): void {
    type FilterKey = keyof INormalFilter

    if(column in filter){
      const temp = filter[column as FilterKey]
      if('value' in temp && Array.isArray(temp.value)){
        temp.value.push(value)
        setFilter(filter => ({...filter, [column]: temp}))
      }
    }
  }

  return (
    <div className='max-h-[calc(100dvh-80px)] overflow-y-scroll font-poppins overflow-x-hidden'>
      <div className={`flex flex-row w-full items-center justify-center text-[${Colors.dark}] border-[${Colors.dark}]`}>
        {(windowSize.width && windowSize.width < 900) ? ( 
          <>
            <h1 className="text-5xl mt-5 ml-5 mb-2 text-center"><b>OVERALL PRODUCT SEARCH</b></h1>
          </> 
        ) : (
          <>
            <div className="w-full border-2 border-solid h-1 border-inherit rounded-3xl m-5"></div>
            <h1 className="text-5xl mt-5 ml-5 mb-2 whitespace-nowrap"><b>OVERALL PRODUCT SEARCH</b></h1>
            <div className="w-full border-2 border-solid h-1 border-inherit rounded-3xl m-5"></div>
          </>
        )}
      </div>
      
      <div className={`${windowSize.width && windowSize.width < 900 ? "px-5" : "px-20"}`}>
        {(windowSize.width && windowSize.width < 900) ? ( 
          <p className={`my-7 text-xl text-center text-[${Colors.dark}]`}>
          <i>
            Overall search is a tailor-made solution to improve your search by understanding the precise needs and search 
            behavior of life science scientists and biomedical researchers worldwide.
          </i>
        </p>
        ) : (
          <p className={`my-7 text-xl text-center text-[${Colors.dark}]`}>
            <i>
              Overall search is a tailor-made solution to improve your search by understanding the precise needs and search 
              behavior of life science scientists and biomedical researchers worldwide. Therefore, we provide you with a wide array of search options, helping to dive deeper into our bio inventory 
              to land on your matching human biospecimens within no time. Our inventory is vast, we offer well-annotated, high-quality biological specimens such as human serum, plasma, whole blood, 
              human tissue samples, and more for research purposes.
            </i>
          </p>
        )}

        <div className="flex flex-row text-3xl mt-2 mb-4 items-center font-extralight">
          <Link className="relative top-1" href={"/"}><BiHome/></Link>
          <label className="mx-1">|</label>
          <Link className="text-xl relative top-1" href={"/search/overall"}>Overall Search</Link>
          <label className="mx-1">|</label>
          <Link className="text-xl relative top-1" href={`/search/overall?c=${encodeURI(categoryQuery)}`}>{categoryQuery}</Link>
        </div>

        {windowSize.width && windowSize.width < 700 ? (
          <div className="flex flex-col">
            <div className="flex flex-row justify-center items-stretch">
              <button className={`w-full px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-l-2xl border-solid border-2 bg-[#D8E9D1] hover:bg-[#bfdab4] transition-colors ease-in-out border-[${Colors.dark}] border-r-0`} onClick={() => setShowLoad(true)}>Load Filter</button>
              <button className={`w-full px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-r-2xl border-solid border-2 bg-[#F7D59B] hover:bg-[#d8b475] transition-colors ease-in-out border-[${Colors.dark}]`} onClick={() => setShowSave(true)}>Save Filter</button>
            </div>
            <div className="flex flex-row mt-2 items-center">
              <button className={`text-xl text-[${Colors.dark}] flex flex-row pl-2 pr-4 rounded-lg`} onClick={() => setShowFilter(!showFilter)}>
                Filter
                <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform translate-y-[4px] rotate-90 ml-2`}>
                    <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
                    <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
                </svg>
              </button>

              <select className={`text-xl mx-3 text-[${Colors.dark}] h-10 flex flex-row pl-2 pr-8 rounded-lg bg-transparent appearance-none bg-[length:1.3rem_auto] bg-[url('/ArrowDown.png')] bg-no-repeat bg-[170px] w-[200px]`} value={categoryQuery} onChange={(e) => setCategoryQuery(e.target.value)}>
                <option value="Overall">Overall</option>
                <option value="Pregnancy">Pregnancy</option>
                <option value="Infectious Diseases">Infectious Diseases</option>
                <option value="Sexually Transmitted Diseases">Sexually Transmitted Diseases</option>
                <option value="Cancer Samples">Cancer Samples</option>
                <option value="Allergies">Allergies</option>
                <option value="Autoimmune Diseases">Autoimmune Diseases</option>
                <option value="Cardiovascular Diseases">Cardiovascular Diseases</option>
                <option value="Musculoskeletal System and Connective Tissue">Musculoskeletal System and Connective Tissue</option>
                <option value="Endocrine Disorders">Endocrine Disorders</option>
                <option value="COVID 19">COVID 19</option>
                <option value="Gynaecology">Gynaecology</option>
                <option value="Healthy Donors">Healthy Donors</option>
                <option value="Metabolic Disorders">Metabolic Disorders</option>
                <option value="Parasitology">Parasitology</option>
                <option value="Neurological Disorders">Neurological Disorders</option>
                <option value="Respiratory Tract Infections">Respiratory Tract Infections</option>
                <option value="Tropical Infections">Tropical Infections</option>
                <option value="Other Vector Borne Diseases">Other Vector Borne Diseases</option>
                <option value="Specimen Matrix">Specimen Matrix</option>
                <option value="Tissue Bank">Tissue Bank</option>
                <option value="Cell Products">Cell Products</option>
                <option value="Other Biofluids">Other Biofluids</option>
                <option value="Dermatological Diseases">Dermatological Diseases</option>
              </select>
            </div>
            
          </div>
        ) : (
          <div className="flex flex-row w-full">
            <div className="flex flex-row w-[50%] justify-start items-center">
              <button className={`text-xl text-[${Colors.dark}] flex flex-row pl-2 pr-4 rounded-lg`} onClick={() => setShowFilter(!showFilter)}>
                Filter
                <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform translate-y-[4px] rotate-90 ml-2`}>
                    <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
                    <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
                </svg>
              </button>

              <select className={`text-xl mx-3 text-[${Colors.dark}] h-10 flex flex-row pl-2 pr-8 rounded-lg bg-transparent appearance-none bg-[length:1.3rem_auto] bg-[url('/ArrowDown.png')] bg-no-repeat bg-[170px] w-[200px]`} value={categoryQuery} onChange={(e) => setCategoryQuery(e.target.value)}>
                <option value="Overall">Overall</option>
                <option value="Pregnancy">Pregnancy</option>
                <option value="Infectious Diseases">Infectious Diseases</option>
                <option value="Sexually Transmitted Diseases">Sexually Transmitted Diseases</option>
                <option value="Cancer Samples">Cancer Samples</option>
                <option value="Allergies">Allergies</option>
                <option value="Autoimmune Diseases">Autoimmune Diseases</option>
                <option value="Cardiovascular Diseases">Cardiovascular Diseases</option>
                <option value="Musculoskeletal System and Connective Tissue">Musculoskeletal System and Connective Tissue</option>
                <option value="Endocrine Disorders">Endocrine Disorders</option>
                <option value="COVID 19">COVID 19</option>
                <option value="Gynaecology">Gynaecology</option>
                <option value="Healthy Donors">Healthy Donors</option>
                <option value="Metabolic Disorders">Metabolic Disorders</option>
                <option value="Parasitology">Parasitology</option>
                <option value="Neurological Disorders">Neurological Disorders</option>
                <option value="Respiratory Tract Infections">Respiratory Tract Infections</option>
                <option value="Tropical Infections">Tropical Infections</option>
                <option value="Other Vector Borne Diseases">Other Vector Borne Diseases</option>
                <option value="Specimen Matrix">Specimen Matrix</option>
                <option value="Tissue Bank">Tissue Bank</option>
                <option value="Cell Products">Cell Products</option>
                <option value="Other Biofluids">Other Biofluids</option>
                <option value="Dermatological Diseases">Dermatological Diseases</option>
              </select>
            </div>

            <div className='flex flex-row justify-end w-[50%]'>
              <button className={`w-[10rem] px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-l-2xl border-solid border-2 bg-[#D8E9D1] hover:bg-[#bfdab4] transition-colors ease-in-out border-[${Colors.dark}] border-r-0`} onClick={() => setShowLoad(true)}>Load Filter</button>
              <button className={`w-[10rem] px-4 py-1 text-xl text-center text-[${Colors.dark}] rounded-r-2xl border-solid border-2 bg-[#F7D59B] hover:bg-[#d8b475] transition-colors ease-in-out border-[${Colors.dark}]`} onClick={() => setShowSave(true)}>Save Filter</button>
            </div>
          </div>
        )}

        <ModalSave showModal={showSave} setShowModal={setShowSave} filter={filter}/>
        <ModalLoad showModal={showLoad} setShowModal={setShowLoad} setFilter={setFilter} />
        
        <div className={`grid ${showFilter ? "grid-rows-[2fr] mt-4" : "grid-rows-[0fr]"} transition-all ease-in-out`}>
          {/* Input fields */}   
          <div className={`px-5 items-center justify-center overflow-hidden ${showFilter ? "mb-2" : ""}`}>
            <div className={`grid ${windowSize.width && windowSize.width < 900 ? "grid-cols-2" : "grid-cols-4"} gap-2 max-w-full`}>
              {/* CBH Master ID */}
              <div className="items-center text-center">
                <input type="text" value={filter.CBH_Master_ID.value} className="bg-gray-50 w-full rounded-lg px-2 py-1 items-center justify-center shadow-md text-center text-lg" placeholder="CBHMasterID" onChange={e => {
                  const temp = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined
                  setFilter(filter => ({...filter, CBH_Master_ID: {value: temp, mandatory: filter.CBH_Master_ID.mandatory}}))
                }}/>
              </div>
              {/* CBH Donor ID */}
              <div className="items-center text-center">
                <input type="text" value={filter.CBH_Donor_ID.value} className="bg-gray-50 w-full rounded-lg px-2 py-1 items-center justify-center shadow-md text-center text-lg" placeholder="CBHDonorID" onChange={e => {
                  const temp = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined
                  setFilter(filter => ({...filter, CBH_Donor_ID: {value: temp, mandatory: filter.CBH_Donor_ID.mandatory}}))
                }}/>
              </div>
              {/* CBH Sample ID */}
              <div className="items-center text-center">
                <input type="text" value={filter.CBH_Sample_ID.value} className="bg-gray-50 w-full rounded-lg px-2 py-1 items-center justify-center shadow-md text-center text-lg" placeholder="CBHSampleID" onChange={e => {
                  const temp = e.currentTarget.value.length > 0 ? e.currentTarget.value : undefined
                  setFilter(filter => ({...filter, CBH_Sample_ID: {value: temp, mandatory: filter.CBH_Sample_ID.mandatory}}))
                }}/>
              </div>
              {/* Price */}
              <div className="items-center text-center">
                <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                  <Popover id="popover-basic" className="z-20 bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md text-center">
                    <Popover.Body>
                      <div className="grid grid-flow-col auto-cols-max justify-center items-center text-lg gap-3">
                        <div className="col-span-1">
                          Min:
                        </div>
                        <input type="number" value={filter.Price.min} className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Min price" onChange={e => {
                          const temp = filter.Price
                          temp.min = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, Price: temp}))
                        }}/>
                        <div className="col-span-1">
                          Max:
                        </div>
                        <input type="number" value={filter.Price.max} className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Max price" onChange={e => {
                          const temp = filter.Price
                          temp.max = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, Price: temp}))
                        }}/>
                      </div>
                    </Popover.Body>
                  </Popover>
                }>
                  <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md rounded-lg">Price</button>
                </OverlayTrigger>
              </div>
              {/* General Data */}
              <div className="items-center text-center">
                <OverlayTrigger trigger="click" placement="bottom" rootClose={true} overlay={
                  <Popover id="popover-basic" className="z-20 bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                    <Popover.Body>
                      <div className="grid grid-flow-col auto-cols-max justify-center items-center text-lg gap-3">
                        <div className="col-span-1">
                          Matrix:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="Matrix" onSelect={handleFilterChange} value={filter.Matrix.value[filter.Matrix.value.length-1] ?? ""}/>
                        </div>
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
                  <Popover id="popover-basic" className="z-20 bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                    <Popover.Body>
                      <div className="grid grid-flow-col auto-cols-max justify-center items-center text-lg gap-3">
                        <div className="col-span-1">
                          Min:
                        </div>
                        <input type="number" value={filter.Quantity.min} className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Min quantity" onChange={e => {
                          const temp = filter.Quantity
                          temp.min = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, Quantity: temp}))
                        }}/>
                        <div className="col-span-1">
                          Max:
                        </div>
                        <input type="number" value={filter.Quantity.max} className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Max quantity" onChange={e => {
                          const temp = filter.Quantity
                          temp.max = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, Quantity: temp}))
                        }}/>
                        <div className="col-span-1">
                          Unit:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="Unit" onSelect={handleFilterChange} value={filter.Unit.value[filter.Unit.value.length-1] ?? ""}/>
                        </div>
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
                  <Popover id="popover-basic" className="z-20 bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                    <Popover.Body>
                      <div className="grid grid-flow-col auto-cols-max justify-center items-center text-lg gap-3">
                        <div className="col-span-1 text-right">
                          Parameter:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="Lab_Parameter" onSelect={handleFilterChange} value={filter.Lab_Parameter.value[filter.Lab_Parameter.value.length-1] ?? ""}/>
                        </div>
                        <div className="col-span-1 text-right">
                          Result Interpretation:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="Result_Interpretation" onSelect={handleFilterChange} value={filter.Result_Interpretation.value[filter.Result_Interpretation.value.length-1] ?? ""}/>
                        </div>
                        <div className="col-span-1">
                          Min:
                        </div>
                        <input type="number" value={filter.Price.min} className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Min result" onChange={e => {
                          const temp = filter.Price
                          temp.min = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, Result_Numerical: temp}))
                        }}/>
                        <div className="col-span-1">
                          Max:
                        </div>
                        <input type="number" value={filter.Price.max} className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Max result" onChange={e => {
                          const temp = filter.Price
                          temp.max = e.currentTarget.value.length > 0 ? parseFloat(e.currentTarget.value) : undefined
                          setFilter(filter => ({...filter, Result_Numerical: temp}))
                        }}/>
                        <div className="col-span-1 text-right">
                          Unit:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="Result_Unit" onSelect={handleFilterChange} value={filter.Result_Unit.value[filter.Result_Unit.value.length-1] ?? ""}/>
                        </div>
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
                  <Popover id="popover-basic" className="z-20 bg-white min-w-[10vw] rounded-xl px-2 py-3 border-solid border-2 border-green-900 items-center justify-center shadow-md  text-center">
                    <Popover.Body>
                      <div className="grid grid-flow-col auto-cols-max justify-center items-center text-lg gap-3">
                        <div className="col-span-1">
                          Diagnosis:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="Diagnosis" onSelect={handleFilterChange} value={filter.Diagnosis.value[filter.Diagnosis.value.length-1] ?? ""}/>
                        </div>
                        <div className="col-span-1">
                          ICD Code:
                        </div>
                        <div className="col-span-1">
                          <AutoComplete col="ICD_Code" onSelect={handleFilterChange} value={filter.ICD_Code.value[filter.ICD_Code.value.length-1] ?? ""}/>
                        </div>
                      </div>
                    </Popover.Body>
                  </Popover>
                }>
                  <button className="border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 w-full shadow-md  rounded-lg">Diagnosis</button>
                </OverlayTrigger>
              </div>
            </div>
          </div>

          {/* Displaying active filters */}
          <div className="mx-4 overflow-hidden">
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${search ? "" : "hidden"}`}>
              Search: {search} <button className="text-xl relative top-1" onClick={() => setSearch(undefined)}><BiX/></button>
            </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg px-3 py-2 ${filter.Matrix.value.length > 0 ? "" : "hidden"}`}>
              Matrix:&nbsp;
              {filter.Matrix.value.map((item, i) => (
                <>
                  <>{(i !== 0) ? (<>, {item}</>) : (<>{item}</>)} </>
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, Matrix: {value: filter.Matrix.value.filter((_, index) => index !== i), mandatory: filter.Matrix.mandatory }})) }}><BiX/></button>
                </>
              ))}
              <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp1 = filter.Matrix;  temp1.mandatory = !temp1.mandatory; setFilter(filter => ({...filter, Matrix: temp1}))}}>{filter.Matrix.mandatory ? "!": "?"}</button>     
              </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${filter.Unit.value.length > 0 ? "" : "hidden"}`}>
              Unit:&nbsp;
              {filter.Unit.value.map((item, i) => (
                <>
                  {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, Unit: {value: filter.Unit.value.filter((_, index) => index !== i), mandatory: filter.Unit.mandatory }})) }}><BiX/></button>
                </>
                
              ))}
              <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp2 = filter.Unit;  temp2.mandatory = !temp2.mandatory; setFilter(filter => ({...filter, Unit: temp2}))}}>{filter.Unit.mandatory ? "!": "?"}</button>
            </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${filter.Lab_Parameter.value.length > 0 ? "" : "hidden"}`}>
              Parameter:&nbsp;
              {filter.Lab_Parameter.value.map((item, i) => (
                <>
                  {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, Lab_Parameter: {value: filter.Lab_Parameter.value.filter((_, index) => index !== i), mandatory: filter.Lab_Parameter.mandatory }})) }}><BiX/></button>
                </>
              ))}
              <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp3 = filter.Lab_Parameter;  temp3.mandatory = !temp3.mandatory; setFilter(filter => ({...filter, Lab_Parameter: temp3}))}}>{filter.Lab_Parameter.mandatory ? "!": "?"}</button>
            </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${filter.Result_Interpretation.value.length > 0 ? "" : "hidden"}`}>
              Res.Interpretation:&nbsp;
              {filter.Result_Interpretation.value.map((item, i) => (
                <>
                  {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, Result_Interpretation: {value: filter.Result_Interpretation.value.filter((_, index) => index !== i), mandatory: filter.Result_Interpretation.mandatory }})) }}><BiX/></button>
                </>
              ))}
                <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp4 = filter.Result_Interpretation;  temp4.mandatory = !temp4.mandatory; setFilter(filter => ({...filter, Result_Interpretation: temp4}))}}>{filter.Result_Interpretation.mandatory ? "!": "?"}</button>
            </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${filter.Result_Unit.value.length > 0 ? "" : "hidden"}`}>
              Res.Unit:&nbsp;
              {filter.Result_Unit.value.map((item, i) => (
                <>
                  {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, Result_Unit: {value: filter.Result_Unit.value.filter((_, index) => index !== i), mandatory: filter.Result_Unit.mandatory }})) }}><BiX/></button>
                </>
              ))}
              <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp5 = filter.Result_Unit;  temp5.mandatory = !temp5.mandatory; setFilter(filter => ({...filter, Result_Unit: temp5}))}}>{filter.Result_Unit.mandatory ? "!": "?"}</button>
            </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${filter.Diagnosis.value.length > 0 ? "" : "hidden"}`}>
              Diagnosis:&nbsp;
              {filter.Diagnosis.value.map((item, i) => (
                <>
                  {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, Diagnosis: {value: filter.Diagnosis.value.filter((_, index) => index !== i), mandatory: filter.Diagnosis.mandatory }})) }}><BiX/></button>
                </>
              ))}
              <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp6 = filter.Diagnosis;  temp6.mandatory = !temp6.mandatory; setFilter(filter => ({...filter, Diagnosis: temp6}))}}>{filter.Diagnosis.mandatory ? "!": "?"}</button>      
            </span>
            <span className={`bg-[rgb(174,207,150)] justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${filter.ICD_Code.value.length > 0 ? "" : "hidden"}`}>
              ICD:&nbsp;
              {filter.ICD_Code.value.map((item, i) => (
                <>
                  {(i !== 0) ? (<>, {item}</>) : (<>{item}</>)}
                  <button className="text-xl relative top-1" onClick={() => {setFilter((filter) =>( {...filter, ICD_Code: {value: filter.ICD_Code.value.filter((_, index) => index !== i), mandatory: filter.ICD_Code.mandatory }})) }}><BiX/></button>
                </>
              ))}
              <button className="relative w-fit bg-[rgb(165,207,134)] hover:bg-[rgb(183,224,153)] text-white px-3 py-1 text-lg text-center rounded-2xl outline-none transition" onClick={() => {const temp7 = filter.ICD_Code;  temp7.mandatory = !temp7.mandatory; setFilter(filter => ({...filter, ICD_Code: temp7}))}}>{filter.ICD_Code.mandatory ? "!": "?"}</button>      
            </span>
          </div>
        </div>
        
      </div>

      <div className="mx-4 my-2">
          <Table page={page} pagelength={pagelength} count={count} optionalSamples={samples} setPage={setPage} setPagelength={setPagelength} expert={false} filterNormal={filter}/>
      </div>

      <Footer/>
    </div>
  );
};
