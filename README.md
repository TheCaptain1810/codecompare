# Code Complexity Analyzer

A web-based tool for comparing algorithm performance across different input sizes and visualizing time complexity patterns.

## Overview

Code Complexity Analyzer helps developers understand the practical implications of algorithmic complexity by allowing them to:

1. Compare multiple algorithm implementations side-by-side
2. Measure performance across various input sizes
3. Visualize execution time patterns using interactive charts
4. Get automated time complexity analysis

## Features

- **Algorithm Comparison**: Write and test multiple algorithm implementations simultaneously
- **Performance Benchmarking**: Measure execution time across customizable input sizes
- **Visual Analysis**: Interactive line charts showing runtime trends
- **Complexity Detection**: AI-powered analysis of algorithm time complexity
- **Modern UI**: Clean, responsive interface with light/dark mode support

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TheCaptain1810/codecompare.git
cd code-complexity-analyzer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the project root and add your Google AI API key:

```
NEXT_PUBLIC_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Write your algorithms in the code editors, ensuring each exports a function named 'algorithm' that accepts an array input
2. Enter comma-separated input sizes to test (e.g., 10,50,100,500,1000)
3. Click "Run Benchmark" to execute tests across all specified input sizes
4. View the results in the chart to compare performance patterns
5. Check the complexity analysis for insights about each algorithm's efficiency

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Recharts](https://recharts.org/) - Data visualization
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Google Gemini AI](https://ai.google.dev/) - Complexity analysis

## Project Structure

- `app/` - Next.js application pages and layout
- `components/` - Reusable UI components
- `lib/` - Utility functions and API integrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped build this tool
- Inspired by the need to visualize algorithm performance for educational purposes
