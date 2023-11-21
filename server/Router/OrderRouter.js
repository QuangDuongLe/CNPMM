const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/addOrder/:userId', orderController.addOrder);
router.put('/updateOrder/:orderId',authMiddleware, orderController.updateOrderStatus);
router.put('/completeOrder/:orderId', authMiddleware , orderController.completeOrder);
router.put('/completeOrderUser/:orderCode', orderController.completeOrderUser);
router.get('/waiting-for-confirmation', orderController.getOrdersWaitingForConfirmation);
router.get('/home-delivery', orderController.getOrdersHomeDeliveryReady);
router.get('/home-delivery-shipping', orderController.getOrdersHomeDeliveryShipping);
router.get('/store-pickup-getready', orderController.getOrdersStorePickupgetReady);
router.get('/store-pickup-ready', orderController.getOrdersStorePickupReady);
router.get('/completedAtStore', orderController.getCompletedOrdersAtStore);
router.get('/completedShipping', orderController.getCompletedOrdersShipping);
router.get('/cancelAtStore', orderController.getCanceldOrdersAtStore);
router.get('/cancelShipping', orderController.getCanceldOrdersShipping);
router.get('/searchOrder', orderController.searchOrder);
router.get('/searchOrderAtStoreComplete', orderController.searchOrderAtStoreComplete);
router.get('/searchOrderShippingComplete', orderController.searchOrderShippingComplete);
router.get('/searchOrderGetReady', orderController.searchOrderGetReady);
router.get('/searchOrderShipping', orderController.searchOrderShipping);
router.get('/searchOrderGetReadyAtStore', orderController.searchOrderGetReadyAtStore);
router.get('/searchOrderReady', orderController.searchOrderReady);
router.get('/user/:userId', orderController.getOrdersByUserId);
router.get('/oderDetails/:orderCode', orderController.getOrdersDetails);
router.delete('/delete/:orderId',authMiddleware,orderController.deleteOrder)
router.put('/cancel/:orderCode',orderController.cancelOrder)
router.get('/getOrderShipping', orderController.getOrdersShipping);
router.put('/rating',orderController.addProductRating)
router.put('/changeProduct', authMiddleware,orderController.changeProduct)
router.put('/checkBH',orderController.checkBH)
module.exports = router;
