import React, { useState } from "react";
import { type group } from "~/pages/expertsearch";
import { useHookstate, type State } from '@hookstate/core';
import { z } from "zod";

type CustomModalProps = {
  showModal: boolean;
  onCloseModal: () => void;
  filter: State<group>;
};

export const groupSchema: z.ZodSchema<group> = z.lazy(() =>
  z.object({
    not: z.boolean(),
    link: z.string(),
    activated: z.boolean(),
    filter: z.array(
      z.object({
        col: z.string(),
        type: z.string(),
        values: z.array(z.string()),
        activated: z.boolean()
      })
    ),
    groups: z.array(groupSchema)
  })
)

export const filterSchema = z.array( 
  z.object({
    name: z.string(),
    filter: groupSchema
  }) 
)

type Filter = z.infer<typeof filterSchema>

const ModalLoad: React.FC<CustomModalProps> = ({ showModal, onCloseModal, filter}) => {
  const filters = useHookstate(filter)
  const [index,setIndex] = useState<number>()

  if (!showModal) {
    return <></>;
  }

  const storageFilter = localStorage.getItem("Filter")
  let parseFilter: Filter = []
  
  if (typeof storageFilter === 'string'){
    // TODO: Add safeguard for parse errors
    parseFilter = filterSchema.parse(JSON.parse(storageFilter))
  }

  function LoadFilter() {
    if (index !== undefined){
      filters.set(parseFilter[index]?.filter ?? {not: false, link: 'AND', activated: true, filter: [{col: 'CBH_Donor_ID', type: 'equal', values: [], activated: true,}], groups: []})
    } else{
      alert("Choose a filter!")
    }
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-[rgb(131,182,94)]">
              <h3 className="text-3xl font-semibold">Load filters</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onCloseModal}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <h1>Choose:</h1>
            </div>
            <table>
              <tr className="text-center items-center">
              <div className="flex flex-col mx-5 ">

                {parseFilter.length > 0 ? parseFilter.map((filter, i) => (
                  <button key={i} onClick={() => setIndex(i)} className={`py-1 rounded-2xl ${i===index ? "bg-[#9DC88D]": "bg-slate-100"}`}>{filter.name}</button>
                )): <label>No filter found.</label>}
              </div>
              </tr>
            </table>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={onCloseModal}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={LoadFilter}
              >
                Load
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default ModalLoad;
