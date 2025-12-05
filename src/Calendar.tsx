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
export type EventItem = {
  title: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  description?: string;
  bgColor?: string; // <-- merged from heading
  titleColor?: string; // <-- merged from heading
};

export type Heading = {
  title: string;
  bgColor: string;
  titleColor: string;
};

export type EventGroups = EventItem[][];

export type CalendarProps = {
  onDateClick: (date: string) => void;
  selectedDate: string;
  data: EventGroups | EventItem[];
  headings: Record<string, Heading>;
  dataType?: "NESTED_ARRAY" | "ARRAY";
  scheduledEvents?: boolean;
  categories?: boolean;
  yearFilters?: number[];
  styles?: {
    calendarHeadingBgColor?: string;
    selectedDateBgColor?: string;
    border?: string;
    layout?: string;
    height?: string;
    width?: string;
  };
  buttonStyle?: string;
  monthFilterInputStyle?: string;
  yearFilterInputStyle?: string;
};

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
  scheduledEvents = true,
  categories = true,
  dataType = "NESTED_ARRAY",
  selectedDate,
  headings = {},
  data = [],
  yearFilters = [],
  styles = {
    calendarHeadingBgColor: "",
    selectedDateBgColor: "",
    border: "",
    layout: "",
  },
  buttonStyle,
  monthFilterInputStyle,
  yearFilterInputStyle,
}: CalendarProps) {
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
  function handleEventInsert(
    event: EventItem,
    map: Record<string, EventItem[]>,
    colorData: Partial<Heading>
  ) {
    if (event.date) {
      const d = event.date.slice(0, 10);
      map[d] = map[d] || [];
      map[d].push({ ...event, ...colorData });
    } else if (event.startDate && event.endDate) {
      const start = event.startDate.slice(0, 10);
      const end = event.endDate.slice(0, 10);

      eachDayOfInterval({
        start: parseISO(start),
        end: parseISO(end),
      }).forEach((day) => {
        const d = format(day, "yyyy-MM-dd");
        map[d] = map[d] || [];
        map[d].push({ ...event, ...colorData });
      });
    }
  }

  const eventLookup = () => {
    const map: Record<string, EventItem[]> = {};

    if (!Array.isArray(data)) return map;

    // NESTED ARRAY MODE (EventGroups)
    if (dataType === "NESTED_ARRAY" && Array.isArray(data[0])) {
      (data as EventGroups).forEach((group, idx) => {
        const colorData = Object.values(headings)[idx];

        group.forEach((event) => {
          handleEventInsert(event, map, colorData);
        });
      });
    } else {
      // FLAT ARRAY MODE
      (data as EventItem[]).forEach((event) => {
        const colorData = headings[event.type ?? ""] || {};
        handleEventInsert(event, map, colorData);
      });
    }

    return map;
  };

  return (
    <div
      className={clsx(
        styles.layout || "grid grid-cols-1 xl:grid-cols-4 gap-8 p-6",
        styles.height || "h-screen",
        styles.width || "w-full"
      )}>
      <div className='xl:col-span-3'>
        <div
          className={clsx(
            "bg-white overflow-hidden",
            styles.border ||
              "border-2 border-slate-200/60 rounded-2xl shadow-xl"
          )}>
          <div
            className={clsx(
              "text-white p-6",
              styles.calendarHeadingBgColor ||
                "bg-linear-to-r from-blue-600 to-indigo-600"
            )}>
            {Object.keys(headings).length > 0 && (
              <div className='flex flex-wrap justify-center gap-6 mb-6'>
                {Object.entries(headings).map(([key, value], idx) => (
                  <div className='flex items-center gap-2' key={idx}>
                    <div
                      className={clsx(
                        "rounded-full w-3 h-3",
                        value.bgColor,
                        value.titleColor
                      )}></div>
                    <span className='text-md font-medium text-white/90'>
                      {value.title}
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
                  className={
                    buttonStyle ||
                    "bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                  }
                  onClick={() => {
                    const today = new Date();
                    setMonth(getMonth(today));
                    setYear(getYear(today));
                    onDateClick(format(today, "yyyy-MM-dd"));
                  }}>
                  Today
                </button>
                <MonthFilter
                  monthFilterInputStyle={monthFilterInputStyle}
                  state={month}
                  setState={setMonth}
                  data={months}
                />
                <YearFilter
                  yearFilterInputStyle={yearFilterInputStyle}
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
                const eventsForDay = eventLookup()[dateKey] || [];
                return (
                  <div
                    key={index}
                    onClick={() => onDateClick(dateKey)}
                    className={clsx(
                      "aspect-square bg-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 flex flex-col",
                      selectedDate === dateKey
                        ? `${
                            styles.selectedDateBgColor || "ring-2 ring-blue-600"
                          } bg-blue-50 shadow-lg`
                        : "hover:bg-slate-50"
                    )}>
                    <span
                      className={clsx(
                        "text-sm font-medium mb-1 m-2 shrink-0",
                        isToday(day)
                          ? `${
                              styles.selectedDateBgColor || "bg-blue-600"
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
                          headingColor={ev.bgColor}
                          titleColor={ev.titleColor}
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

      <div className='space-y-6'>
        {scheduledEvents && (
          <div className='bg-white rounded-xl shadow-lg border border-slate-200/60 p-6'>
            <h3 className='text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2'>
              <div
                className={clsx(
                  "w-2 h-2 rounded-full",
                  styles.selectedDateBgColor || "bg-blue-500"
                )}></div>
              Selected Date
            </h3>
            <p className='text-slate-600 font-medium bg-slate-50 rounded-lg px-3 py-2'>
              {format(parseDate(selectedDate), "EEEE, MMMM d, yyyy")}
            </p>
            {eventLookup()[selectedDate].length > 0 && (
              <div>
                <h3 className='text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2'>
                  <div
                    className={clsx(
                      "w-2 h-2 rounded-full",
                      styles.selectedDateBgColor || "bg-blue-500"
                    )}></div>
                  Scheduled Events
                </h3>
                <div className='no-scrollbar max-h-[500px] space-y-5 overflow-y-auto'>
                  {eventLookup()[selectedDate].map((event, idx) => {
                    return (
                      <div
                        key={idx}
                        className={clsx(
                          event.bgColor,
                          event.titleColor,
                          "p-2 rounded-lg"
                        )}>
                        <p>
                          <b>{event.title}</b>
                        </p>
                        {event.startDate && (
                          <p>
                            Start Date :
                            <span className={clsx("p-2 rounded-lg ")}>
                              {format(
                                parseDate(event.startDate),
                                "EEEE, MMMM d, yyyy"
                              )}
                            </span>
                          </p>
                        )}

                        {event.endDate && (
                          <p>
                            End Date :
                            <span className={clsx("p-2 rounded-lg ")}>
                              {format(
                                parseDate(event.endDate),
                                "EEEE, MMMM d, yyyy"
                              )}
                            </span>
                          </p>
                        )}
                        {event.date && (
                          <p>
                            Date :
                            <span className={clsx("p-2 rounded-lg")}>
                              {format(
                                parseDate(event.date),
                                "EEEE, MMMM d, yyyy"
                              )}
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {categories && (
          <>
            {Object.keys(headings).length > 0 && (
              <div className='bg-white rounded-xl shadow-lg border border-slate-200/60 p-6'>
                <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  Categories
                </h3>
                <div className='space-y-3'>
                  {Object.entries(headings).map(([key, value], idx) => (
                    <div
                      className='flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors'
                      key={idx}>
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-full shadow-sm",
                          value.bgColor
                        )}></div>
                      <span className='text-sm font-medium text-slate-700'>
                        {value.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
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
  headingColor?: string;
  titleColor?: string;
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
        "font-medium px-2 py-1 text-xs truncate hover:shadow-md transition-shadow",
        headingColor || "bg-slate-400",
        titleColor || "text-white",
        startAndEndDateAreSame && "mx-2 rounded-lg",
        startSame && "ml-2 rounded-tl-lg rounded-bl-lg",
        endSame && "mr-2 rounded-tr-lg rounded-br-lg"
      )}
      title={event.title}>
      {event.title.length >= 8 ? `${event.title.slice(0, 8)}...` : event.title}
    </div>
  );
});

export default Calendar;
