# CarbonChain Pro - Supply Chain Carbon Footprint & Net-Zero Tracker

🌍 **AI-Powered Real-Time Supply Chain Carbon & Net-Zero Tracker**

A comprehensive hackathon-winning platform that helps companies track, analyze, and optimize their supply chain emissions while achieving net-zero commitments.

## Quick Links

- 📖 [Complete Integration Guide](./COMPLETE_INTEGRATION_GUIDE.md)
- 🤖 [Gemini AI Setup](./GEMINI_SETUP_GUIDE.md) ⭐ **Required for AI recommendations**
- 🎨 [Frontend Setup Guide](./frontend/FRONTEND_SETUP_GUIDE.md)
- 🔧 [Backend README](./backend/README.md)
- 🐍 [Python Engine Docs](./backend/emission_engine/README.md)
- 💡 [Gemini AI Integration Details](./GEMINI_AI_INTEGRATION.md)

## 🎯 What Makes CarbonChain Pro Different

### The Problem
70% of a product's carbon emissions occur in the supply chain (Scope 3 emissions). Companies struggle with:
- ❌ No real-time tracking
- ❌ No audit-ready emission reports
- ❌ No optimization insights
- ❌ No cost-carbon tradeoff analysis
- ❌ No clear net-zero progress visibility

### Our Solution

CarbonChain Pro stands out because it does **MORE than just calculate carbon**:

1. **🌱 Carbon Tracking** - Real-time supply chain emissions per stage
2. **💰 Cost-Carbon Tradeoffs** - See financial impact of sustainability choices
3. **⏰ Time-Delay Analysis** - Understand business risk of greener alternatives
4. **🎯 Net-Zero Target Tracking** - Dashboard shows yearly alignment progress
5. **🚨 Business Risk Scoring** - Know when optimization threatens deadlines
6. **📊 Carbon Efficiency Score** (0-100) - Benchmark against industry
7. **💼 Cost Efficiency Score** - Optimize spending
8. **⏱️ Time Efficiency Score** - Track delivery performance
9. **📋 Audit-Ready Reports** - ESG & compliance documentation
10. **💡 Smart Recommendations** - AI-powered optimization strategies

## 🏆 Key Features

### Dashboard Analytics
- **Total Emissions** - Real-time supply chain carbon footprint
- **Highest Emission Stage** - Identify biggest opportunities
- **Emissions by Stage** - Bar chart with numeric values per stage
- **Stage Ranking** - See which nodes contribute most
- **Emission Breakdown** - Pie chart distribution
- **Forecast Trend** - Projected year-end emissions
- **Optimization Recommendations** - Carbon/cost/time tradeoff analysis

### Supply Chain Mapping
- Raw Materials
- Manufacturing
- Logistics
- Packaging
- Distribution
- End-of-Life

### Transport Modes
- **Truck** (0.12 kg CO2/km) - Fast, high emission
- **Rail** (0.04 kg CO2/km) - Slower, lower emission
- **Ship** (0.02 kg CO2/km) - Slowest, lowest emission
- **Air** (0.6 kg CO2/km) - Fastest, highest emission

### Energy Sources
- Coal (0.9) - Highest emission
- Gas (0.5) - Medium emission
- Diesel/Petrol - Variable
- Solar (0.05) - Low emission
- Wind (0.02) - Lowest emission

## 📊 Technology Stack

### Frontend
- **React 19** - Modern UI library
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS 3** - Enterprise styling
- **Recharts 2** - Professional data visualization
- **Axios** - HTTP client for APIs

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM

### Computation Engine
- **Python 3** - Data processing
- **FastAPI** - High-performance API
- **Pandas** - Data analysis
- **NumPy** - Numerical computing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm
- Python 3.8+
- MongoDB (local or Atlas)

### Installation (5 minutes)

```bash
# 1. Clone or navigate to project
cd Supply_chain_carbon_footprint_tracker

# 2. Install & run all services (see COMPLETE_INTEGRATION_GUIDE.md)
# Terminal 1: Python Engine
cd backend/emission_engine
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Terminal 2: Backend
cd backend
npm install
npm start

# Terminal 3: Frontend
cd frontend
npm install
npm run dev

# Open browser: http://localhost:5173
```

For detailed setup, see [COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)

## 📝 Demo Workflow (2 minutes)

1. **Create Product**
   - Name: "Eco-Friendly Smartphone"
   - Net-Zero Target: 50,000 tCO2e/year

2. **Add Supply Chain Nodes** (3 nodes)
   - Raw Materials: Ship 2,000 km
   - Manufacturing: Truck 500 km
   - Distribution: Rail 1,000 km

3. **Run Analysis**
   - Click "Run Analysis" button
   - Wait 5-10 seconds for calculation

4. **View Dashboard**
   - See total emissions
   - Review by-stage breakdown
   - Check optimization recommendations
   - Analyze cost vs. carbon tradeoffs

## 🎨 Design Features

### Theme
- Dark SaaS aesthetic (Stripe/Vercel style)
- Premium enterprise feel
- Climate-tech visual identity

