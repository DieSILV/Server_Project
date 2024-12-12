const router = require("express").Router()
const mongoose = require('mongoose')

const {
    getProduct,
    getOneProduct,
    saveProduct,
    editProduct,
    deleteProduct,
    filterProducts,
    filterProductsPrice,
    filterProductsByCategory,
    filterProductsBySubCategory,
    filterProductsByCompany,
    filterProductsSearch
} = require("../controllers/product.Controller")

const verifyToken = require("../middlewares/verifyToken")

router.get('/products', filterProducts)
router.get('/products/search', filterProductsSearch)
router.get('/products/all', getProduct)
router.get('/products/price', filterProductsPrice)
router.get('/products/category', filterProductsByCategory)
router.get('/products/subcategory', filterProductsBySubCategory)
router.get('/products/company', filterProductsByCompany)
router.get('/products/details/:id', getOneProduct)
router.post('/products', verifyToken, saveProduct)
router.put('/products/:id', verifyToken, editProduct)
router.delete('/products/:id', verifyToken, deleteProduct)

module.exports = router