const { Company } = require('../models/schemas');
const bcrypt = require('bcrypt');

/**
 * Register a new company
 * POST /api/companies/register
 */
const registerCompany = async (req, res) => {
  try {
    const { name, email, password, industry, sustainabilityGoal, headquartersLocation } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Company name, email, and password are required',
      });
    }

    // Check if company email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company
    const company = new Company({
      name,
      email,
      password: hashedPassword,
      industry,
      sustainabilityGoal,
      headquartersLocation,
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: {
        _id: company._id,
        name: company.name,
        email: company.email,
        industry: company.industry,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Login company
 * POST /api/companies/login
 */
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: company._id,
        name: company.name,
        email: company.email,
        industry: company.industry,
        sustainabilityGoal: company.sustainabilityGoal,
        headquartersLocation: company.headquartersLocation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Create a new company (deprecated, use registerCompany instead)
 * POST /api/companies
 */
const createCompany = async (req, res) => {
  try {
    const { name, email, password, industry, sustainabilityGoal, headquartersLocation } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    // Check if company email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company/email already exists',
      });
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('default', 10);

    // Create new company
    const company = new Company({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@company.com`,
      password: hashedPassword,
      industry,
      sustainabilityGoal,
      headquartersLocation,
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get all companies
 * GET /api/companies
 */
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Companies retrieved successfully',
      data: companies,
      count: companies.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Get company by ID
 * GET /api/companies/:id
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company retrieved successfully',
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Update company
 * PUT /api/companies/:id
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry, sustainabilityGoal, headquartersLocation } = req.body;

    const company = await Company.findByIdAndUpdate(
      id,
      { name, industry, sustainabilityGoal, headquartersLocation },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * Delete company
 * DELETE /api/companies/:id
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  createCompany,
  registerCompany,
  loginCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
