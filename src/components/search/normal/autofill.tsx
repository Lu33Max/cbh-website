import React, { useEffect, useReducer, useMemo } from "react";
import { api } from "~/utils/api";

// Props for the AutoComplete component
type AutoCompleteProps = {
  col: string;
  onSelect: (value: string, column: string) => void;
  value: string;
};

type AutoCompleteState = {
  currentVal: string;
  results: string[];
};

// Actions that can be dispatched to modify the state of the AutoComplete component
type AutoCompleteAction =
  | { type: "SET_CURRENT_VAL"; payload: string }
  | { type: "SET_RESULTS"; payload: string[] };

const initialState: AutoCompleteState = {
  currentVal: "",
  results: [],
};

// Reducer function for the AutoComplete component
const autoCompleteReducer = (
  state: AutoCompleteState,
  action: AutoCompleteAction
): AutoCompleteState => {
  switch (action.type) {
    case "SET_CURRENT_VAL":
      return { ...state, currentVal: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload };
    default:
      return state;
  }
};

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  // Fetch data using an API call
  const { data: autofill } = api.samples.getDistinct.useQuery(props.col);

  // Use the reducer and initial state to manage the state of the component
  const [state, dispatch] = useReducer(autoCompleteReducer, initialState);

  useEffect(() => {
    // Prepare the array of results based on the fetched data
    const tempArray: string[] = [];
    if (autofill) {
      for (let i = 0; i < autofill?.length; i++) {
        const test = autofill[i];
        test ? tempArray.push(test.toString()) : void 0;
      }
    }
    
    dispatch({ type: "SET_RESULTS", payload: tempArray });
  }, [autofill]);

  // Event handler for the input's onChange event
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    dispatch({ type: "SET_CURRENT_VAL", payload: val });
  };

  // Event handler for the input's onBlur event
  const handleOnBlur = () => {
    const eventType = state.results.includes(state.currentVal)
      ? "onSelect"
      : undefined;

    if (eventType !== undefined) {
      // Call the onSelect prop if it exists and pass the current value and column
      props[eventType] && props[eventType](state.currentVal, props.col);
    }
  };

  useMemo(() => {
    dispatch({ type: "SET_CURRENT_VAL", payload: props.value });
  }, [props.value]);

  return (
    <>
      {/* Render the input element */}
      <input
        value={state.currentVal}
        className="w-[200px] rounded-full border-2 border-gray-500 px-3 py-1 text-lg outline-none transition focus:border-gray-700"
        autoComplete="off"
        list="autocomplete-list"
        id="list"
        name="list"
        placeholder="Search"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />

      {/* Render the datalist element for autocomplete options */}
      <datalist id="autocomplete-list">
        {state.results.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
    </>
  );
};

export default AutoComplete;
