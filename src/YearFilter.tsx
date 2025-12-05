"use client";

import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";
import { ChevronUpIcon } from "./icons";

interface YearFilterProps {
  state: number;
  setState: Dispatch<SetStateAction<number>>;
  data: number[];
  yearFilterInputStyle?: string;
}

export default function YearFilter({
  state,
  setState,
  data,
  yearFilterInputStyle,
}: YearFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "transition-all flex items-center justify-between",
          yearFilterInputStyle ||
            "bg-white/20 duration-200 hover:scale-105 hover:bg-white/30 backdrop-blur-sm gap-2 min-w-[120px] px-4 py-2 rounded-lg text-sm font-medium"
        )}>
        <span>{state}</span>
        <ChevronUpIcon
          aria-hidden='true'
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />
          <div className='absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-20 min-w-[100px] max-h-60 overflow-y-auto'>
            {data.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setState(year);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  state === year
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-700"
                }`}>
                {year}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
