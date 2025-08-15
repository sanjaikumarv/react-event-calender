"use client"

import { eachDayOfInterval, format, getDay, getMonth, isToday, getYear, isValid, parseISO } from "date-fns"
import { useState } from "react"
import MonthFilter from "./MonthFilter"
import YearFilter from "./YearFilter"

export type EventItem = {
    title: string
    startDate: string
    endDate: string
}

export type EventGroups = EventItem[][]

// Weekdays & Months constants
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
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
]

function getCurrentData(data: EventItem[], date: string) {
    return data?.find((e) => {
        const slicedStartDate = e?.startDate?.slice(0, 10)
        const slicedEndDate = e?.endDate?.slice(0, 10)
        return date >= slicedStartDate && date <= slicedEndDate
    })
}

function parseDate(dateString: string): Date {
    const parsed = parseISO(dateString)
    return isValid(parsed) ? parsed : new Date()
}

export default function Calendar({
    onDateClick,
    selectedDate,
    headings = [],
    headingColors = [],
    datas = [],
    yearFilters = [],
    bgColors = {
        calendarHeadingColor: "",
        selectedDateBorderColor: "",
        selectedDateBgColor: "",
    },
}: {
    onDateClick: (date: string) => void
    selectedDate: string
    headings?: string[]
    headingColors?: string[]
    datas?: EventGroups
    yearFilters?: number[]
    bgColors?: {
        calendarHeadingColor: string
        selectedDateBorderColor: string
        selectedDateBgColor: string
    }
}) {
    const yearFilterData =
        yearFilters.length > 0
            ? yearFilters
            : [new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2]
    const [month, setMonth] = useState(getMonth(new Date()))
    const [year, setYear] = useState(getYear(new Date()))

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const daysInMonth = eachDayOfInterval({
        start: firstDayOfMonth,
        end: lastDayOfMonth,
    })

    const startingDayIndex = getDay(firstDayOfMonth)

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 p-6 min-h-screen">
            <div className="xl:col-span-3">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200/60 overflow-hidden">
                    <div
                        className={`${bgColors?.calendarHeadingColor || "bg-gradient-to-r from-blue-600 to-indigo-600"} text-white p-6`}
                    >
                        {headings.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-6 mb-6">
                                {headings.map((h, idx) => (
                                    <div className="flex items-center gap-2" key={h}>
                                        <div className={`${headingColors?.[idx] || "bg-white/30"} rounded-full w-3 h-3`}></div>
                                        <span className="text-md font-medium text-white/90">{h}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <h1 className="text-2xl font-bold">
                                {months[month]} {year}
                            </h1>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                                    onClick={() => {
                                        setMonth(getMonth(new Date()))
                                        setYear(getYear(new Date()))
                                        onDateClick(format(new Date(), "yyyy-MM-dd"))
                                    }}
                                >
                                    Today
                                </button>
                                <MonthFilter label="Month" state={month} setState={setMonth} data={months} />
                                <YearFilter label="Year" state={year} setState={setYear} data={yearFilterData} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-7 mb-2">
                            {WEEKDAYS.map((day) => (
                                <div
                                    key={day}
                                    className="text-center py-3 text-sm font-semibold text-slate-600 uppercase tracking-wide"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 bg-slate-100 p-1 rounded-xl">
                            {Array.from({ length: startingDayIndex }).map((_, index) => (
                                <div key={`empty-${index}`} className="aspect-square" />
                            ))}

                            {daysInMonth.map((day, index) => (
                                <div
                                    onClick={() => onDateClick(format(day, "yyyy-MM-dd"))}
                                    key={index}
                                    className={`
                    aspect-square bg-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 p-2 flex flex-col
                    ${selectedDate === format(day, "yyyy-MM-dd")
                                            ? `${bgColors.selectedDateBorderColor || "ring-2 ring-blue-600"} bg-blue-50 shadow-lg`
                                            : "hover:bg-slate-50"
                                        }
                  `}
                                >
                                    <span
                                        className={`
                    text-sm font-medium mb-1 flex-shrink-0
                    ${isToday(day)
                                                ? `${bgColors.selectedDateBgColor || "bg-blue-600"} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`
                                                : "text-slate-700"
                                            }
                  `}
                                    >
                                        {format(day, "d")}
                                    </span>

                                    <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                                        {Array.isArray(datas) &&
                                            datas.map((data, idx) => (
                                                <DisplayCurrentData
                                                    key={idx}
                                                    data={data}
                                                    headingColors={headingColors[idx] || "bg-slate-400"}
                                                    date={format(day, "yyyy-MM-dd")}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className={`w-2 h-2 ${bgColors.selectedDateBorderColor || "bg-blue-500"} rounded-full`}></div>
                        Selected Date
                    </h3>
                    <p className="text-slate-600 font-medium bg-slate-50 rounded-lg px-3 py-2">
                        {format(parseDate(selectedDate), "EEEE, MMMM d, yyyy")}
                    </p>
                </div>

                {headings.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Event Categories
                        </h3>
                        <div className="space-y-3">
                            {headings.map((heading, idx) => (
                                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors" key={idx}>
                                    <div className={`w-4 h-4 ${headingColors[idx]} rounded-full shadow-sm`}></div>
                                    <span className="text-sm font-medium text-slate-700">{heading}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function DisplayCurrentData({
    data,
    headingColors,
    rootStyle,
    date,
}: {
    data: EventItem[]
    headingColors: string
    rootStyle?: string
    date: string
}) {
    const currentEvent = getCurrentData(data, date)

    if (!currentEvent?.title) {
        return null
    }

    return (
        <div
            className={`
        ${headingColors} ${rootStyle || ""} 
        text-white text-xs px-2 py-1 rounded-md shadow-sm
        font-medium truncate hover:shadow-md transition-shadow
      `}
            title={currentEvent.title}
        >
            {currentEvent.title.length >= 8 ? `${currentEvent.title.slice(0, 8)}...` : currentEvent.title}
        </div>
    )
}
