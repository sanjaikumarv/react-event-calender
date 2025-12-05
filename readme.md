# React Calendar Components

A beautiful, customizable React calendar component library with month and year filters built with TypeScript and Tailwind CSS.

## Features

- 📅 Full-featured calendar component
- 🎨 Highly customizable styling
- 📱 Responsive design
- 🎯 TypeScript support
- 🔧 Month and year filter components
- 📊 Event display support
- 🎨 Custom color themes

## Installation

\`\`\`bash
npm i simple-event-calendar-react

# or

yarn add simple-event-calendar-react

# or

pnpm add simple-event-calendar-react  
\`\`\`

**Important:** You need to setup tailwindcss in your project

## Usage

\`\`\`tsx
import { Calendar } from "simple-event-calendar-react";
import { useState } from "react";

function App() {
const [selectedDate, setSelectedDate] = useState("2024-01-15");

const events = [
{
title: "Meeting",
startDate: "2024-01-15",
endDate: "2024-01-15",
},
];

return (
<Calendar
selectedDate={selectedDate}
onDateClick={setSelectedDate}
headings={["Work Events"]}
headingColors={[{ bgColor: "bg-blue-500", titleColor: "text-white" }]}
data={[events]}
yearFilters={[2023, 2024, 2025]}
bgColors={{
        calendarHeadingColor:
          "bg-gradient-to-r from-blue-600 to-indigo-600",
        selectedDateBorderColor: "ring-2 ring-blue-600",
        selectedDateBgColor: "bg-blue-600",
      }}
/>
);
}
\`\`\`

## Components

### Calendar

Main calendar component with full functionality.

**Props:**

- `onDateClick: (date: string) => void` - Callback when a date is clicked
- `selectedDate: string` - Currently selected date in YYYY-MM-DD format
- `headings?: string[]` - Event category labels
- `headingColors?: { bgColor: string; titleColor?: string }[]` - Colors for event categories
- `data: EventGroups` - Event data arrays
- `yearFilters?: number[]` - Available years for filtering
- `bgColors?: { calendarHeadingColor?: string; selectedDateBorderColor?: string; selectedDateBgColor?: string }` - Custom color configuration

### MonthFilter

Dropdown component for month selection.

**Props:**

- `label: string` - Filter label
- `state: number` - Current month index (0-11)
- `setState: (month: number) => void` - Month change callback
- `data: string[]` - Month names array

### YearFilter

Dropdown component for year selection.

**Props:**

- `label: string` - Filter label
- `state: number` - Current year
- `setState: (year: number) => void` - Year change callback
- `data: number[]` - Available years array

## Dependencies

- React >= 19.1.1
- date-fns = 4.1.0
- clsx = 2.1.1
- Tailwind CSS (for styling)

## License

MIT
</merged_code>
