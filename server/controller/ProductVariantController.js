const ProductVariant = require('../Model/ProductVariantModel'); 
const Product = require('../Model/ProductModel'); 


const addProductVariant = async (req, res) => {
  try {
    const parentProductName = req.params.id;
    const parentProduct = await Product.findById(parentProductName);
    if (!parentProduct) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm chính' });
    }
    const { memory, imPrice, oldPrice, newPrice, attributes } = req.body;
    const productVariant = new ProductVariant({
      productName: parentProductName,
      memory,
      imPrice,
      oldPrice,
      newPrice,
      attributes,
    });
    const newProductVariant = await productVariant.save();
    parentProduct.variant.push(newProductVariant._id);
    await parentProduct.save();
    res.status(201).json({ success: true, data: newProductVariant });
  } catch (error) {
    res.status(500).json({ success: false,  error });
  }
};
const addAttributes = async (req, res) => {
  try {
    const productVariantId = req.params.id; 
    const { attributes } = req.body; 
    const productVariant = await ProductVariant.findById(productVariantId);
    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm biến thể' });
    }
    productVariant.attributes.push(...attributes); 
    const updatedProductVariant = await productVariant.save();
    res.status(200).json({ success: true, data: updatedProductVariant });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};




const deleteProductVariant = async (req, res) => {
  try {
    const productVariantId = req.params.id;
    if (productVariantId) {
      const productVariant = await ProductVariant.findById(productVariantId);
      if (!productVariant) {
        return res.status(401).json({ err: 'Biến thể sản phẩm không tồn tại' });
      }
      await ProductVariant.findByIdAndDelete(productVariantId);
      const parentProductId = productVariant.productName;
      const parentProduct = await Product.findById(parentProductId);
      if (parentProduct) {
        parentProduct.variant = parentProduct.variant.filter(
          (variant) => variant.toString() !== productVariantId
        );
        await parentProduct.save();
      }
      res.status(200).json({ success: true, message: 'Biến thể đã được xóa thành công' });
    } else {
      return res.status(401).json({ msg: 'Không tìm thấy ID' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Lỗi Server' });
  }
};

const updateProductVariant = async (req, res) => {
  try {
    const productVariantId = req.params.id;
    const data = req.body;
    const updateData = {};
    if (data.memory !== undefined) {
      updateData.memory = data.memory;
    }
    if (data.imPrice !== undefined) {
      updateData.imPrice = data.imPrice;
    }
    if (data.oldPrice !== undefined) {
      updateData.oldPrice = data.oldPrice;
    }
    if (data.newPrice !== undefined) {
      updateData.newPrice = data.newPrice;
    }
    const updatedProduct = await ProductVariant.findByIdAndUpdate(productVariantId, updateData, { new: true });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
const deleteAttributes = async (req, res) => {
  try {
    const variantId = req.params.id;
    const attributeIdToRemove = req.params.attributeIdToRemove;
    const productVariant = await ProductVariant.findById(variantId);
    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Biến thể không tồn tại' });
    }
    const indexToRemove = productVariant.attributes.findIndex(
      (attribute) => attribute._id.toString() === attributeIdToRemove
    );
    if (indexToRemove === -1) {
      return res.status(404).json({ success: false, error: 'Thuộc tính không tồn tại trong biến thể' });
    }
    productVariant.attributes.splice(indexToRemove, 1);
    await productVariant.save();
    res.status(200).json({ success: true, data: productVariant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const addQuantityToAttribute = async (req, res) => {
  try {
    const variantId = req.params.variantId;
    const attributeId = req.params.attributeId;
    const quantityToAdd = parseInt(req.body.quantity, 10);

    const productVariant = await ProductVariant.findById(variantId);

    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Biến thể không tồn tại' });
    }

    const attributeToUpdate = productVariant.attributes.find(
      (attribute) => attribute._id.toString() === attributeId
    );

    if (!attributeToUpdate) {
      return res.status(404).json({ success: false, error: 'Thuộc tính không tồn tại trong biến thể' });
    }

    attributeToUpdate.quantity += quantityToAdd;

    const updatedProductVariant = await productVariant.save();

    res.status(200).json({ success: true, data: updatedProductVariant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = { addProductVariant,deleteProductVariant,updateProductVariant,addAttributes,deleteAttributes,addQuantityToAttribute };
