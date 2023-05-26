import React, { useState,  useEffect } from 'react'
import { api } from '~/utils/api'

type Props = {
    value: string,
    callback: (value: string, column:string) => void
}

const Autofill = ({value, callback} : Props) => {
    const { data: autofill } = api.samples.getDistinct.useQuery(value)

    const [focus, setFocus] = useState<boolean>(false)
    const [results, setResults] = useState<string[]>([])
    const [resultsShown, setResultsShown] = useState<string[]>([])
    const [inputValue, setInputValue] = useState<string>("")

    useEffect(() => {
        const tempArray: string[] = [];
        if(autofill){
          for (let i = 0; i < autofill?.length; i++){
            const test = autofill[i]
            test ? tempArray.push(test) : void(0)
          }
        }
        setResults(tempArray)
      }, [autofill])

    useEffect(() => {
        setResultsShown(results)
    },[results])

    return (
        <div className="flex items-center justify-center">
            <div tabIndex={1} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="relative">
                <input value={inputValue} onChange={(e) => {setResultsShown(results.filter((el) => el.toLowerCase().includes(e.target.value.toLowerCase()))); setInputValue(e.target.value)}} type="text" className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition" placeholder="Search for value..."/>
                {/* Search Results Container */}
                {focus && (
                    <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto z-20">
                        {resultsShown.sort().map((item, index) => {
                            return (
                                <div key={index} onMouseDown={() => {callback(item, value); setInputValue(item)}} className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2">
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Autofill
