const Cart = require('../Model/CartModel');
const ProductVariant = require('../Model/ProductVariantModel');
const Order = require('../Model/OrderModel');
const Voucher = require('../Model/VourcherModel');
const Product = require('../Model/ProductModel')
const moment = require("moment-timezone");
const orderSendMail = require('../ultils/oderSendMail');
const generateRandomOrderCode = async () => {
  const prefix = 'GGZ';
  let orderCode;
  let isCodeUnique = false;
  let suffix = 0;
  while (!isCodeUnique) {
    const randomCode = (10000 + suffix).toString();
    orderCode = prefix + randomCode;
    const existingOrder = await Order.findOne({ orderCode });
    if (!existingOrder) {
      isCodeUnique = true;
    } else {
      suffix++;
    }
  }
  return orderCode;
};

const addOrder = async (req, res) => {
  try {
    const orderCode = await generateRandomOrderCode();
    const { userId } = req.params;
    const { userName, userEmail, address, shippingMethod, paymentMethod, subTotal, totalPay, userPhone, vouchercode } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate('items.productVariant');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Giỏ hàng không tồn tại hoặc trống' });
    }
    let voucher = await Voucher.findOne( { code: vouchercode })
    if (voucher && voucher.quantity > 0) {
      voucher.quantity--; 
      await voucher.save(); 
    } else {
      voucher = null;
    }    
    
    const newOrder = new Order({
      orderCode,
      user: userId,
      items: cart.items,
      userName,
      userEmail,
      address,
      shippingMethod,
      status: 'Chờ xác nhận',
      paymentMethod,
      subTotal,
      shippingFee: 0,
      totalPay,
      voucher: voucher ? voucher._id : null,
      userPhone
    });

    for (const cartItem of cart.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);
      if (!productVariant) {
        return res.status(404).json({ success: false, error: 'Sản phẩm biến thể không tồn tại' });
      }

      const matchedAttribute = productVariant.attributes.find(attribute => attribute.color === cartItem.color);
      if (matchedAttribute) {
        const quantityInCart = cartItem.quantity;
        const remainingQuantity = matchedAttribute.quantity - quantityInCart;

        matchedAttribute.quantity = remainingQuantity;
        matchedAttribute.sold += quantityInCart;

        await productVariant.save();
      }
    }

    await Cart.updateOne({ user: userId }, { $set: { items: [] } });
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, data: savedOrder });
    const populatedOrder = await Order.findById(newOrder._id).populate('items.product items.productVariant');
    let emailHTML = `
    <html>
    <head>
        <style>
          body {
              font-family: Arial, sans-serif;
          }
          h2 {
              text-align: center;
          }
          .order-info {
              background-color: #f2f2f2;
              padding: 10px;
              margin: 20px 0;
          }
          h1 {
              
          }
          ul {
              list-style: none;
              padding: 0;
          }
          li {
              margin: 10px 0;
          }
          .product-item {
            display: flex;
            margin-bottom: 20px;
          }
          .product-image {
              max-width: 100px;
              margin-right: 10px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          table, th, td {
              border: 1px solid #ccc;
          }
          th, td {
              padding: 8px;
              text-align: left;
          }
          th {
              background-color: #f2f2f2;
          }
        </style>
    </head>
    <body>
    <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; align-items: center;">
        <img src="https://res.cloudinary.com/doq4spvys/image/upload/v1698228631/mqjpap63hv6bxuddgfbx.png" style="width: 40px; height: 40px; margin-right: 10px;"/>
        <span style="line-height: 40px; font-size: 17px; font-weight: 600"> Di Động Gen Z</span> 
      </div>
        <p>Di Động Gen Z chân thành cảm ơn sự ủng hộ của bạn, chúc bạn có trải nghiệm mua sắm thật vui vẻ cùng Di Động Gen Z!</p>
        <h2 style="color: #d70018;">Đơn hàng của bạn</h2>
        <div class="order-info">
          <p><strong>Mã đơn hàng:</strong> ${orderCode}</p>
          <p><strong>Tên khách hàng:</strong> ${userName}</p>
          <p><strong>Địa chỉ nhận hàng:</strong> ${address}</p>
          <p><strong>Số điện thoại:</strong> ${userPhone}</p>
          <p><strong>Ngày mua:</strong> ${populatedOrder.createDate}</p>
          <p><strong>Tổng tiền thanh toán:</strong> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPay)}</p>
        </div>
      
`;

    emailHTML += `
        <h2>Sản phẩm</h2>
        <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #000;">Tên sản phẩm</th>
          <th style="border: 1px solid #000;">Hình ảnh</th>
          <th style="border: 1px solid #000;">Số lượng</th>
          <th style="border: 1px solid #000;">Màu sắc</th>
          <th style="border: 1px solid #000;">Đơn giá</th>
          <th style="border: 1px solid #000;">Bảo hành</th>
          <th style="border: 1px solid #000;">Thành tiền</th>
        </tr>
        <!-- Duyệt qua danh sách sản phẩm đã đặt -->
        ${populatedOrder.items.map(item => `
          <tr>
          <td style="border: 1px solid #000; text-align: center;">
          ${item.product.name}  ${item.memory !== undefined ? item.memory : ''}
        </td>        
            <td style="border: 1px solid #000; text-align: center;"><img src="${item.pictures}" alt="Hình ảnh sản phẩm" class="product-image" style="width: 100px; height: 100px;"></td>
            <td style="border: 1px solid #000; text-align: center;">${item.quantity}</td>
            <td style="border: 1px solid #000; text-align: center;">${item.color}</td>
            <td style="border: 1px solid #000; text-align: center;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
            <td style="border: 1px solid #000; text-align: center;">${item.product.warrantyPeriod} tháng</td>
            <td style="border: 1px solid #000; text-align: center;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.subtotal)}</td>
          </tr>
        `).join('')}
      </table>
      <p>Lưu ý: Đây là email tự động, vui lòng không trả lời email này.</p>   
      </div>   
          `;

    const data = {
      email: userEmail,
      html: emailHTML,
    };

    await orderSendMail(data);
  } catch (error) {
    console.error('Lỗi khi thêm đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

   
    const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");


    const updateData = {
      status: 'Đã hoàn thành',
      completeDate: vnTime,
    };

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOrdersWaitingForConfirmation = async (req, res) => {
  try {
    const orders = await Order.find({ shippingMethod: 'Nhận tại cửa hàng',status: 'Chờ xác nhận' }).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng chờ xác nhận:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersShipping = async (req, res) => {
  try {
    const orders = await Order.find({ shippingMethod: 'Giao tận nơi',status: 'Chờ xác nhận' }).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng giao tận nơi:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersStorePickupgetReady = async (req, res) => {
  try {
    const orders = await Order.find({
      shippingMethod: 'Nhận tại cửa hàng',
      status:  'Đơn hàng đang được chuẩn bị' 
    }).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng nhận tại cửa hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersStorePickupReady = async (req, res) => {
  try {
    const orders = await Order.find({
      shippingMethod: 'Nhận tại cửa hàng',
      status:  'Đơn hàng sẵn sàng' 
    }).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng nhận tại cửa hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getCompletedOrdersAtStore = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Đã hoàn thành', shippingMethod: 'Nhận tại cửa hàng'}).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng đã hoàn thành:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getCompletedOrdersShipping = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Đã hoàn thành', shippingMethod: 'Giao tận nơi'}).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng đã hoàn thành:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getCanceldOrdersAtStore = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Đã hủy', shippingMethod: 'Nhận tại cửa hàng'}).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng đã hoàn thành:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getCanceldOrdersShipping = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Đã hủy', shippingMethod: 'Giao tận nơi'}).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng đã hoàn thành:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersHomeDeliveryReady = async (req, res) => {
  try {
    const orders = await Order.find({ shippingMethod: 'Giao tận nơi',status:'Đơn hàng đang được chuẩn bị' }).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng giao tận nơi:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersHomeDeliveryShipping = async (req, res) => {
  try {
    const orders = await Order.find({ shippingMethod: 'Giao tận nơi',status:'Đơn hàng đang được giao' }).populate('items.product').populate('voucher');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng giao tận nơi:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }
    for (const cartItem of order.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);

      if (productVariant) {
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.color === cartItem.color);

        if (matchedAttribute) {
          const quantityInCart = cartItem.quantity;
          const totalQuantity = matchedAttribute.quantity + quantityInCart;
          const totalSold = matchedAttribute.sold - quantityInCart;

          matchedAttribute.quantity = totalQuantity;
          matchedAttribute.sold = totalSold;

          await productVariant.save();
        }
      }
    }
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ success: true, message: 'Đã hủy đơn hàng' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const searchOrder = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const searchOrderAtStoreComplete = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword,shippingMethod:'Nhận tại cửa hàng'}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const searchOrderShippingComplete = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword,shippingMethod:'Giao tận nơi'}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const searchOrderGetReady = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword,shippingMethod:'Giao tận nơi',status:'Đơn hàng đang được chuẩn bị'}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const searchOrderShipping = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword,shippingMethod:'Giao tận nơi',status:'Đơn hàng đang được giao'}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const searchOrderGetReadyAtStore = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword,shippingMethod:'Nhận tại cửa hàng',status:'Đơn hàng đang được chuẩn bị'}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const searchOrderReady = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const order = await Order.find({orderCode: keyword,shippingMethod:'Nhận tại cửa hàng',status:'Đơn hàng sẵn sàng'}).populate('items.product')
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, error: 'Lỗi Server' });
  }
};
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const  status  = req.query.status;
    const orders = await Order.find({ user: userId, status: status}).populate('items.product items.productVariant').populate('voucher').lean();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getOrdersDetails = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { userId } = req.query;
    const order = await Order.findOne({ orderCode: orderCode });
    if (order && order.user && order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền truy cập đơn hàng này' });
    }
    const orders = await Order.findOne({ orderCode: orderCode })
      .populate('items.product')
      .populate('items.productVariant')
      .populate('voucher').lean();

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { userId } = req.query;
    const order = await Order.findOne({ orderCode: orderCode });
    if (order && order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền truy cập đơn hàng này' });
    }
    for (const cartItem of order.items) {
      const productVariantId = cartItem.productVariant;
      const productVariant = await ProductVariant.findById(productVariantId);

      if (productVariant) {
        const matchedAttribute = productVariant.attributes.find(attribute => attribute.color === cartItem.color);

        if (matchedAttribute) {
          const quantityInCart = cartItem.quantity;
          const totalQuantity = matchedAttribute.quantity + quantityInCart;
          const totalSold = matchedAttribute.sold - quantityInCart;

          matchedAttribute.quantity = totalQuantity;
          matchedAttribute.sold = totalSold;

          await productVariant.save();
        }
      }
    }
    order.status = 'Đã hủy';
    await order.save();
    res.status(200).json({ success: true, message: 'Đã hủy đơn hàng' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const completeOrderUser = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { userId } = req.query;
    const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");

    const order = await Order.findOne({ orderCode });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
    }
    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Không có quyền hoàn thành đơn hàng này' });
    }

    const updateData = {
      status: 'Đã hoàn thành',
      completeDate: vnTime,
    };

    const updatedOrder = await Order.findOneAndUpdate({ orderCode }, updateData, { new: true });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const addProductRating = async (req, res) => {
  try {
    const {productId, userId, orderCode } = req.query; 
    const { rating, comment, pictures } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }
    const order = await Order.findOne({
      user: userId,
      orderCode, 
      items: {
        $elemMatch: { product: productId, rated: false }
      }
    });
    if (!order) {
      return res.status(403).json({ success: false, error: 'Bạn không có quyền đánh giá sản phẩm này' });
    }
    order.items.forEach((item) => {
      if (item.product.toString() === productId && !item.rated) {
        item.rated = true;
      }
    });
    await order.save();
    const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
    const newRating = {
      user: userId,
      rating,
      comment,
      pictures,
      createDate: vnTime
    };
    product.ratings.push(newRating);
    const updatedProduct = await product.save();

    res.status(201).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const changeProduct = async (req, res) => {
  const { id, orderId } = req.query;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Đơn hàng không tồn tại' });
  }

  const productItem = order.items.find((item) => item.id.toString() === id);

  if (!productItem) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm trong đơn hàng' });
  }
  const product = await Product.findById(productItem.product).populate('category');
  const completeDate = moment(order.completeDate, "DD/MM/YYYY HH:mm:ss").tz("Asia/Ho_Chi_Minh");
  const currentDate = moment().tz("Asia/Ho_Chi_Minh");
  const diffDuration = moment.duration(currentDate.diff(completeDate));
  const diffDays = diffDuration.asDays();

  if (productItem.memory !== undefined) {
    if (diffDays > 3) {
      return res.status(200).json({ success: false, error: 'Đã quá hạn đổi sản phẩm' });
    }
  } else {
    if (!product.warrantyPeriod) {
      return res.status(400).json({ success: false, error: 'Sản phẩm không có thời gian bảo hành' });
    }

    const warrantyMonths = product.warrantyPeriod;
    const warrantyEndDate = moment(completeDate).add(warrantyMonths, 'months');
    const diffDurationWarranty = moment.duration(currentDate.diff(warrantyEndDate));
    const diffDaysWarranty = diffDurationWarranty.asDays();
    if (diffDaysWarranty > 0) {
      return res.status(200).json({ success: false, error: 'Đã quá hạn đổi sản phẩm' });
    }
  }

  const vnTime = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");

  if (productItem.change) {
    productItem.change.isHave = true;
    productItem.change.dateChange = vnTime;

    const productVariantId = productItem.productVariant;
    const color = productItem.color;

    const productVariant = await ProductVariant.findById(productVariantId);

    if (!productVariant) {
      return res.status(404).json({ success: false, error: 'Sản phẩm không tồn tại' });
    }

    const matchedAttribute = productVariant.attributes.find(attribute => attribute.color === color);

    if (matchedAttribute) {
      const quantityInCart = productItem.quantity;
      const totalQuantity = matchedAttribute.quantity - quantityInCart;
      const totalSold = matchedAttribute.sold + quantityInCart;

      matchedAttribute.quantity = totalQuantity;
      matchedAttribute.sold = totalSold;
      await productVariant.save();
    }
  }
  await order.save();
  res.status(200).json({ success: true, message: 'Đã cập nhật yêu cầu đổi trả' });
}
const checkBH = async (req, res) => {
  try {
    const { phone } = req.body;
    const orders = await Order.find({ userPhone: phone,status:"Đã hoàn thành" }).populate('items.product');
    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "Không tìm thấy đơn hàng" });
    }
    const allProducts = orders.reduce((products, order) => {
      const productsWithCompleteDate = order.items.map(item => ({ ...item.toObject(), completeDate: order.completeDate }));
      return products.concat(productsWithCompleteDate);
    }, []);
    return res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error('Lỗi khi kiểm tra bảo hành:', error);
    return res.status(500).json({ message: "Đã xảy ra lỗi server" });
  }
};




module.exports = { checkBH,changeProduct,getCanceldOrdersAtStore,addProductRating,getCanceldOrdersShipping,addOrder,cancelOrder,completeOrderUser,getOrdersDetails, updateOrderStatus, getCompletedOrdersAtStore,getCompletedOrdersShipping,completeOrder, getOrdersByUserId, getOrdersHomeDeliveryReady, getOrdersStorePickupgetReady, getOrdersWaitingForConfirmation, deleteOrder,getOrdersShipping,getOrdersStorePickupReady,searchOrder,getOrdersHomeDeliveryShipping,searchOrderAtStoreComplete,searchOrderShippingComplete,searchOrderGetReady,searchOrderShipping,searchOrderGetReadyAtStore,searchOrderReady };
