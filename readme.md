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
npm install @your-username/react-calendar-components
# or
yarn add @your-username/react-calendar-components
\`\`\`

**Important:** You must also import the required CSS file in your project:

\`\`\`tsx
// In your main App.tsx or index.tsx file
import '@your-username/react-calendar-components/src/styles.css'
\`\`\`

This CSS file contains the Tailwind configuration and design tokens needed for proper styling.

## Usage

\`\`\`tsx
import { Calendar, MonthFilter, YearFilter } from '@your-username/react-calendar-components'

function App() {
  const [selectedDate, setSelectedDate] = useState('2024-01-15')

  const events = [
    [
      {
        title: 'Meeting',
        startDate: '2024-01-15',
        endDate: '2024-01-15'
      }
    ]
  ]

  return (
    <Calendar
      selectedDate={selectedDate}
      onDateClick={setSelectedDate}
      headings={['Work Events']}
      headingColors={['bg-blue-500']}
      datas={events}
      yearFilters={[2023, 2024, 2025]}
      bgColors={{
        calendarHeadingColor: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        selectedDateBorderColor: 'ring-2 ring-blue-600',
        selectedDateBgColor: 'bg-blue-600'
      }}
    />
  )
}
\`\`\`

## Components

### Calendar

Main calendar component with full functionality.

**Props:**
- `onDateClick: (date: string) => void` - Callback when a date is clicked
- `selectedDate: string` - Currently selected date in YYYY-MM-DD format
- `headings?: string[]` - Event category labels
- `headingColors?: string[]` - Colors for event categories
- `datas?: EventGroups` - Event data arrays
- `yearFilters?: number[]` - Available years for filtering
- `bgColors?: object` - Custom color configuration

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

- React >= 16.8.0
- date-fns
- lucide-react
- Tailwind CSS (for styling)

## License

MIT
</merged_code>
