import React, { useEffect, useState } from "react";
import { INormalFilter } from "~/common/filter/filter";
import { api } from "~/utils/api";

// Props for the AutoComplete component
type AutoCompleteProps = {
  col: string;
  onSelect: (value: string, column: string) => void;
  value: string;
  classname?: string;
  filter: INormalFilter;
  search?: string;
  category: string;
  column: string;
};

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  // Fetch data using an API call
  const { data: autofill } = api.samples.getDistinct.useQuery({filter: props.filter, search: props.search, category: props.category, column: props.column});

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
        <div className="absolute top-14 w-[200px] flex flex-col bg-gray-50 p-2 max-h-60 overflow-y-scroll rounded-lg border-2 border-green-900">
          {results.map((item, i) => (
            <label key={`${props.col}-${item}-${i}`} className="mt-1 bg-[#D8E9D1] rounded-lg" onClick={() => {setInput(""); props.onSelect(item, props.col)}}>{item}</label>
          ))}
          <style jsx>{`
            /* Add custom styles for the scrollbar here */
            .overflow-y-scroll::-webkit-scrollbar {
              width: 10px; /* Set the width of the scrollbar */
            }

            .overflow-y-scroll::-webkit-scrollbar-thumb {
              background-color: #afd69f; /* Set the color of the scrollbar thumb */
              border-radius: 6px; /* Set the border-radius of the scrollbar thumb */
            }

            .overflow-y-scroll::-webkit-scrollbar-track {
              background-color: #d3d3d3; /* Set the color of the scrollbar track */
              border-radius: 6px; /* Set the border-radius of the scrollbar track */
            }
          `}</style>
        </div>
      )}


    </div>
  );
};

export default AutoComplete;