### Colors
- **Primary:** Emerald Green (#10B981)
- **Secondary:** Teal (#14B8A6)
- **Warning:** Amber (#F59E0B)
- **Danger:** Red (#EF4444)
- **Success:** Green (#22C55E)

### Responsive
- Desktop-first design
- Mobile-friendly
- Tablet optimized
- All charts responsive

## 📊 Data Model

### Companies
- Organization information
- Industry & location
- Sustainability goals

### Products
- Product name & description
- Yearly net-zero target (tCO2e)
- Current year total emission

### Supply Chain Nodes
- Stage name
- Supplier information
- Transport mode & distance
- Energy source
- Cost & time data
- Calculated emission

### Emission Results
- Total emission per product
- Highest emission stage
- Three efficiency scores (carbon, cost, time)
- Net-zero alignment percentage

### Optimization Insights
- Recommended transport alternative
- Carbon savings potential
- Cost impact
- Time tradeoff
- Risk level

### Net-Zero Progress
- Year-by-year tracking
- Alignment to targets
- Historical progress

## 🔄 Data Flow

```
User Input (Frontend)
    ↓ (HTTP/Axios)
Node.js Backend
    ↓ (REST API)
Python Engine
    ↓ (Calculations)
MongoDB (Results)
    ↓ (Query)
Frontend (Visualizations)
```

## 📈 Dashboard Metrics

### Summary Cards
- **Total Emissions:** Sum of all node emissions
- **Highest Stage:** Name of stage with most carbon
- **Carbon Efficiency Score:** (0-100) - Benchmark emission
- **Cost Efficiency Score:** (0-100) - Cost optimization
- **Net-Zero Alignment:** % progress toward yearly target

### Color Coding (Net-Zero Alignment)
- 🟢 **GREEN (>80%):** ON TRACK
- 🟡 **AMBER (50-80%):** AT RISK
- 🔴 **RED (<50%):** CRITICAL

## 💡 Optimization Recommendations

Each recommendation shows:
1. **Carbon Savings** - kg CO2e reduced
2. **Cost Impact** - $ saved or lost
3. **Time Tradeoff** - Days faster or slower
4. **Risk Level** - Low/Medium/High
5. **Implementation Guide** - How to execute

Example:
```
Current:  Truck → 500 km → 60 tCO2e → $2500 → 3 days
Suggested: Rail → 500 km → 20 tCO2e → $1500 → 5 days
═════════════════════════════════════════════════════════
Carbon:   -40 tCO2e (67% reduction) ✅
Cost:     -$1000 (40% savings) ✅
Time:     +2 days (business risk) ⚠️
```

## 📄 Features Breakdown

### Phase 1: Core Analytics
- ✅ Supply chain mapping
- ✅ Emission calculation
- ✅ Stage-by-stage breakdown
- ✅ Net-zero alignment tracking

### Phase 2: Optimization
- ✅ Transport mode recommendations
- ✅ Cost vs. carbon analysis
- ✅ Time impact warnings
- ✅ Risk assessment

### Phase 3: Business Intelligence
- ✅ Efficiency scoring
- ✅ Benchmark comparison
- ✅ Trend analysis
- ✅ Forecast prediction

### Phase 4: Enterprise Features
- ⏳ Audit report generation
- ⏳ User authentication
- ⏳ Multi-company support
- ⏳ API for third-party integrations

## 🎯 Use Cases

### For Sustainability Officers
- Track company-wide carbon progress
- Identify biggest emission sources
- Report to board/investors
- ESG compliance documentation

### For Supply Chain Managers
- Optimize logistics routes
- Balance cost & carbon
- Manage supplier relationships
- Meet delivery timelines

### For R&D Teams
- Compare material alternatives
- Evaluate supplier sustainability
- Calculate product carbon footprint
- Design for net-zero

### For Finance
- Analyze sustainability ROI
- Track carbon offset costs
- Budget for green alternatives
- Report carbon cost to P&L

## 🔒 Data Security

- ✅ MongoDB secure connection
- ✅ Environment variables for secrets
- ✅ CORS enabled for API
- ✅ Input validation on all endpoints
- ⏳ JWT authentication (planned)
- ⏳ Role-based access control (planned)

## 📊 Emission Calculation Formula

```
Node Emission = (Distance × Transport Factor) + Energy Factor

Example:
Product → Truck 500km with Gas energy
= (500 × 0.12) + 0.5
= 60 + 0.5
= 60.5 kg CO2e

Total Emission = Sum of All Node Emissions
```

## 🚀 Performance

- **Frontend Load:** ~1-2 seconds (4G), ~500ms (Broadband)
- **Analysis Calculation:** 5-10 seconds
- **Database Queries:** <100ms average
- **Bundle Size:** ~150KB (minified + gzipped)

## 📱 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest 2 versions)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Development

### Local Development
```bash
npm run dev            # Frontend dev server
npm run dev:backend    # Backend with nodemon
npm run lint           # Check code quality
npm run build          # Production build
```

### Testing
```bash
# Create product with 3 nodes
# Run analysis
# Verify calculations
# Check UI responsiveness
```

## 🤝 API Endpoints

Complete API reference: [See Integration Guide](./COMPLETE_INTEGRATION_GUIDE.md#api-endpoints-reference)

### Key Endpoints
```
POST   /api/products              # Create product
GET    /api/products/:id          # Get product
POST   /api/supply-chain/nodes    # Add supply chain node
POST   /api/analysis/:productId   # Run emission analysis
GET    /api/analysis/:productId   # Get analysis results
GET    /api/optimization/:id      # Get recommendations
```

## 📚 Documentation

- [Complete Integration Guide](./COMPLETE_INTEGRATION_GUIDE.md) - Full setup & deployment
- [Frontend Guide](./frontend/FRONTEND_SETUP_GUIDE.md) - React app details
- [Backend README](./backend/README.md) - Node.js API
- [Python Engine README](./backend/emission_engine/README.md) - Computation

## 🐛 Troubleshooting

### Backend not connecting?
- Ensure backend runs on port 5000
- Check `src/services/api.js` for correct URL
- See [Integration Guide Troubleshooting](./COMPLETE_INTEGRATION_GUIDE.md#troubleshooting)

### Charts not showing?
- Add supply chain nodes before running analysis
- Check browser console for errors
- Restart frontend dev server

### Python module errors?
- Install dependencies: `pip install -r requirements.txt`
- Activate virtual environment first
- Ensure Python 3.8+ installed

## 🎓 Architecture Decision Rationale

### Why React?
- Fast rendering
- Component reusability
- Large ecosystem
- Beginner-friendly

### Why Tailwind CSS?
- Rapid UI development
- No style conflicts
- Responsive by default
- Easy customization

### Why Recharts?
- React-native components
- Responsive charts
- Easy integration
- Great documentation

### Why Vite?
- 10x faster than Webpack
- Modern ES modules
- Hot module replacement
- Production optimized

### Why Python for Computation?
- Scientific computing (NumPy, Pandas)
- Complex calculations
- Easy to maintain
- Separate microservice

## 🔮 Future Roadmap

### Coming Soon
- PDF audit report export
- Carbon offset marketplace
- Supplier performance scoring
- Real-time collaboration
- User authentication
- Mobile app

### Long Term
- Machine learning predictions
- 3D supply chain visualization
- IoT sensor integration
- Blockchain carbon credits
- AI chat assistant

## 📄 Licensing

MIT License - Open source for educational & commercial use

## 👥 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- **Issues:** Open GitHub issue
- **Questions:** Check documentation
- **Feedback:** Create discussion

## 🏆 Hackathon Tips

### For Demo
1. Pre-create sample data
2. Have network diagram printed
3. Explain cost-carbon tradeoff clearly
4. Show how optimization saves real money
5. Discuss ESG compliance angle

### Key Talking Points
- 70% of emissions in supply chain (Scope 3)
- Not just carbon—also cost and time
- Actionable recommendations
- Business-friendly design
- Audit-ready reports

### Judge Impression
- Modern, professional UI ✅
- Real-world problem solving ✅
- Business relevance ✅
- Technical sophistication ✅
- Innovation beyond typical carbon tracker ✅

## 📊 Expected Results (Sample Data)

```
Product: Eco Smartphone
Supply Chain: 3 nodes
Total Emission: 120 tCO2e
Highest Stage: Manufacturing (60 tCO2e)
Net-Zero Target: 100 tCO2e
Alignment: 80% (ON TRACK)

Recommendations:
1. Switch truck to rail: -40 tCO2e, -$500, +2 days
2. Use renewable energy: -20 tCO2e, +$1000, no time change
3. Localize supplier: -30 tCO2e, -$2000, faster delivery

ROI: 60 tCO2e reduction = $3000 annual value
```

---

## 🎉 Success Criteria

Your CarbonChain Pro is working when:

✅ Frontend loads at http://localhost:5173
✅ Backend responds to /api/health
✅ Can create product with net-zero target
✅ Can add 3+ supply chain nodes
✅ Can run analysis (5-10 sec)
✅ Dashboard displays all 5 summary cards
✅ Bar chart shows emissions per stage
✅ Recommendations appear with tradeoffs
✅ Net-zero alignment shows as % with color
✅ All charts are responsive & interactive

---

## 🙌 Thank You

Built with ❤️ for sustainability and business efficiency.

**CarbonChain Pro** - *Helping companies balance sustainability, cost efficiency, and business continuity while achieving net-zero commitments.*

---

## 📞 Quick Help

**Still stuck?** Follow this order:
1. Read [COMPLETE_INTEGRATION_GUIDE.md](./COMPLETE_INTEGRATION_GUIDE.md)
2. Check [Frontend Setup Guide](./frontend/FRONTEND_SETUP_GUIDE.md)
3. Review [Backend README](./backend/README.md)
4. Check browser console (F12)
5. Check backend/Python logs
6. Restart all services

**Everything configured correctly?** You're ready for demo! 🚀
