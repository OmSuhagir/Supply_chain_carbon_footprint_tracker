import axios from 'axios';

/**
 * API Service for CarbonChain Pro
 * Centralized API communication with backend
 */

// Base API URL - works with both local dev and Vercel production
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : '/api');

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// COMPANY ENDPOINTS
// ============================================================

/**
 * Create a new company
 * @param {Object} companyData - Company information
 */
export const createCompany = async (companyData) => {
  try {
    const response = await apiClient.post('/companies', companyData);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

/**
 * Register a new company with email and password
 * @param {Object} companyData - Company registration data
 */
export const registerCompany = async (companyData) => {
  try {
    const response = await apiClient.post('/companies/register', companyData);
    return response.data;
  } catch (error) {
    console.error('Error registering company:', error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Login company with email and password
 * @param {String} email - Company email
 * @param {String} password - Company password
 */
export const loginCompany = async (email, password) => {
  try {
    const response = await apiClient.post('/companies/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Get all companies
 */
export const getCompanies = async () => {
  try {
    const response = await apiClient.get('/companies');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Get company by ID
 * @param {String} companyId - Company ID
 */
export const getCompanyById = async (companyId) => {
  try {
    const response = await apiClient.get(`/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

// ============================================================
// PRODUCT ENDPOINTS
// ============================================================

/**
 * Create a new product with yearly net-zero target
 * @param {Object} productData - Product information
 */
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Get all products for a company
 * @param {String} companyId - Company ID
 */
export const getProductsByCompany = async (companyId) => {
  try {
    const response = await apiClient.get(`/products/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get product by ID
 * @param {String} productId - Product ID
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// ============================================================
// SUPPLY CHAIN NODE ENDPOINTS
// ============================================================

/**
 * Add a supply chain node for a product
 * @param {Object} nodeData - Supply chain node information
 */
export const addSupplyChainNode = async (nodeData) => {
  try {
    const response = await apiClient.post('/supply-chain', nodeData);
    return response.data;
  } catch (error) {
    console.error('Error adding supply chain node:', error);
    throw error;
  }
};

/**
 * Get all supply chain nodes for a product
 * @param {String} productId - Product ID
 */
export const getSupplyChainNodes = async (productId) => {
  try {
    const response = await apiClient.get(`/supply-chain/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching supply chain nodes:', error);
    throw error;
  }
};

/**
 * Get supply chain node by ID
 * @param {String} nodeId - Node ID
 */
export const getNodeById = async (nodeId) => {
  try {
    const response = await apiClient.get(`/supply-chain/${nodeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching node:', error);
    throw error;
  }
};

/**
 * Update supply chain node
 * @param {String} nodeId - Node ID
 * @param {Object} nodeData - Updated node information
 */
export const updateSupplyChainNode = async (nodeId, nodeData) => {
  try {
    const response = await apiClient.put(`/supply-chain/${nodeId}`, nodeData);
    return response.data;
  } catch (error) {
    console.error('Error updating supply chain node:', error);
    throw error;
  }
};

/**
 * Analyze route intelligence for Maharashtra cities
 * @param {Object} routeData - From and toLocation
 */
export const analyzeRouteIntelligence = async (routeData) => {
  try {
    const response = await apiClient.post('/supply-chain/route/analyze', routeData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing route:', error);
    throw error;
  }
};

// ============================================================
// ANALYSIS ENDPOINTS
// ============================================================

/**
 * Run emission analysis for a product
 * @param {String} productId - Product ID
 */
export const runAnalysis = async (productId) => {
  try {
    const response = await apiClient.post(`/analysis/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error running analysis:', error);
    throw error;
  }
};

/**
 * Get latest analysis result for a product
 * @param {String} productId - Product ID
 * Returns null if no analysis exists (expected for new products)
 */
export const getAnalysisResult = async (productId) => {
  try {
    const response = await apiClient.get(`/analysis/${productId}`);
    return response.data;
  } catch (error) {
    // If 404, it means no analysis exists yet - this is normal for new products
    if (error.response?.status === 404) {
      return { success: true, data: null };
    }
    console.error('Error fetching analysis result:', error);
    throw error;
  }
};

/**
 * Get analysis history for a product
 * @param {String} productId - Product ID
 */
export const getAnalysisHistory = async (productId) => {
  try {
    const response = await apiClient.get(`/analysis/history/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    throw error;
  }
};

// ============================================================
// OPTIMIZATION ENDPOINTS
// ============================================================

/**
 * Get optimization recommendations for a product
 * @param {String} productId - Product ID
 * Returns empty array if no optimizations exist
 */
export const getOptimizations = async (productId) => {
  try {
    const response = await apiClient.get(`/optimizations/${productId}`);
    return response.data;
  } catch (error) {
    // If 404, it means no optimizations exist yet - this is normal for new products
    if (error.response?.status === 404) {
      return { success: true, data: [] };
    }
    console.error('Error fetching optimizations:', error);
    throw error;
  }
};

/**
 * Create optimization insight
 * @param {Object} optimizationData - Optimization information
 */
export const createOptimization = async (optimizationData) => {
  try {
    const response = await apiClient.post('/optimizations', optimizationData);
    return response.data;
  } catch (error) {
    console.error('Error creating optimization:', error);
    throw error;
  }
};

/**
 * Get Gemini AI-generated optimizations for a product
 * @param {String} productId - Product ID
 */
export const getGeminiOptimizations = async (productId) => {
  try {
    const response = await apiClient.get(`/optimizations/${productId}/gemini`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: true, data: [], source: 'gemini-ai' };
    }
    console.error('Error fetching Gemini optimizations:', error);
    throw error;
  }
};

/**
 * Regenerate Gemini AI recommendations for a product
 * @param {String} productId - Product ID
 */
export const regenerateGeminiOptimizations = async (productId) => {
  try {
    const response = await apiClient.post(`/optimizations/${productId}/gemini/regenerate`);
    return response.data;
  } catch (error) {
    console.error('Error regenerating Gemini optimizations:', error);
    throw error;
  }
};

/**
 * Get optimization insights from the optimization engine
 * Uses the dedicated /api/optimizations endpoint
 */
export const getOptimisationInsights = async () => {
  try {
    const response = await apiClient.get('/optimizations');
    return response.data;
  } catch (error) {
    console.error('Error fetching optimization insights:', error);
    if (error.response?.status === 404) {
      return { success: true, data: [] };
    }
    throw error;
  }
};

// ============================================================
// NET-ZERO PROGRESS ENDPOINTS
// ============================================================

/**
 * Get net-zero progress history for a product
 * @param {String} productId - Product ID
 */
export const getNetZeroProgress = async (productId) => {
  try {
    const response = await apiClient.get(`/netzero-progress/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching net-zero progress:', error);
    throw error;
  }
};

/**
 * Record net-zero progress
 * @param {Object} progressData - Net-zero progress information
 */
export const recordNetZeroProgress = async (progressData) => {
  try {
    const response = await apiClient.post('/netzero-progress', progressData);
    return response.data;
  } catch (error) {
    console.error('Error recording net-zero progress:', error);
    throw error;
  }
};

/**
 * Health check - ensure backend is running
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
};

export default apiClient;
