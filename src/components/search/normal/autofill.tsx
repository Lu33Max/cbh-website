import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";

// Props for the AutoComplete component
type AutoCompleteProps = {
  col: string;
  onSelect: (value: string, column: string) => void;
  value: string;
  classname?: string;
};

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  // Fetch data using an API call
  const { data: autofill } = api.samples.getDistinct.useQuery(props.col);

  const [focus, setFocus] = useState<boolean>(false)
  const [results, setResults] = useState<string[]>([])
  const [input, setInput] = useState<string>("")

  useEffect(() => {
    // Prepare the array of results based on the fetched data
    const tempArray: string[] = [];

    if (autofill) {
      for (let i = 0; i < autofill?.length; i++) {
        const test = autofill[i];
        test ? tempArray.push(test.toString()) : void 0;
      }
    }
    
    tempArray.sort();
    
    setResults(tempArray.filter(item => item.toLowerCase().includes(input.toLowerCase())))
  }, [autofill, input]);

  return (
    <div>
      {/* Render the input element */}
      <input
        value={input}
        required
        className={`w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400 ${props.classname ?? "peer"}`}
        autoComplete="off"
        list="autocomplete-list"
        id="list"
        name="list"
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => setTimeout(() => setFocus(false), 300)}
        onFocus={() => setFocus(true)}
      />

      {focus && (
        <div className="absolute top-14 w-[200px] flex flex-col bg-gray-50 p-2 max-h-60 overflow-y-scroll">
          {results.map((item, i) => (
            <label key={`${props.col}-${item}-${i}`} className=" mt-1 bg-gray-200" onClick={() => {setInput(""); props.onSelect(item, props.col)}}>{item}</label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
