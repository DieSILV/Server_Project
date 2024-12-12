const router = require("express").Router();

const {
    addToCart,
    getCartById,
    removeFromCart,
    checkoutCart,
    clearCart,
    getCartByCompany
} = require("../controllers/cart.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get('/cart', verifyToken, getCartById);
router.get('/cart/company/:companyId', verifyToken, getCartByCompany);
router.post('/cart/checkout', verifyToken, checkoutCart);
router.post('/cart', verifyToken, addToCart);
router.delete('/cart/:productId', verifyToken, removeFromCart);
router.delete('/cart', verifyToken, clearCart);

module.exports = router;
