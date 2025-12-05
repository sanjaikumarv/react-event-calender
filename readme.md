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

```bash
npm i simple-event-calendar-react

# or

yarn add simple-event-calendar-react

# or

pnpm add simple-event-calendar-react
```

**Important:** You need to setup tailwindcss in your project

## Usage

## Nested Array

```tsx
import { Calendar } from "simple-event-calendar-react";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");

  const events = [
    {
      title: "Meeting",
      startDate: "2025-12-06",
      endDate: "2025-12-06",
    },
  ];

  return (
    <Calendar
      selectedDate={selectedDate}
      onDateClick={setSelectedDate}
      headings={{
        Events: {
          bgColor: "bg-blue-500",
          titleColor: "text-white",
          title: "Event",
        },
      }}
      data={[events]}
      yearFilters={[2023, 2024, 2025]}
    />
  );
}
```

## Array of object

```tsx
import { Calendar } from "simple-event-calendar-react";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState("2024-01-15");

  const data = [
    {
      title: "Meeting",
      type: "Event",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
    },
  ];

  return (
    <Calendar
      selectedDate={selectedDate}
      onDateClick={setSelectedDate}
      dataType='ARRAY'
      headings={{
        Event: {
          bgColor: "bg-blue-500",
          titleColor: "text-white",
          title: "Event",
        },
      }}
      data={data}
      yearFilters={[2023, 2024, 2025]}
    />
  );
}
```

## Components

### Calendar

Main calendar component with full functionality.

**Props:**

- `onDateClick: (date: string) => void` - Callback when a date is clicked
- `selectedDate: string` - Currently selected date in YYYY-MM-DD format
- `headings?: { [key: string]: Heading }` - Event category labels
- `dataType?: "NESTED_ARRAY" | "ARRAY"` - Data type
- `data: EventGroups | EventItem[]` - Event data arrays
- `yearFilters?: number[]` - Available years for filtering
- `styles?: { calendarHeadingBgColor?: string; selectedDateBgColor?: string; border?: string; layout?: string; height?: string; width?: string }` - Custom color configuration
- `buttonStyle?: string` - Custom button style
- `monthFilterInputStyle?: string` - Custom month filter input style
- `yearFilterInputStyle?: string` - Custom year filter input style
- `scheduledEvents?: boolean` - Show scheduled events
- `categories?: boolean` - Show categories

### MonthFilter

Dropdown component for month selection.

### YearFilter

Dropdown component for year selection.

## Dependencies

- React >= 19.1.1
- date-fns = 4.1.0
- clsx = 2.1.1
- Tailwind CSS (for styling)

## License

MIT
</merged_code>
