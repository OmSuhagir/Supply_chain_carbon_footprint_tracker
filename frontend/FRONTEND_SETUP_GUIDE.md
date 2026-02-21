# CarbonChain Pro - Complete Frontend Guide

## Overview

CarbonChain Pro Frontend is a modern, enterprise-grade React dashboard built with Vite, Tailwind CSS, and Recharts. It provides real-time supply chain carbon footprint tracking with net-zero alignment monitoring.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with branding
│   │   ├── Dashboard.jsx           # Main dashboard component
│   │   ├── SummaryCard.jsx         # Metric cards
│   │   ├── EmissionsBarChart.jsx   # Stage emissions visualization
│   │   ├── EmissionPieChart.jsx    # Breakdown pie chart
│   │   ├── ForecastTrend.jsx       # Emission trend forecast
│   │   └── OptimizationPanel.jsx   # Recommendations & tradeoffs
│   ├── pages/
│   │   ├── AddProductPage.jsx      # Create new product
│   │   └── AddSupplyChainNodePage.jsx # Add supply chain stages
│   ├── services/
│   │   └── api.js                  # API client & endpoints
│   ├── utils/
│   │   └── formatting.js           # Utility functions
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   ├── App.css                     # App styles
│   └── index.css                   # Global styles
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies

```

## Prerequisites

- Node.js >= 16.x
- npm or yarn
- Backend server running on `http://localhost:5000`
- MongoDB Atlas or local MongoDB

## Installation

### 1. Install Dependencies

Navigate to the frontend directory and install all required packages:

```bash
cd frontend
npm install
```

This will install:
- **React 19** - UI library
- **Vite 6** - Build tool & dev server
- **Tailwind CSS 3** - Styling framework
- **Recharts 2** - Data visualization
- **Axios** - HTTP client
- **PostCSS & Autoprefixer** - CSS processing

### 2. Configure Backend Connection

By default, the frontend connects to the backend at `http://localhost:5000`. 

To change this, edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Change if needed
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Key Features

### 1. **Dashboard Page**

Displays comprehensive emissions analysis:

- **5 Summary Cards:**
  - Total Emissions
  - Highest Emission Stage
  - Carbon Efficiency Score (0-100)
  - Cost Efficiency Score (0-100)
  - Net-Zero Alignment %

- **Emissions by Stage** (Bar Chart):
  - Shows emission values per supply chain stage
  - Numeric values displayed on top of bars
  - Stage ranking list with percentages
  - Highlights highest emission stage

- **Emission Breakdown** (Pie Chart):
  - Percentage distribution by stage
  - Color-coded segments
  - Legend with exact values

- **Forecast Trend** (Area Chart):
  - Past 6 months actual data (solid line)
  - Next 6 months forecast (dotted line)
  - Net-zero target reference line
  - Projected year-end emission

- **Optimization Recommendations:**
  - Carbon savings (tCO2e)
  - Cost impact ($)
  - Time tradeoff (days)
  - Risk assessment (low/medium/high)
  - Implementation guide

### 2. **Product Management**

- Create new products with yearly net-zero targets
- Select between created products
- Product details and specifications

### 3. **Supply Chain Nodes**

- Add supply chain stages (Raw Materials, Manufacturing, Logistics, Packaging, Distribution, End-of-Life)
- Specify transport mode (truck, rail, ship, air)
- Set distance and energy source
- Define cost and time data

### 4. **Emission Analysis**

- Run comprehensive analysis on supply chains
- Calculate emissions per stage
- Generate optimization recommendations
- Track net-zero alignment progress

## API Integration

### Available Endpoints

All endpoints are called through the `api.js` service:

#### Companies
- `POST /companies` - Create company
- `GET /companies` - Get all companies
- `GET /companies/:id` - Get specific company

#### Products
- `POST /products` - Create product
- `GET /products/company/:companyId` - Get products by company
- `GET /products/:id` - Get specific product

#### Supply Chain
- `POST /supply-chain/nodes` - Add node
- `GET /supply-chain/product/:productId` - Get nodes by product
- `PUT /supply-chain/nodes/:nodeId` - Update node

#### Analysis
- `POST /analysis/:productId` - Run analysis
- `GET /analysis/:productId` - Get latest result
- `GET /analysis/history/:productId` - Get history

#### Optimization
- `GET /optimization/product/:productId` - Get recommendations
- `POST /optimization` - Create optimization insight

#### Net-Zero Progress
- `GET /netzero-progress/product/:productId` - Get progress history
- `POST /netzero-progress` - Record progress

## Color Scheme

All colors are defined in `tailwind.config.js`:

```
Primary Dark:      #0B1120
Dark Background:   #0F172A
Card Background:   #111827
Accent Emerald:    #10B981 (Primary)
Accent Teal:       #14B8A6 (Secondary)
Warning Amber:     #F59E0B
Danger Red:        #EF4444
Success Green:     #22C55E
Text Primary:      #F9FAFB
Text Secondary:    #94A3B8
Border:            #1F2937
```

## Styling & Components

### Utility Classes

The application uses custom Tailwind classes:

