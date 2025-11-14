# 💰 Expense Tracker AI

A modern, full-featured expense tracking application built with Next.js, TypeScript, and Tailwind CSS. This project showcases three completely different implementations of data export functionality, demonstrating various approaches to solving the same problem.

[![Tests](https://img.shields.io/badge/tests-43%20passing-brightgreen)](https://github.com/yourusername/expense-tracker-ai)
[![Coverage](https://img.shields.io/badge/coverage-100%25%20utilities-brightgreen)](https://github.com/yourusername/expense-tracker-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)

## ✨ Features

### Core Functionality
- 📝 **Expense Management** - Add, edit, and delete expenses with ease
- 📊 **Dashboard Analytics** - Visual spending summaries and category breakdowns
- 🔍 **Smart Filtering** - Filter expenses by date, category, and search terms
- 💷 **Currency Support** - GBP formatting with proper localization
- ✅ **Form Validation** - Comprehensive client-side validation with helpful error messages

### Three Export Implementations
This project uniquely demonstrates **three completely different approaches** to implementing data export:

#### 🚀 Version 1: Simple & Functional
**Branch:** `feature-data-export-v1`
- Single button CSV export
- Minimal UI, maximum simplicity
- ~40 lines of code
- Perfect for MVPs

#### 🎨 Version 2: Advanced Professional
**Branch:** `feature-data-export-v2`
- Beautiful modal interface
- Multiple formats (CSV, JSON, PDF)
- Advanced filtering (date range, categories)
- Data preview before export
- Custom filenames
- ~500 lines of sophisticated code

#### ☁️ Version 3: Cloud SaaS Platform
**Branch:** `feature-data-export-v3` ⭐ **Current**
- Complete export hub with 5 tabs
- Cloud integrations (Google Sheets, Dropbox, etc.)
- Shareable links with QR codes
- Export history tracking
- Automated scheduling
- Modern gradient UI with animations
- ~900 lines of platform-level code

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/expense-tracker-ai.git
cd expense-tracker-ai

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production server
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏗️ Project Structure

```
expense-tracker-ai/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Dashboard.tsx      # Analytics dashboard
│   ├── ExpenseForm.tsx    # Expense input form
│   ├── ExpenseList.tsx    # Expense list with filtering
│   ├── ExportHub.tsx      # Cloud export hub (V3)
│   └── ui/                # Reusable UI components
├── utils/                 # Utility functions
│   ├── calculations.ts    # Spending calculations
│   ├── currency.ts        # Currency formatting
│   ├── validation.ts      # Form validation
│   └── export.ts          # Export utilities
├── types/                 # TypeScript type definitions
│   └── expense.ts         # Expense types
├── __tests__/             # Test files
│   └── utils/             # Utility tests
└── public/                # Static assets
```

## 🧪 Testing

This project includes a comprehensive test suite with **100% coverage** on utility functions.

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage
- ✅ Currency utilities: 13 tests
- ✅ Calculation utilities: 11 tests
- ✅ Validation utilities: 19 tests
- **Total: 43 passing tests**

See [TESTING.md](TESTING.md) for detailed testing documentation.

## 🌿 Branches

This repository contains multiple feature branches showcasing different implementations:

| Branch | Description | Lines of Code | Complexity |
|--------|-------------|---------------|------------|
| `master` | Base application | - | Base |
| `feature-data-export-v1` | Simple CSV export | ~40 | Low |
| `feature-data-export-v2` | Advanced modal export | ~500 | Medium |
| `feature-data-export-v3` | Cloud export platform | ~900 | High |

### Exploring Different Versions

```bash
# Switch to simple version
git checkout feature-data-export-v1

# Switch to advanced version
git checkout feature-data-export-v2

# Switch to cloud version
git checkout feature-data-export-v3
```

## 🎨 Tech Stack

### Frontend
- **Next.js 14.2** - React framework with App Router
- **React 18.3** - UI library
- **TypeScript 5.6** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling

### Utilities & Libraries
- **date-fns** - Date manipulation
- **qrcode.react** - QR code generation
- **jsPDF** - PDF generation (V2)

### Testing
- **Jest 30.2** - Test framework
- **React Testing Library** - Component testing
- **@testing-library/jest-dom** - DOM matchers

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📊 Features by Version

| Feature | V1 | V2 | V3 |
|---------|----|----|-------|
| CSV Export | ✅ | ✅ | ✅ |
| JSON Export | ❌ | ✅ | ✅ |
| PDF Export | ❌ | ✅ | ✅ |
| Date Filtering | ❌ | ✅ | ✅ |
| Category Filtering | ❌ | ✅ | ✅ |
| Data Preview | ❌ | ✅ | ✅ |
| Custom Filename | ❌ | ✅ | ✅ |
| Export Templates | ❌ | ❌ | ✅ |
| Cloud Integration | ❌ | ❌ | ✅ |
| Shareable Links | ❌ | ❌ | ✅ |
| QR Codes | ❌ | ❌ | ✅ |
| Export History | ❌ | ❌ | ✅ |
| Scheduling | ❌ | ❌ | ✅ |

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add any environment variables here
# Example:
# NEXT_PUBLIC_API_URL=https://api.example.com
```

### Customization
- Currency format: Edit `utils/currency.ts`
- Expense categories: Edit `types/expense.ts`
- Styling: Modify Tailwind classes in components

## 📈 Performance

- ⚡ **Fast Development** - Hot reload with Next.js
- 🎯 **Optimized Build** - Automatic code splitting
- 📦 **Small Bundle** - Tree-shaking and optimization
- 🚀 **Static Generation** - Pre-rendered pages for speed

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Testing with [Jest](https://jestjs.io/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🗺️ Roadmap

### Planned Features
- [ ] User authentication
- [ ] Multi-currency support
- [ ] Receipt photo upload
- [ ] Recurring expenses
- [ ] Budget tracking
- [ ] Mobile app (React Native)
- [ ] API endpoints
- [ ] Database integration
- [ ] Real cloud service integrations

### Testing Improvements
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests with Playwright
- [ ] Visual regression testing

---

**Built with ❤️ using Claude Code**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
