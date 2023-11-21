const express = require('express');
const router = express.Router();
const productController = require('../controller/ProductController');
const productvariantController = require('../controller/ProductVariantController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/addProduct',authMiddleware, productController.addProduct);
router.post('/addProductvariant/:id',authMiddleware, productvariantController.addProductVariant);
router.get('/getIdByBrand/:brandId', productController.getProductByBrandId);
router.get('/getProductsByCategoryAndBrand/:categoryId/:brandId', productController.getProductsByCategoryAndBrand);
router.get('/getIdByCategory/:categoryId', productController.getProductsByCategory);
router.put('/editProduct/:id',authMiddleware, productController.editProduct);
router.delete('/delete/:id',authMiddleware, productController.deleteProduct);
router.get('/searchProduct', productController.searchProducts);
router.delete('/deleteVariant/:id',authMiddleware, productvariantController.deleteProductVariant);
router.put('/editProductVariant/:id',authMiddleware, productvariantController.updateProductVariant);
router.post('/addAttributes/:id',authMiddleware, productvariantController.addAttributes);
router.delete('/deleteAttributes/:id/:attributeIdToRemove',authMiddleware, productvariantController.deleteAttributes);
router.put('/addQuantity/:variantId/:attributeId',authMiddleware,productvariantController.addQuantityToAttribute);
router.get('/getAll',productController.getAllProduct)
router.get('/getRating/:productName',productController.getProductRating)
router.get('/getDetails/:name', productController.detailsProduct);
router.get('/filter/:categoryId', productController.filterProductsByCategory);
router.get('/filter/highToLow/:categoryId', (req, res) => {
  req.query.sort = 'highToLow';
  productController.filterProductsByCategory(req, res);
});
router.get('/filter/:categoryId/:brandId', productController.filterProductsByCategoryandBrand);
router.get('/filter/highToLow/:categoryId/:brandId', (req, res) => {
  req.query.sort = 'highToLow';
  productController.filterProductsByCategoryandBrand(req, res);
});
module.exports = router;