import React, { useEffect, useState } from 'react';
import { AppstoreFilled, UserOutlined, ProfileFilled, QqOutlined, PrinterFilled, StarFilled, MessageFilled, SignalFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import { getItem } from './utils';
import Header from '../../Components/Header/header';
import AdminProduct from '../../Components/admin/AdminProduct/AdminProduct';
import AdminUser from '../../Components/admin/AdminUser/AdminUser';
import { useSelector } from 'react-redux';
import NewProduct from '../../Components/admin/AdminProduct/NewProduct';
import AdminCategory from '../../Components/admin/AdminCategory/AdminCategory';
import NewCategory from '../../Components/admin/AdminCategory/NewCategory';
import AdminBrand from '../../Components/admin/AdminBrand/AdminBrand';
import NotFoundPage from '../notfoundpage';
import NewBrand from '../../Components/admin/AdminBrand/NewBrand';
import AdminComment from '../../Components/admin/AdminComment/AdminComment';
import Pending from '../../Components/admin/AdminOrder/Pending';
import AtStore from '../../Components/admin/AdminOrder/AtStore';
import Complete from '../../Components/admin/AdminOrder/Complete';
import Shipping from '../../Components/admin/AdminOrder/Shipping';
import NewVoucher from '../../Components/admin/AdminVoucher/NewVoucher';
import AdminVoucher from '../../Components/admin/AdminVoucher/AdminVoucher';
import Cancel from '../../Components/admin/AdminOrder/Cancel';
import Dashboard from '../../Components/admin/AdminDashboard/admindashboard';

const AdminHomePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])
  const [products, setProducts] = useState([]);
  const [keySelected, setKeySelected] = useState('dashboard');

  const renderPage = (key) => {
    switch (key) {
      case 'dashboard':
        return (
          <Dashboard />
        )
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      case 'addProduct':
        return (
          <div><NewProduct /></div>
        )
      case 'categorys':
        return (
          <div><AdminCategory /></div>
        )
      case 'addcategory':
        return (
          <div><NewCategory /></div>
        )
      case 'brands':
        return (
          <div><AdminBrand /></div>
        )
      case 'addbrand':
        return (
          <div><NewBrand /></div>
        )
      case 'comments':
        return (
          <div><AdminComment /></div>
        )
      case 'pending':
        return (
          <div><Pending /></div>
        )
      case 'atStore':
        return (
          <div><AtStore /></div>
        )
      case 'shipping':
        return (
          <div><Shipping /></div>
        )
      case 'success':
        return (
          <div><Complete /></div>
        )
      case 'cancel':
        return (
          <div><Cancel /></div>
        )
      case 'addVoucher':
        return (
          <div><NewVoucher /></div>
        )
      case 'vouchers':
        return (
          <div><AdminVoucher /></div>
        )
      default:
        return <></>
    }
  }



  const items = [

    getItem('Dashboard', 'dashboard', <SignalFilled />),
    getItem('Người dùng', 'users', <UserOutlined />),
    getItem('Sản phẩm', 'sub1', <AppstoreFilled />, [
      getItem('Danh sách sản phẩm', 'products'),
      getItem('Thêm sản phẩm', 'addProduct'),
    ]),
    getItem('Danh mục', 'category', <ProfileFilled />, [
      getItem('Danh sách danh mục', 'categorys'),
      getItem('Thêm danh mục', 'addcategory'),
    ]),
    getItem('Thương hiệu', 'brand', <QqOutlined />, [
      getItem('Danh sách thương hiệu', 'brands'),
      getItem('Thêm thương hiệu', 'addbrand'),
    ]),
    getItem('Bình luận', 'comments', <MessageFilled />),
    getItem('Đơn hàng', 'order', <PrinterFilled />, [
      getItem('Chờ xác nhận', 'pending'),
      getItem('Nhận tại cửa hàng', 'atStore'),
      getItem('Giao tận nơi', 'shipping'),
      getItem('Đã hoàn thành', 'success'),
      getItem('Đã huỷ', 'cancel'),
    ]),
    getItem('Voucher', 'voucher', <StarFilled />, [
      getItem('Danh sách Voucher', 'vouchers'),
      getItem('Thêm Voucher', 'addVoucher'),
    ]),
  ];

  const user = useSelector((state) => state.user)
  if (user && user.role_id == 1) {
    const handleOnClick = ({ key }) => {
      setKeySelected(key)
    }
    return (
      <>
        <Header isHiddenSearch isHiddenCart />
        <div style={{ display: 'flex' }}>
          <Menu
            mode="inline"
            style={{
              width: 256,
              boxShadow: '1px 2px 1px #ccc',
              height: '100vh',
            }}
            items={items}
            onClick={handleOnClick}
          />
          <div style={{ flex: 1, padding: '15px' }}>
            {renderPage(keySelected)}
          </div>
        </div>
      </>);
  } else {
    return (
      <div>
        <NotFoundPage />
      </div>
    );
  }
}

export default AdminHomePage;
