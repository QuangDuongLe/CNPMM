import AdminHomePage from "../pages/Admin/AdminPage";
import HomePage from "../pages/HomePage/homepages";
import Profilepage from "../pages/Profile/profilepage";
import NotFoundPage from "../pages/notfoundpage";
import ProductDetail from "../pages/ProductDetail/productdetail";
import CartPage from "../pages/CartPage/CartPage";
import FilterProductPage from "../pages/ProductTypePage/productfilterpage";
import PaymentInfo from "../pages/PaymentPage/paymentinfo";
import PaymentSuccess from "../pages/paymentVNPAYsuccess";
import Orders from "../pages/Profile/order/orders";
import OrderDetail from "../pages/Profile/orderdetail";
import WarrantySearch from "../Components/TableComponents/Warranty";
import OrderSuccess from "../pages/OrderSuccess/ordersuccess";


export const routes = [
    {
        path:'/',
        page: HomePage,
    },
    {
        path:'*',
        page: NotFoundPage
    },
    {
        path:'/admin',
        page: AdminHomePage
    },
    {
        path:'/profile',
        page: Profilepage,
        isShowHeader : true
    },
    {
        path:'/pdd',
        page: ProductDetail,
        isShowHeader: true
    },
    {
        path:'/product/:productName/:memory',
        page: ProductDetail,
        isShowHeader: true
    },
    {
        path:'/cart',
        page: CartPage,
        isShowHeader: false
    },
    {
        path:'/lowtoHigh',
        page: FilterProductPage,
    },
    {
        path:'/lowtoHigh/:nameCategory/:nameBrand',
        page: FilterProductPage,
    },
    {
        path:'/lowtoHigh/:nameCategory',
        page: FilterProductPage,
    },
    {
        path:'/highToLow/:nameCategory/:nameBrand',
        page: FilterProductPage,
    },
    {
        path:'/highToLow/:nameCategory',
        page: FilterProductPage,
    },
    {
        path:'/highToLow',
        page: FilterProductPage,
    },
    {
        path:'/payment-infor',
        page: PaymentInfo
    },
    {
        path:'/order-success',
        page: OrderSuccess,
    },
    {
        path:'/vnpay_return',
        page: PaymentSuccess,
    },
    {
        path:'/orders',
        page: Orders    
    },
    {
        path:'/order-detail/:orderCode',
        page: OrderDetail
    },
    {
        path:'/warranty',
        page: WarrantySearch
    }
]