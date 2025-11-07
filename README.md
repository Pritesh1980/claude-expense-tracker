# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **Add Expenses**: Easily add new expenses with date, amount, category, and description
- **Edit Expenses**: Modify existing expenses with full validation
- **Delete Expenses**: Remove expenses with confirmation dialog
- **Data Persistence**: All data is saved to browser localStorage
- **Search & Filter**: Powerful filtering by date range, category, and search query
- **Export to CSV**: Download your expenses as a CSV file

### Dashboard Analytics
- **Total Spending**: View your all-time total spending
- **Monthly Spending**: Track spending for the current month
- **Top Category**: See which category you spend the most on
- **Category Breakdown**: Visual representation of spending by category with percentages
- **Expense Count**: Keep track of total number of expenses

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### User Experience
- Clean, modern design with professional color scheme
- Fully responsive layout (works on desktop, tablet, and mobile)
- Form validation with helpful error messages
- Loading states and visual feedback
- Intuitive navigation between Dashboard and Expenses views
- Currency formatting in GBP (£)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Usage Guide

### Adding an Expense

1. Click the "Add Expense" button in the header
2. Fill in the expense details:
   - **Date**: Select when the expense occurred (cannot be in the future)
   - **Amount**: Enter the amount in GBP (must be positive)
   - **Category**: Choose from the available categories
   - **Description**: Describe the expense (max 200 characters)
3. Click "Add Expense" to save

### Viewing the Dashboard

1. Click the "Dashboard" tab
2. View summary cards showing:
   - Total spending across all time
   - Current month's spending
   - Your top spending category
   - Total number of expenses
3. Review the category breakdown chart showing spending distribution

### Managing Expenses

1. Click the "All Expenses" tab
2. Use the filters to find specific expenses:
   - Search by description
   - Filter by category
   - Filter by date range
3. Click "Edit" to modify an expense
4. Click "Delete" to remove an expense (requires confirmation)

### Exporting Data

1. Click the "Export CSV" button in the header
2. The CSV file will automatically download
3. Open in Excel, Google Sheets, or any spreadsheet application

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── Dashboard.tsx     # Dashboard view
│   ├── ExpenseForm.tsx   # Expense form with validation
│   └── ExpenseList.tsx   # Expense list with filters
├── lib/
│   └── storage.ts        # localStorage utilities
├── types/
│   └── expense.ts        # TypeScript type definitions
├── utils/
│   ├── calculations.ts   # Spending calculations
│   ├── currency.ts       # Currency formatting
│   ├── export.ts         # CSV export functionality
│   └── validation.ts     # Form validation
└── package.json
```

## Features in Detail

### Form Validation
- Date cannot be in the future
- Amount must be positive and reasonable
- Description is required and limited to 200 characters
- All fields are validated with helpful error messages

### Data Persistence
- All expenses are automatically saved to browser localStorage
- Data persists across browser sessions
- No backend or database required

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface on mobile devices

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Known Limitations

- Data is stored in browser localStorage (clearing browser data will delete expenses)
- No cloud sync or backup functionality
- No user authentication or multi-user support
- Currency is fixed to GBP

## Future Enhancements

Potential features for future versions:
- Multiple currency support
- Cloud backup and sync
- Budget goals and alerts
- Recurring expenses
- Receipt photo attachments
- Advanced charts and reports
- Dark mode support
- Mobile app versions

## License

This project is open source and available for personal use.

## Support

For issues or questions, please check the documentation or create an issue in the project repository.
