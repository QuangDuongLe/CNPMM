const express = require('express');
const router = express.Router();
const cartController = require('../controller/CartController');


router.post('/addCart', cartController.addToCart);
router.delete('/deleteCart/:cartItemId/:userId', cartController.deleteCartItem);
router.put('/update/:cartItemId/:userId', cartController.updateCartItemQuantity);
router.get('/getToCart/:userId', cartController.getCartItemsByUserId);
module.exports = router;
