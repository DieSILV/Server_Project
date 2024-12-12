const router = require('express').Router();

const { getPurchasesByUser,
    createPurchase,
    deletePurchase
} = require('../controllers/purchase.controllers');


const verifyToken = require('../middlewares/verifyToken');

router.get('/purchases/:userId', verifyToken, getPurchasesByUser);

router.post('/purchases', verifyToken, createPurchase);

router.delete('/purchases/:purchaseId', verifyToken, deletePurchase);

module.exports = router;
