const express = require('express');
const router = express.Router();
const {
  createCompany,
  registerCompany,
  loginCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');

// Authentication routes
// POST - Register a new company
router.post('/register', registerCompany);

// POST - Login company
router.post('/login', loginCompany);

// CRUD routes
// POST - Create a new company
router.post('/', createCompany);

// GET - Get all companies
router.get('/', getAllCompanies);

// GET - Get company by ID
router.get('/:id', getCompanyById);

// PUT - Update company
router.put('/:id', updateCompany);

// DELETE - Delete company
router.delete('/:id', deleteCompany);

module.exports = router;
