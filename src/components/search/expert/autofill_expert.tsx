import { type State } from "@hookstate/core";
import React, { useEffect, useReducer, useMemo } from "react";
import { api } from "~/utils/api";

type AutoCompleteProps = {
  col: string;
  onSelect: (value: string) => void;
  value: State<string>;
};

type AutoCompleteState = {
  currentVal: string;
  results: string[];
};

type AutoCompleteAction =
  | { type: "SET_CURRENT_VAL"; payload: string }
  | { type: "SET_RESULTS"; payload: string[] };

const initialState: AutoCompleteState = {
  currentVal: "",
  results: [],
};

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

const AutoComplete: React.FC<AutoCompleteProps> = React.memo((props) => {
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
    dispatch({ type: "SET_RESULTS", payload: tempArray });
  }, [autofill]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    dispatch({ type: "SET_CURRENT_VAL", payload: val });
  };

  const handleOnBlur = () => {
    const eventType = state.results.includes(state.currentVal)
      ? "onSelect"
      : undefined;

    if (eventType !== undefined) {
      props[eventType] && props[eventType](state.currentVal);
    }
  };

  useMemo(() => {
    dispatch({ type: "SET_CURRENT_VAL", payload: props.value.value });
  }, [props.value.value]);

  return (
    <>
      <input
        value={state.currentVal}
        className={`relative z-20 w-full rounded-r-full border-2 border-gray-500 px-3 py-1 text-lg outline-none transition focus:border-gray-700`}
        autoComplete="on"
        list="autocomplete-list"
        id="list"
        name="list"
        placeholder="Search"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />

      <datalist id="autocomplete-list" onChange={() => console.log("test")}>
        {state.results.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
    </>
  );
});

AutoComplete.displayName = "AutoComplete";

export default AutoComplete;
