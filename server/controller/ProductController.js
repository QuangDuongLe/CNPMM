const Product = require('../Model/ProductModel');
const Brand = require('../Model/BrandModel');
const Category = require('../Model/CategoryModel');
const ProductVariant = require('../Model/ProductVariantModel');
const { format } = require('date-fns');
const addProduct = async (req, res) => {
  try {
    const { name, desc, warrantyPeriod, brandName, categoryName, properties, thumnails, include } = req.body;
    const releaseTimeInput = req.body.releaseTime;
    const formattedReleaseTime = format(new Date(releaseTimeInput), 'dd/MM/yyyy');
    const brand = await Brand.findOne({ name: brandName });
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand không tồn tại' });
    }
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category không tồn tại' });
    }
    const product = new Product({
      name,
      desc,
      releaseTime: formattedReleaseTime,
      warrantyPeriod,
      brand: brand._id,
      category: category._id,
      isHide: true,
      isOutOfStock: false,
      properties,
      thumnails,
      include
    });
    const newProduct = await product.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getProductByBrandId = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const products = await Product.find({ brand: brandId }).populate('variant');


    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};
const getProductsByCategoryAndBrand = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const brandId = req.params.brandId;
    const products = await Product.find({ category: categoryId, brand: brandId }).populate('variant');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const products = await Product.find({ category: categoryId })
      .select('-desc -releaseTime -views -include -promotion') 
      .populate('brand')
      .populate({
        path: 'variant',
        populate: {
          path: 'attributes',
        },
      })
      .lean();

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};



const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const updateData = {};
    if (data.name) {
      updateData.name = data.name;
    }
    if (data.desc) {
      updateData.desc = data.desc;
    }
    if (data.releaseTime) {
      const releaseTimeInput = data.releaseTime;
      const formattedReleaseTime = format(new Date(releaseTimeInput), 'dd/MM/yyyy');
      updateData.releaseTime = formattedReleaseTime;
    }
    if (data.warrantyPeriod) {
      updateData.warrantyPeriod = data.warrantyPeriod;
    }
    if (data.properties) {
      updateData.properties = data.properties;
    }
    if (data.thumnails) {
      updateData.thumnails = data.thumnails;
    }
    if (data.include) {
      updateData.include = data.include;
    }
    if (data.isHide !== undefined) {
      updateData.isHide = data.isHide;
    }
    if (data.promotion) {
      updateData.promotion = data.promotion;
    }
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true })
      .select('-desc -releaseTime -views -include -promotion') 
      .populate('brand')
      .populate({
        path: 'variant',
        populate: {
          path: 'attributes',
        },
      })
      .lean();
      
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (productId) {
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return res.status(401).json({ err: 'Sản phẩm không tồn tại' });
      }
      const variants = product.variant;
      for (const variantId of variants) {
        await ProductVariant.findByIdAndDelete(variantId);
      }

      await Product.findByIdAndDelete(productId);

      res.status(200).json({ success: true, message: 'Sản phẩm và các biến thể đã được xóa thành công' });
    } else {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};
const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const regex = new RegExp(keyword, 'i');
    const products = await Product.find({
      name: { $regex: regex }, isHide: false
    }).populate('brand').populate('category').populate({
      path: 'variant',
      populate: {
        path: 'attributes',
      },
    }).lean();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const detailsProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const products = await Product.findOne({ name })
      .populate('brand')
      .populate('category')
      .populate({
        path: 'variant',
        populate: {
          path: 'attributes',
        },
      }).lean();
    if (!products) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .select('_id') 
      .exec();

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};


const filterProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
    const includeOldPrice = req.query.includeOldPrice === 'true';
    const selectedMemory = req.query.selectedMemory;

    let matchCondition = {
      newPrice: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };

    if (includeOldPrice) {
      matchCondition.$or = [{ oldPrice: { $exists: true } }];
    }

    if (selectedMemory) {
      matchCondition.$and = [
        {
          $or: [
            { memory: selectedMemory },
            { memory: { $exists: false } },
          ],
        },
      ];
    }

    const products = await Product.find({ category: categoryId })
      .select('-desc -releaseTime -views -include -promotion') 
      .populate('variant', null, matchCondition)
      .populate('brand')
      .populate('category').lean();

      let expandedProducts = [];

      products.forEach((product) => {
        const expandedVariants = product.variant.map((variant) => ({
          ...product,
          variant: [variant],
        }));
  
        expandedProducts = [...expandedProducts, ...expandedVariants];
      });
  
      // Sắp xếp sản phẩm dựa trên giá của biến thể
      const sortMode = req.query.sort || 'lowToHigh';
      expandedProducts = expandedProducts.sort((a, b) => {
        const priceA = a.variant[0].newPrice;
        const priceB = b.variant[0].newPrice;
        return sortMode === 'highToLow' ? priceB - priceA : priceA - priceB;
      });
  
      res.status(200).json({
        success: true,
        data: expandedProducts,
      });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const filterProductsByCategoryandBrand = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const brandId = req.params.brandId;
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
    const includeOldPrice = req.query.includeOldPrice === 'true';
    const selectedMemory = req.query.selectedMemory;

    let matchCondition = {
      newPrice: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    };

    if (includeOldPrice) {
      matchCondition.$or = [{ oldPrice: { $exists: true } }];
    }

    if (selectedMemory) {
      matchCondition.$and = [
        {
          $or: [
            { memory: selectedMemory },
            { memory: { $exists: false } },
          ],
        },
      ];
    }

    const products = await Product.find({ category: categoryId, brand: brandId })
      .select('-desc -releaseTime -views -include -promotion')
      .populate('variant', null, matchCondition)
      .populate('brand')
      .populate('category').lean();

      let expandedProducts = [];

      products.forEach((product) => {
        const expandedVariants = product.variant.map((variant) => ({
          ...product,
          variant: [variant],
        }));
  
        expandedProducts = [...expandedProducts, ...expandedVariants];
      });
  

      const sortMode = req.query.sort || 'lowToHigh';
      expandedProducts = expandedProducts.sort((a, b) => {
        const priceA = a.variant[0].newPrice;
        const priceB = b.variant[0].newPrice;
        return sortMode === 'highToLow' ? priceB - priceA : priceA - priceB;
      });
  
      res.status(200).json({
        success: true,
        data: expandedProducts,
      });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getProductRating = async (req, res) => {
  try {
    const productName = req.params.productName;
    const product = await Product.findOne({ name: productName }).populate({
      path: 'ratings',
      populate: { path: 'user' }
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }

    const rating = product.ratings;

    const starFilter = parseInt(req.query.star);
    const hasPicturesFilter = req.query.hasPictures;

    if (!isNaN(starFilter) && starFilter >= 1 && starFilter <= 5) {
      const rating1 = rating.filter((review) => review.rating === starFilter);
      if (hasPicturesFilter === 'true') {
        const rating2 = rating1.filter((review) => review.pictures.length > 0);
        return res.status(200).json({ success: true, data: rating2 });
      } else {
        return res.status(200).json({ success: true, data: rating1 });
      }
    }

    if (hasPicturesFilter === 'true') {
      const rating1 = rating.filter((review) => review.pictures.length > 0);
      return res.status(200).json({ success: true, data: rating1 });
    }

    if (!starFilter && hasPicturesFilter === 'false') {
      return res.status(200).json({ success: true, data: rating });
    }
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};

module.exports = { addProduct, getProductRating, getProductByBrandId, getProductsByCategory, editProduct, deleteProduct, searchProducts, getAllProduct, getProductsByCategoryAndBrand, detailsProduct, filterProductsByCategory, filterProductsByCategoryandBrand };
