import React, { useEffect, useReducer, useMemo } from 'react';
import { api } from '~/utils/api';

type AutoCompleteProps = {
    col: string,
    onSelect: (value: string, column: string) => void,
    value: string
}

type AutoCompleteState = {
    currentVal: string;
    results: string[];
};

type AutoCompleteAction =
    | { type: 'SET_CURRENT_VAL'; payload: string }
    | { type: 'SET_RESULTS'; payload: string[] };

const initialState: AutoCompleteState = {
    currentVal: '',
    results: [],
};

const autoCompleteReducer = (state: AutoCompleteState, action: AutoCompleteAction): AutoCompleteState => {
    switch (action.type) {
        case 'SET_CURRENT_VAL':
            return { ...state, currentVal: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        default:
            return state;
    }
};

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
    const { data: autofill } = api.samples.getDistinct.useQuery(props.col);

    const [state, dispatch] = useReducer(autoCompleteReducer, initialState);

    useEffect(() => {
        const tempArray: string[] = [];
        if (autofill) {
            for (let i = 0; i < autofill?.length; i++) {
                const test = autofill[i];
                test ? tempArray.push(test.toString()) : void 0;
            }
        }
        dispatch({ type: 'SET_RESULTS', payload: tempArray });
    }, [autofill]);
    
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        dispatch({ type: 'SET_CURRENT_VAL', payload: val });
    };

    const handleOnBlur = () => {
        const eventType = state.results.includes(state.currentVal) ? 'onSelect' : undefined;

        if (eventType !== undefined) {
            props[eventType] && props[eventType](state.currentVal, props.col);
        }
    };

    useMemo(() => {
        dispatch({ type: 'SET_CURRENT_VAL', payload: props.value });
    }, [props.value]);

    return (
        <>
            <input 
                value={state.currentVal}
                className="w-[200px] px-3 py-1 text-lg rounded-full border-2 border-gray-500 focus:border-gray-700 outline-none transition"
                autoComplete='off' 
                list="autocomplete-list" 
                id="list" 
                name="list" 
                placeholder="Search" 
                onChange={handleOnChange}
                onBlur={handleOnBlur}
            />
    
            <datalist id="autocomplete-list">
                {state.results.map(item => <option key={item} value={item}/> )}
            </datalist>
        </>
    )
}

export default AutoComplete;
