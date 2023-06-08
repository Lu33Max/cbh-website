import React, { useState,  useEffect } from 'react'
import { api } from '~/utils/api'
import { type State } from '@hookstate/core'

type Props = {
    col: string,
    callback: (value: string) => void,
    value: State<string> | undefined,
    rounded: boolean
}

const AutofillExpert = ({col, callback, value, rounded} : Props) => {
    const { data: autofill } = api.samples.getDistinct.useQuery(col)

    const [focus, setFocus] = useState<boolean>(false)
    const [results, setResults] = useState<string[]>([])
    const [resultsShown, setResultsShown] = useState<string[]>([])

    useEffect(() => {
        const tempArray: string[] = [];
        if(autofill){
          for (let i = 0; i < autofill?.length; i++){
            const test = autofill[i]
            test ? tempArray.push(test.toString()) : void(0)
          }
        }
        setResults(tempArray)
      }, [autofill])

    useEffect(() => {
        setResultsShown(results)
    },[results])

    return (
        <div>
            <div tabIndex={1} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="relative">
                <input value={value ? value.value : ""} onChange={(e) => {setResultsShown(results.filter((el) => el.toLowerCase().includes(e.target.value.toLowerCase()))); callback(e.target.value)}} type="text" className={`relative w-full px-3 py-1 text-lg ${rounded ? "rounded-r-full" : ""} border-2 border-gray-500 focus:border-gray-700 outline-none transition z-20`} placeholder="Search for value..."/>
                {/* Search Results Container */}
                {(focus && resultsShown.length > 0) && (
                    <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto z-50">
                        {resultsShown.sort().map((item, index) => {
                            return (
                                <div key={index} onMouseDown={() => callback(item)} className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2">
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

export default AutofillExpert
