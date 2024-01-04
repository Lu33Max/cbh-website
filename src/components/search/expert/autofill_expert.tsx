import type { State } from "@hookstate/core";
import React, { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import autofill from "../normal/autofill";

// Props for the AutoComplete component
type AutoCompleteProps = {
  col: string;
  onSelect: (value: string, column: string) => void;
  value: State<string, object>;
};

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [input, setInput] = useState<string>(props.value.get() || '');
  const { data: autofill } = api.samples.getDistinct.useQuery(props.col);

  useEffect(() => {
    const tempArray: string[] = [];
    if (autofill) {
      for (let i = 0; i < autofill.length; i++) {
        const test = autofill[i];
        test ? tempArray.push(test.toString()) : void 0;
      }
    }

    tempArray.sort();

    setResults(tempArray.filter(item => item.toLowerCase().includes(input.toLowerCase())));

  }, [autofill, input, props.value]);

  const handleSelect = (selectedValue: string) => {
    setInput(selectedValue);
    props.onSelect(selectedValue, props.col);
  };

  useEffect(() => {
    // Hier wird der lokale State aktualisiert, wenn sich der externe Wert ändert
    setInput(props.value.get() || '');
  }, [props.value]);

  return (
    <div>
      {/* Render the input element */}
      <input
        value={input}
        required
        className={`w-full z-20 rounded-r-full border-2 border-gray-500 px-3 py-1 text-lg outline-none transition focus:border-gray-700 relative`}
        autoComplete="off"
        list="autocomplete-list"
        name="list"
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => setTimeout(() => setFocus(false), 300)}
        onFocus={() => setFocus(true)}
      />

      {focus && (
        <div className={`absolute w-fit max-w-[500px] flex flex-col bg-gray-50 p-2 max-h-60 overflow-y-scroll rounded-lg border-2 border-green-900 z-50`}>
          {results.map((item, i) => (
            <label
              key={`${props.col}-${item}-${i}`}
              className="mt-1 px-3 bg-[#D8E9D1] rounded-lg"
              onClick={() => { setInput(item); props.onSelect(item, props.col); }}
            >
              {item}
            </label>
          ))}
          <style jsx>{`
            .overflow-y-scroll::-webkit-scrollbar {
              width: 10px;
            }

            .overflow-y-scroll::-webkit-scrollbar-thumb {
              background-color: #afd69f;
              border-radius: 6px;
            }

            .overflow-y-scroll::-webkit-scrollbar-track {
              background-color: #d3d3d3;
              border-radius: 6px;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;