const router = require("express").Router()

const {
    getCompany,
    getOneCompany,
    saveCompany,
    editCompany,
    deleteCompany,
    filterCompanies,
    categoryfilter,
    getCompanyUser
} = require("../controllers/company.Controller")

const verifyToken = require("../middlewares/verifyToken")

router.get('/companies/search', verifyToken, filterCompanies)
router.get('/companies/categories', verifyToken, categoryfilter)
router.get('/companies', verifyToken, getCompany)
router.get('/companies/:_id', verifyToken, getOneCompany)
router.get('/companies/Owner/:owner', verifyToken, getCompanyUser)
router.post('/companies', verifyToken, saveCompany)
router.put('/companies/:_id', verifyToken, editCompany)
router.delete('/companies/:_id', verifyToken, deleteCompany)

module.exports = router