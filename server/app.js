require('dotenv').config();
const express = require('express');
const app = express();
const connect2DB = require('./config/data');
const routerUser = require('./Router/UserRouter');
const routerUpload = require('./Router/UploadRouter')
const routerProduct = require('./Router/ProductRouter')
const routerBrand = require('./Router/BrandRouter')
const routerCart = require('./Router/CartRouter')
const routerComment = require('./Router/CommentRouter')
const routerOrder = require('./Router/OrderRouter')
const routerVoucher = require('./Router/VoucherRouter')
const routerVNPAY = require('./Router/RouterVNPAY');
const bodyParser = require('body-parser');
const path = require('path')
const routerCategory = require('./Router/CategoryRouter')
const server = require('http').createServer(app);
const cookieParser = require('cookie-parser')
const cors = require('cors');


app.use(cors({
    origin: true, 
    credentials: true, 
  }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routerUpload);
app.use('/api/user', routerUser);
app.use('/api/product', routerProduct);
app.use('/api/category',routerCategory);
app.use('/api/comment',routerComment);
app.use('/api/brand',routerBrand)
app.use('/api/cart',routerCart)
app.use('/api/order',routerOrder)
app.use('/api/VNPAY', routerVNPAY)
app.use('/api/voucher',routerVoucher)


app.use(express.static(path.join(__dirname,'../client/build')))
app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'))
})


connect2DB();
const PORT = process.env.PORT 
server.listen(PORT, () => {
    console.log(`Server is now running on PORT: ${PORT}`);
})