"use client";
import {
  eachDayOfInterval,
  format,
  getDay,
  getMonth,
  isToday,
  getYear,
  isValid,
  parseISO,
} from "date-fns";
import { memo, useMemo, useState } from "react";
import clsx from "clsx";
import MonthFilter from "./MonthFilter";
import YearFilter from "./YearFilter";
import "./styles.css";
export type EventItem = {
  [key: string]: string | undefined;
  title: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  description?: string;
};

export type EventGroups = EventItem[][];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDate(dateString: string): Date {
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : new Date();
}

function Calendar({
  onDateClick,
  selectedDate,
  headings = [],
  headingColors = [{ bgColor: "", titleColor: "" }],
  data = [],
  yearFilters = [],
  bgColors = {
    calendarHeadingColor: "",
    selectedDateBorderColor: "",
    selectedDateBgColor: "",
  },
}: {
  onDateClick: (date: string) => void;
  selectedDate: string;
  headings?: string[];
  headingColors?: { bgColor: string; titleColor?: string }[];
  data?: EventGroups;
  yearFilters?: number[];
  bgColors?: {
    calendarHeadingColor?: string;
    selectedDateBorderColor?: string;
    selectedDateBgColor?: string;
  };
}) {
  const yearFilterData = useMemo(
    () =>
      yearFilters.length > 0
        ? yearFilters
        : [
            new Date().getFullYear(),
            new Date().getFullYear() + 1,
            new Date().getFullYear() + 2,
          ],
    [yearFilters]
  );

  const [month, setMonth] = useState(getMonth(new Date()));
  const [year, setYear] = useState(getYear(new Date()));

  const firstDayOfMonth = useMemo(
    () => new Date(year, month, 1),
    [year, month]
  );
  const lastDayOfMonth = useMemo(
    () => new Date(year, month + 1, 0),
    [year, month]
  );

  const daysInMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      }),
    [firstDayOfMonth, lastDayOfMonth]
  );

  const startingDayIndex = useMemo(
    () => getDay(firstDayOfMonth),
    [firstDayOfMonth]
  );

  const eventLookup = useMemo(() => {
    const map: Record<string, EventItem[]> = {};

    if (!Array.isArray(data)) return map;

    data.forEach((group) => {
      group.forEach((event) => {
        if (event.date) {
          const d = event.date.slice(0, 10);
          map[d] = map[d] || [];
          map[d].push(event);
        } else if (event.startDate && event.endDate) {
          const start = event.startDate.slice(0, 10);
          const end = event.endDate.slice(0, 10);

          const range = eachDayOfInterval({
            start: parseISO(start),
            end: parseISO(end),
          });

          range.forEach((day) => {
            const d = format(day, "yyyy-MM-dd");
            map[d] = map[d] || [];
            map[d].push(event);
          });
        }
      });
    });

    return map;
  }, [data]);

  return (
    <div className='grid grid-cols-1 xl:grid-cols-4 gap-8 p-6 min-h-screen'>
      <div className='xl:col-span-3'>
        <div className='bg-white rounded-2xl shadow-xl border-2 border-slate-200/60 overflow-hidden'>
          <div
            className={clsx(
              "text-white p-6",
              bgColors.calendarHeadingColor ||
                "bg-linear-to-r from-blue-600 to-indigo-600"
            )}>
            {headings.length > 0 && (
              <div className='flex flex-wrap justify-center gap-6 mb-6'>
                {headings.map((h, idx) => (
                  <div className='flex items-center gap-2' key={h}>
                    <div
                      className={clsx(
                        "rounded-full w-3 h-3",
                        headingColors[idx]?.bgColor || "bg-white/30"
                      )}></div>
                    <span className='text-md font-medium text-white/90'>
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <h1 className='text-2xl font-bold'>
                {months[month]} {year}
              </h1>

              <div className='flex flex-wrap items-center gap-3'>
                <button
                  className='bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105'
                  onClick={() => {
                    const today = new Date();
                    setMonth(getMonth(today));
                    setYear(getYear(today));
                    onDateClick(format(today, "yyyy-MM-dd"));
                  }}>
                  Today
                </button>
                <MonthFilter state={month} setState={setMonth} data={months} />
                <YearFilter
                  state={year}
                  setState={setYear}
                  data={yearFilterData}
                />
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='grid grid-cols-7 mb-2'>
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className='text-center py-3 text-sm font-semibold text-slate-600 uppercase tracking-wide'>
                  {day}
                </div>
              ))}
            </div>

            <div className='grid grid-cols-7 gap-1 bg-slate-100 p-1 rounded-xl'>
              {Array.from({ length: startingDayIndex }).map((_, index) => (
                <div key={`empty-${index}`} className='aspect-square' />
              ))}

              {daysInMonth.map((day, index) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const eventsForDay = eventLookup[dateKey] || [];

                return (
                  <div
                    key={index}
                    onClick={() => onDateClick(dateKey)}
                    className={clsx(
                      "aspect-square bg-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 flex flex-col",
                      selectedDate === dateKey
                        ? `${
                            bgColors.selectedDateBorderColor ||
                            "ring-2 ring-blue-600"
                          } bg-blue-50 shadow-lg`
                        : "hover:bg-slate-50"
                    )}>
                    <span
                      className={clsx(
                        "text-sm font-medium mb-1 m-2 shrink-0",
                        isToday(day)
                          ? `${
                              bgColors.selectedDateBgColor || "bg-blue-600"
                            } text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`
                          : "text-slate-700"
                      )}>
                      {format(day, "d")}
                    </span>

                    {/* Optimized event display */}
                    <div className='flex-1 space-y-1 overflow-y-auto no-scrollbar'>
                      {eventsForDay.map((ev, idx) => (
                        <DisplayCurrentData
                          key={idx}
                          event={ev}
                          headingColor={headingColors[idx]?.bgColor || ""}
                          titleColor={headingColors[idx]?.titleColor || ""}
                          date={dateKey}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='space-y-6'>
        <div className='bg-white rounded-xl shadow-lg border border-slate-200/60 p-6'>
          <h3 className='text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2'>
            <div
              className={clsx(
                "w-2 h-2 rounded-full",
                bgColors.selectedDateBorderColor || "bg-blue-500"
              )}></div>
            Selected Date
          </h3>
          <p className='text-slate-600 font-medium bg-slate-50 rounded-lg px-3 py-2'>
            {format(parseDate(selectedDate), "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {headings.length > 0 && (
          <div className='bg-white rounded-xl shadow-lg border border-slate-200/60 p-6'>
            <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              Event Categories
            </h3>
            <div className='space-y-3'>
              {headings.map((heading, idx) => (
                <div
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors'
                  key={idx}>
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full shadow-sm",
                      headingColors[idx]?.bgColor
                    )}></div>
                  <span className='text-sm font-medium text-slate-700'>
                    {heading}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DisplayCurrentData = memo(function DisplayCurrentData({
  event,
  headingColor,
  titleColor,
  date,
}: {
  event: EventItem;
  headingColor: string;
  titleColor: string;
  date: string;
}) {
  const startSame = event.startDate?.slice(0, 10) === date;
  const endSame = event.endDate?.slice(0, 10) === date;

  const startAndEndDateAreSame =
    event.startDate &&
    event.endDate &&
    event.startDate.slice(0, 10) === event.endDate.slice(0, 10);

  return (
    <div
      className={clsx(
        "shadow-sm font-medium px-2 py-1 text-xs truncate hover:shadow-md transition-shadow",
        headingColor || "bg-slate-400",
        titleColor || "text-white",
        startAndEndDateAreSame && "mx-2 rounded-md",
        startSame && "ml-2 rounded-tl-md rounded-bl-md",
        endSame && "mr-2 rounded-tr-md rounded-br-md"
      )}
      title={event.title}>
      {event.title.length >= 8 ? `${event.title.slice(0, 8)}...` : event.title}
    </div>
  );
});

export default memo(Calendar);