- `.card-base` - Base card styling
- `.card-hover` - Card with hover effects
- `.badge-success`, `.badge-warning`, `.badge-danger` - Status badges
- `.hover-lift` - Hover scale effect
- `.text-gradient` - Gradient text effect

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- All charts are responsive
- Navigation adapts to screen size

## Data Formatting

Utility functions in `src/utils/formatting.js`:

```javascript
formatNumber(num, decimals)           // Format with commas
formatEmission(emission)               // Convert kg to tCO2e with unit
formatCurrency(amount, currency)       // Format as currency
getAlignmentColor(alignment)           // Get color based on %
getEfficiencyCategory(score)           // Get efficiency label
calculatePercentageChange(current, target) // Calculate %
getDaysBetweenDates()                  // Calculate time difference
```

## Error Handling

### Backend Connection Errors

If the backend is not running:
- Frontend operates in **Demo Mode**
- A status indicator shows "Demo Mode" instead of "Connected"
- Data won't be saved to database
- Useful for UI testing

### API Error Handling

All API calls include try-catch blocks:

```javascript
try {
  const response = await apiClient.get('/products');
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error gracefully
}
```

## Building for Production

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Generated files go to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Linting

Check code quality:

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file if needed:

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CarbonChain Pro
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Performance Optimizations

1. **Code Splitting** - Each component is modular
2. **Lazy Loading** - Components load on demand
3. **Image Optimization** - SVG icons for fast loading
4. **CSS Purging** - Tailwind removes unused styles
5. **Memoization** - React.memo for expensive components
6. **Chart Optimization** - Recharts ResponsiveContainer

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest version
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Backend Not Connecting

1. Ensure backend is running on port 5000
2. Check CORS is enabled in backend
3. Check API_BASE_URL in `src/services/api.js`

### Charts Not Displaying

1. Ensure Recharts is installed: `npm install recharts`
2. Check browser console for errors
3. Verify data structure matches expected format

### Styling Issues

1. Clear browser cache
2. Restart dev server
3. Check Tailwind config is correct
4. Verify PostCSS plugins are installed

### Error: "Cannot find module 'recharts'"

```bash
npm install recharts
```

### Port 5173 Already in Use

```bash
npm run dev -- --port 3000
```

## Development Workflow

1. Start backend server
2. Start frontend dev server
3. Open browser to `http://localhost:5173`
4. Create product → Add nodes → Run analysis
5. View dashboard with real-time data

## Testing Workflow

### Demo Data

1. Frontend auto-creates a demo company
2. Create a product with net-zero target
3. Add 3-4 supply chain nodes with different stages
4. Click "Run Analysis"
5. View dashboard with visualizations

### Sample Scenario

```
Company: Demo Sustainable Corp
Product: Eco-Friendly Shoe
Net-Zero Target: 50,000 kg CO2

Nodes:
1. Raw Materials (Supplier: Eco Materials Ltd)
   - Distance: 2,000 km (Ship)
   - Emission: ~40 tCO2e

2. Manufacturing (Factory: Green Manufacturing)
   - Distance: 500 km (Truck)
   - Emission: ~60 tCO2e

3. Distribution (Warehouse: Central Hub)
   - Distance: 1,000 km (Rail)
   - Emission: ~40 tCO2e
```

## Integration with Backend & Python

### Full Stack Flow

1. **Frontend** → User adds product & nodes
2. **Frontend** → User clicks "Run Analysis"
3. **API Call** → POST /analysis/:productId to Node.js backend
4. **Node.js** → Backend fetches nodes from MongoDB
5. **Node.js** → Calls Python FastAPI at http://localhost:8000/calculate
6. **Python** → Calculates emissions using emission_factors.json
7. **Python** → Returns calculations to Node.js
8. **Node.js** → Saves results to MongoDB
9. **Node.js** → Returns results to frontend
10. **Frontend** → Displays dashboard with analytics

### Data Flow Diagram

```
React Frontend
    ↓
(Axios HTTP Calls)
    ↓
Node.js Backend (Express)
    ↓
(Internal API Calls)
    ↓
Python Computation Engine (FastAPI)
    ↓
(Emission Calculations)
    ↓
MongoDB Database
    ↓
Back to Frontend (Charts & Analysis)
```

## File Size & Performance

### Bundle Size

- Main app: ~150KB (minified + gzipped)
- React 19: ~42KB
- Recharts: ~65KB
- Tailwind CSS: ~20KB
- Other dependencies: ~23KB

### Initial Load Time

- ~1-2 seconds on 4G
- ~500ms on broadband

## Future Enhancements

1. **Dark/Light Mode Toggle**
2. **Export Report as PDF**
3. **Supplier Performance Scoring**
4. **Real-time Collaboration**
5. **Mobile App**
6. **Advanced Filtering & Search**
7. **WebSocket for Live Updates**
8. **User Authentication**
9. **Audit Trail**
10. **Carbon Offset Marketplace Integration**

## Support & Debugging

- Check browser console for errors: `F12` or `Cmd+Option+I`
- Check network tab for API calls
- Verify backend logs for server errors
- Check Python computation engine logs

## License

MIT License - See LICENSE file in project root

---

**CarbonChain Pro** - Helping companies balance sustainability, cost efficiency, and business continuity while achieving net-zero commitments.
