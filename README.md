# Expense Tracker

A modern, professional expense tracking application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Add, edit, and delete expenses with date, amount, category, and description
- View expenses in a clean, organized list
- Filter expenses by date range, category, and search query
- Dashboard with spending summaries and analytics
- Category-based expense visualization with charts
- Export expenses to CSV
- Responsive design for desktop and mobile
- Dark mode support

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hooks for state management
- Chart.js for data visualization
- localStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard

The dashboard provides an overview of your expenses with:

- Total spending
- Monthly spending
- Top spending category
- Category breakdown chart
- Recent expenses list

### Managing Expenses

1. **Adding Expenses**: Use the form at the top of the Expenses page to add new expenses
2. **Editing Expenses**: Click the "Edit" button on any expense in the list
3. **Deleting Expenses**: Click the "Delete" button on any expense in the list

### Filtering and Searching

1. Use the search box to find expenses by description or category
2. Click "Show Filters" to access advanced filtering options:
   - Filter by category
   - Filter by date range
3. Click "Reset" to clear all filters

### Exporting Data

Click the "Export to CSV" button on the Expenses page to download your expense data as a CSV file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
