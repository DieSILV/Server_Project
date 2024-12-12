const router = require("express").Router();

const {
    addToCart,
    getCartById,
    removeFromCart,
    checkoutCart,
    clearCart,
} = require("../controllers/cart.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get('/cart', verifyToken, getCartById);
router.post('/cart/checkout', verifyToken, checkoutCart);
router.post('/cart', verifyToken, addToCart);
router.delete('/cart/:productId', verifyToken, removeFromCart);
router.delete('/cart', verifyToken, clearCart);

module.exports = router;
