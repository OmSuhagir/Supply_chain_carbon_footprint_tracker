/**
 * CarbonChain Pro Frontend
 * Main Application Component with Company Login Flow
 */

import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import AddProductPage from './pages/AddProductPage';
import AddSupplyChainNodePage from './pages/AddSupplyChainNodePage';
import {
  getProductsByCompany,
  getSupplyChainNodes,
  runAnalysis,
  getAnalysisResult,
  getOptimizations,
  getGeminiOptimizations,
  regenerateGeminiOptimizations,
  healthCheck,
} from './services/api';
import './App.css';

const PAGES = {
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  ADD_PRODUCT: 'add_product',
  ADD_NODE: 'add_node',
};

function App() {
  // Company authentication
  const [loggedInCompany, setLoggedInCompany] = useState(null);

  // Page navigation
  const [currentPage, setCurrentPage] = useState(PAGES.LOGIN);

  // Products and nodes
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [supplyChainNodes, setSupplyChainNodes] = useState([]);

  // Analysis results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [optimizations, setOptimizations] = useState([]);
  const [geminiOptimizations, setGeminiOptimizations] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);

  /**
   * Initialize app - check backend health
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        const health = await healthCheck();
        setBackendConnected(true);
        console.log('✓ Backend connected:', health.message);
      } catch (err) {
        setBackendConnected(false);
        console.log('⚠ Backend not available');
      }
    };

    initialize();
  }, []);

  /**
   * Load company's products when company logs in
   */
  useEffect(() => {
    if (loggedInCompany) {
      loadCompanyProducts();
    }
  }, [loggedInCompany]);

  /**
   * Load supply chain nodes and analysis when product is selected
   */
  useEffect(() => {
    if (selectedProduct) {
      loadProductData();
      // Navigate to dashboard to show the loaded data
      setCurrentPage(PAGES.DASHBOARD);
    }
  }, [selectedProduct]);

  /**
   * Load all products for logged-in company
   */
  const loadCompanyProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProductsByCompany(loggedInCompany._id);
      setProducts(productsData.data || []);
      setSelectedProduct(null);
      setAnalysisResult(null);
      setOptimizations([]);
    } catch (err) {
      console.error('Error loading products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load nodes and analysis for selected product
   */
  const loadProductData = async () => {
    try {
      // Load nodes
      const nodesData = await getSupplyChainNodes(selectedProduct._id);
      setSupplyChainNodes(nodesData.data || []);

      // Load analysis results (will be null for new products)
      try {
        const analysisData = await getAnalysisResult(selectedProduct._id);
        setAnalysisResult(analysisData?.data || null);
      } catch (analyzeErr) {
        // No analysis exists yet - this is expected for new products
        setAnalysisResult(null);
      }

      // Load traditional optimizations
      try {
        const optimizationsData = await getOptimizations(selectedProduct._id);
        setOptimizations(optimizationsData?.data || []);
      } catch (optErr) {
        // No optimizations available yet
        setOptimizations([]);
      }

      // Load Gemini AI optimizations
      try {
        const geminiData = await getGeminiOptimizations(selectedProduct._id);
        setGeminiOptimizations(geminiData?.data || []);
      } catch (gemErr) {
        // No Gemini optimizations yet
        setGeminiOptimizations([]);
      }
    } catch (err) {
      console.error('Error loading product data:', err);
    }
  };

  /**
   * Run emission analysis for selected product
   */
  const handleRunAnalysis = async () => {
    if (!selectedProduct) {
      setError('Please select a product first');
      return;
    }

    if (supplyChainNodes.length === 0) {
      setError('Please add supply chain nodes before running analysis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await runAnalysis(selectedProduct._id);
      setAnalysisResult(result);

      // Refresh traditional optimizations
      const optimizationsData = await getOptimizations(selectedProduct._id);
      setOptimizations(optimizationsData.data || []);

      // Fetch Gemini AI optimizations
      try {
        const geminiData = await getGeminiOptimizations(selectedProduct._id);
        setGeminiOptimizations(geminiData.data || []);
      } catch (gemErr) {
        console.error('Error fetching Gemini optimizations:', gemErr);
        setGeminiOptimizations([]);
      }

      setCurrentPage(PAGES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Failed to run analysis');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle company login
   */
  const handleCompanyLogin = (company) => {
    setLoggedInCompany(company);
    setCurrentPage(PAGES.DASHBOARD);
  };

  /**
   * Handle new company registration and login
   */
  const handleCompanyCreated = (company) => {
    setLoggedInCompany(company);
    setCurrentPage(PAGES.DASHBOARD);
  };

  /**
   * Handle product creation
   */
  const handleProductCreated = async (newProduct) => {
    setProducts([...products, newProduct]);
    setSelectedProduct(newProduct);
    setCurrentPage(PAGES.DASHBOARD);
    setError('');
  };

  /**
   * Handle node added
   */
  const handleNodeAdded = async (newNode) => {
    setSupplyChainNodes([...supplyChainNodes, newNode]);
  };

  /**
   * Handle company logout
   */
  const handleLogout = () => {
    setLoggedInCompany(null);
    setProducts([]);
    setSelectedProduct(null);
    setSupplyChainNodes([]);
    setAnalysisResult(null);
    setOptimizations([]);
    setCurrentPage(PAGES.LOGIN);
  };

  // ============================================================
  // RENDER LOGIN PAGE
  // ============================================================
  if (!loggedInCompany) {
    return (
      <LoginPage
        onCompanyLogin={handleCompanyLogin}
        onCompanyCreated={handleCompanyCreated}
      />
    );
  }

  // ============================================================
  // RENDER MAIN APP (After Login)
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation Bar */}
      <nav className="bg-primary-darker bg-opacity-50 backdrop-blur-md border-b border-border-color sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Company Name */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => {
                  setCurrentPage(PAGES.DASHBOARD);
                  setError('');
                }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl">♻️</span>
                <div className="hidden sm:block">
                  <span className="text-text-gradient font-bold block">CarbonChain Pro</span>
                  <span className="text-text-secondary text-xs">
                    {loggedInCompany.name}
                  </span>
                </div>
              </button>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => {
                    setCurrentPage(PAGES.DASHBOARD);
                    setError('');
                  }}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === PAGES.DASHBOARD
                      ? 'bg-accent-emerald text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage(PAGES.ADD_PRODUCT)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === PAGES.ADD_PRODUCT
                      ? 'bg-accent-emerald text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  New Product
                </button>
                {selectedProduct && (
                  <button
                    onClick={() => setCurrentPage(PAGES.ADD_NODE)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentPage === PAGES.ADD_NODE
                        ? 'bg-accent-emerald text-white'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Add Node
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Product Select & Controls */}
            <div className="flex items-center gap-4">
              {products.length > 0 && (
                <>
                  <select
                    value={selectedProduct?._id || ''}
                    onChange={(e) => {
                      const prod = products.find((p) => p._id === e.target.value);
                      setSelectedProduct(prod);
                    }}
                    className="bg-primary-darker border border-border-color rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-emerald"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>

                  {selectedProduct && supplyChainNodes.length > 0 && (
                    <button
                      onClick={handleRunAnalysis}
                      disabled={loading}
                      className="bg-accent-teal text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 text-sm"
                    >
                      {loading ? 'Analyzing...' : 'Run Analysis'}
                    </button>
                  )}
                </>
              )}

              {/* Backend Status */}
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-darker rounded-lg border border-border-color">
                <div
                  className={`w-2 h-2 rounded-full ${
                    backendConnected ? 'bg-success-green' : 'bg-warning-amber'
                  }`}
                />
                <span className="text-text-secondary text-xs hidden sm:inline">
                  {backendConnected ? 'Connected' : 'Demo'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-danger-red bg-opacity-10 border border-danger-red text-danger-red px-4 py-2 rounded-lg font-semibold hover:bg-opacity-20 transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {/* Error Alert */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="p-4 bg-danger-red bg-opacity-10 border border-danger-red rounded-lg flex items-center justify-between">
              <p className="text-danger-red">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-danger-red hover:opacity-70"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        {currentPage === PAGES.DASHBOARD && (
          <Dashboard
            product={selectedProduct}
            analysisResult={analysisResult}
            nodes={supplyChainNodes}
            optimizations={optimizations}
            geminiOptimizations={geminiOptimizations}
            loading={loading}
            onRegenerateOptimizations={async () => {
              if (!selectedProduct) return;
              try {
                setLoading(true);
                const result = await regenerateGeminiOptimizations(selectedProduct._id);
                setGeminiOptimizations(result.data || []);
              } catch (err) {
                setError('Failed to regenerate optimizations: ' + err.message);
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {currentPage === PAGES.ADD_PRODUCT && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AddProductPage
              companyId={loggedInCompany._id}
              onProductCreated={handleProductCreated}
              onCancel={() => {
                setCurrentPage(PAGES.DASHBOARD);
                setError('');
              }}
            />
          </div>
        )}

        {currentPage === PAGES.ADD_NODE && selectedProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AddSupplyChainNodePage
              productId={selectedProduct._id}
              onNodeAdded={handleNodeAdded}
              onCancel={() => {
                setCurrentPage(PAGES.DASHBOARD);
                setError('');
              }}
            />
          </div>
        )}

        {currentPage === PAGES.DASHBOARD && !selectedProduct && products.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <p className="text-text-secondary text-xl mb-6">
              Welcome, {loggedInCompany.name}! 👋
            </p>
            <p className="text-text-secondary mb-6">
              Get started by creating your first product to track carbon emissions
            </p>
            <button
              onClick={() => setCurrentPage(PAGES.ADD_PRODUCT)}
              className="bg-accent-emerald text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
              Create Your First Product
            </button>
          </div>
        )}

        {currentPage === PAGES.DASHBOARD && !selectedProduct && products.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
            <p className="text-text-secondary text-xl mb-6">
              Select a product from the dropdown above or create a new one
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary-darker bg-opacity-50 backdrop-blur-md border-t border-border-color py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-secondary text-sm">
            CarbonChain Pro — AI-Powered Supply Chain Carbon & Net-Zero Tracker
          </p>
          <p className="text-text-secondary text-xs mt-2">
            Helping {loggedInCompany.name} balance sustainability, cost efficiency, and business continuity
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
