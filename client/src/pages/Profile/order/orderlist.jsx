import React, { useEffect, useState } from 'react';
import { Button, Modal, Pagination, message } from 'antd';
import { MDBModalContent, MDBModalDialog } from 'mdb-react-ui-kit';
import OrderDetail from '../orderdetail';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { WrapperList } from './style';
import Loading from '../../../Components/LoadingComponents/Loading';

const OrderList = ({ status }) => {
  const user = useSelector((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startItem = (currentPage - 1) * itemsPerPage;
  const endItem = currentPage * itemsPerPage;

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [completeOrder, setCompleteOrder] = useState(false);
  const [currentComplete, setCurrentComplete] = useState(null);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/order/user/${user._id}?status=${status}`)
      .then((response) => {
     
          setOrders(response.data.data);
          setLoading(false);
      
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
        setLoading(false);
      });
  }, [user,status]);
  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/completeOrderUser/${orderId}?userId=${user._id}`);
      if (response.data.success) {
        axios
          .get(`${process.env.REACT_APP_API_URL}/order/user/${user._id}?status=${status}`)
          .then((response) => {
            setOrders(response.data.data);
          })
          .catch((error) => {
            console.error('Lỗi khi gọi API: ', error);
          });

        message.success('Đơn hàng đã hoàn thành');
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận đơn hàng:', error);
      message.error('Đã xảy ra lỗi khi xác nhận đơn hàng');
    }
  };
  return (
    <WrapperList>
      <Loading isLoading={loading}>
      {orders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
          <img src='https://res.cloudinary.com/doq4spvys/image/upload/v1698910439/zquwpxhn3lbxhul7qj0c.png' width={'200px'} height={'200px'}></img>
          <p style={{ fontSize: '18px' }}>Bạn không có đơn hàng nào.</p>
          <Button size='large' style={{ color: '#8c52ff' }}>
            <NavLink to={`/cart`}>Đến giỏ hàng</NavLink>
          </Button>
        </div>) : (
        orders.map((order) => (
          <div className='has-container' >
            <div className='pre-order'>
              <div className='state'>
                <div>Mã đơn hàng:&nbsp;<span>{order.orderCode}</span></div>
                <div>Trạng thái đơn hàng:&nbsp;<span>{order.status}</span></div>
              </div>
              {order.items.length > 0 && (
                <div className='pd-info'>
                  <div className='order-img'>
                    <img className='img-item' src={order.items[0].pictures} loading='lazy'></img>
                  </div>
                  <div className='order-info'>
                    <span style={{ fontWeight: 500 }}>{order.items[0].product.name} {order.items[0].memory}</span>
                    <div className='props'>
                      <div className='type' style={{ flex: 1 }}>
                        <p style={{ margin: 0 }}>Phân loại:&nbsp;<span>{order.items[0].color}</span></p>
                        <p style={{ margin: 0 }}>x{order.items[0].quantity}</p>
                      </div>
                      <div className='price' >
                        <span style={{ color: '#ff3300' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.items[0]?.price)}
                        </span>
                        <span style={{ textDecoration: 'line-through' }}>
                          {order.items[0].productVariant.oldPrice
                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.items[0].productVariant.oldPrice)
                            : null
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className='total'>
                  <div>
                    <span>Số lượng hàng:&nbsp;
                      <span style={{ color: '#ff3300' }}>{order.items.length}</span>
                    </span>
                  </div>
                  <div>
                    <span>Thành tiền:&nbsp;
                      <span style={{ color: '#ff3300' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPay)}</span>
                    </span>
                  </div>
                <div className='btn-order'>
                  {order.status === 'Đơn hàng đang được giao' && (
                    <Button
                      style={{ background: '#8c52ff', color: '#fff' }}
                      onClick={() => {
                        setCompleteOrder(true);
                        setCurrentComplete(order.orderCode);
                      }}
                    >
                      Đã nhận được hàng
                    </Button>
                  )}
                  <div>
                    <NavLink to={`/order-detail/${order.orderCode}`}>
                      <Button style={{ border: '1px solid #8c52ff', color: '#8c52ff' }}>
                        {order.status === 'Đã hoàn thành' ? 'Xem chi tiết/Đánh giá' : 'Xem chi tiết'}
                      </Button>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              title="Hoàn thành đơn hàng"
              visible={completeOrder}
              onOk={() => {
                handleCompleteOrder(currentComplete)
                setCompleteOrder(false);
              }}
              onCancel={() => setCompleteOrder(false)}
            >
              <p>Bạn có chắc chắn muốn hoàn thành đơn hàng này</p>
            </Modal>
          </div>
        ))
      )}
        </Loading>
      <div className="pagination">
        <Pagination
          current={currentPage}
          // total={orders.length}
          // defaultPageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      </div>
    </WrapperList>
  )
}

export default OrderList