import React, { useState, useEffect } from 'react';
import { api } from '~/utils/api';

type AutoCompleteProps = {
    col: string,
    onSelect: (value: string, column: string) => void,
    value: string
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
    const { data: autofill } = api.samples.getDistinct.useQuery(props.col);
    const [lastVal, setLastVal] = useState<string | undefined>('')
    const [currentVal, setCurrentVal] = useState<string>('')
    const [results, setResults] = useState<string[]>([]);

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
    
    useEffect(() =>{
        setCurrentVal(props.value)
    }, [props.value])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
    
        const eventType = results.find(item => item === val) && lastVal !== undefined && lastVal.length < (val.length - 1) ? 'onSelect' : undefined
        if (eventType !== undefined)
        props[eventType] && props[eventType](val, props.col)

        setLastVal(val)
        setCurrentVal(val)
    }

    return (
        <>
            <input 
                value={currentVal}
                className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition"
                autoComplete='off' 
                list="autocomplete-list" 
                id="list" 
                name="list" 
                placeholder="Search" 
                onChange={handleOnChange}  
            />
    
            <datalist id="autocomplete-list">
                {results.map(item => <option key={item} value={item}/> )}
            </datalist>
        </>
    )
}

export default AutoComplete;
