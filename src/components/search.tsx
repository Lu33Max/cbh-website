import { onChange } from '@builder.io/react'
import React, { useState,useEffect } from 'react'
import { api } from "~/utils/api";

const Search: React.FC = () => {
const [Filters, setFilters] = useState("")
const [Input, setInput] = useState("")
const [Samples, setSamples] = useState<Samples[]|undefined>()

function onChange () {
    var temp = Filters + Input
    setFilters(temp)
}

useEffect(() => {
    //const samples = api.samples.getAll.useQuery({ pages: 1, lines: 20, search: Filters})
    //console.log(samples.data?.at(0)?.cbhDonorID)
    //console.log(samples.data?.length)
} ,[Filters] )

  return (
    <div className='bg-[#758476] h-[5vh] flex flex-row px-5 py-2 items-center justify-center font-body font-poppins text-2xl text-white font-thin'>
      <h3>Central BioHub<sup>©</sup> - Order Biospecimen Online</h3>
        <form>
            <label>Filter</label>
            <input type="text" name="filterInput" onChange={e => setInput(e.currentTarget.value)}></input>
            <button type="button" name="applyFilter" onClick={ e => (setSamples(api.samples.getAll.useQuery({ pages: 1, lines: 20, search: Filters}).data)) }>Apply</button>
        </form>
    </div>
  )
}

export default Search
