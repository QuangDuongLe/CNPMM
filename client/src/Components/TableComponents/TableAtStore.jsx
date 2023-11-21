import React, { useState, useEffect } from "react";
import {  Switch, Table, Image, Upload, Button, message, Modal, Alert, Space} from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { AppstoreOutlined,DeleteOutlined } from '@ant-design/icons';
import './button.css'
import { useSelector } from "react-redux";
import Search from "antd/es/input/Search";

const TableAtStore = () => {
  const user = useSelector((state)=> state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
};
    const columns = [
      {
        title: 'Mã đơn hàng',
        dataIndex: 'orderCode',
      },
      {
        title: 'Tên người đặt',
        dataIndex: 'userName',
      },
      {
        title: 'Email người đặt',
        dataIndex: 'userEmail',
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'userPhone',
      },
      {
        title: 'Địa chỉ giao hàng',
        dataIndex: 'address',
      },
      {
        title: 'Hình thức giao hàng',
        dataIndex: 'shippingMethod',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
      },
      {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMethod',
      },
      {
        title: 'Voucher áp dụng',
        dataIndex: 'voucher',
        render: voucher => voucher?.code
      },
      {
        title: 'Ngày và giờ đặt',
        dataIndex: 'createDate',
      },
      {
        title: 'Sản phẩm',
        dataIndex: 'items',
        render: (text, record) => (
          <Space size="middle">
            <a
              onClick={() => {
                setProductOrder(record);
                setOrderModalVisible(true);
              }}
            >
              <AppstoreOutlined />
            </a>
            <Modal
                title="Danh sách sản phẩm đã đặt"
                visible={orderModalVisible}
                onCancel={() => setOrderModalVisible(false)}
                footer={null}
                width={1000}
                >
                {selectProductOrder && (
                    <Table
                    dataSource={selectProductOrder.items}
                    columns={[
                        {
                        title: 'Hình ảnh',
                        dataIndex: 'pictures',
                        render: pictures => (
                            <img src={pictures} alt="Hình ảnh" style={{ width: '100px', height: '100px' }} />
                        ),
                        },
                        {
                        title: 'Tên sản phẩm',
                        dataIndex: 'product',
                        render: product => product.name,
                        },
                        {
                        title: 'Bộ nhớ',
                        dataIndex: 'memory',
                        },
                        {
                        title: 'Màu',
                        dataIndex: 'color',
                        },
                        {
                            title: 'Số lượng',
                            dataIndex: 'quantity',
                        },
                        {
                        title: 'Đơn giá',
                        dataIndex: 'price',
                        render: price => (
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
                        ),
                        },
                        {
                        title: 'Thành tiền',
                        dataIndex: 'subtotal',
                        render: subtotal => (
                            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)
                        ),
                        },
                        {
                            title: 'Bảo hành',
                            dataIndex: 'product',
                            render: product => <div>{product.warrantyPeriod} tháng</div>
                        },
                    ]}
                    />
                )}
                   {selectProductOrder?.voucher && selectProductOrder?.voucher.discount && (
                         <div style={{ display: 'flex', justifyContent: 'right' }}>
                        <span>Có áp dụng giảm giá: {selectProductOrder?.voucher.discount * 100} %</span>
                        <br />
                        
                      </div>
                    )}
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <span>Số tiền phải trả: &nbsp; </span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#FF3300' }}>
                        {selectProductOrder &&
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectProductOrder.totalPay)}
                    </span>
                </div>
            </Modal>
          </Space>
        ),
      },
      {
        render: (text, record) => [
            <Button
            style={{ color: 'blue' }}
            onClick={() => {
              setCurrentOrderId(record._id);
              if (record.status === 'Đơn hàng đang được chuẩn bị') {
                setAcceptOrder(true);
              } else if (record.status === 'Đơn hàng sẵn sàng') {
                setCompleteOrder(true);
              }
            }}
          >
            {record.status === 'Đơn hàng đang được chuẩn bị' ? 'Xác nhận' : 'Hoàn thành'}
          </Button>

           ,<div style={{width:"100px",height:"10px"}}>&nbsp;</div>,
          <Button style={{color:'#FF3300'}} onClick={() => {
            setCurrentOrderId(record._id);
            setCancelOrder(true);
          }}>Xoá</Button>
          ,  
          <Modal
          title="Xác nhận xoá"
          visible={cancelOrder}
          onOk={() => {
            handleCancelOrder(currentOrderId)
            setCancelOrder(false); 
          }}
          onCancel={() => setCancelOrder(false)} 
        >
        <p>Bạn có chắc chắn muốn xoá này?</p>
        </Modal>,
        <Modal
              title="Xác nhận đơn hàng"
              visible={acceptOrder}
              onOk={() => {
                handleConfirmOrder(currentOrderId)
                setAcceptOrder(false); 
              }}
              onCancel={() => setAcceptOrder(false)} 
            >
            <p>Bạn có chắc chắn muốn xác nhận đơn hàng này</p>
            </Modal>,
         <Modal
         title="Hoàn thành đơn hàng"
         visible={completeOrder}
         onOk={() => {
           handleCompleteOrder(currentOrderId)
           setCompleteOrder(false); 
         }}
         onCancel={() => setCompleteOrder(false)} 
       >
       <p>Bạn có chắc chắn muốn hoàn thành đơn hàng này</p>
       </Modal>,   
        ]
      }      
    ];
    const [orderDataGetReady, setOrderGetReady] = useState([]); 
    const [orderDataReady, setOrderReady] = useState([]);
    const [displayOrdersAtStore, setDisplayOrdersAtStore] = useState(true);
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [selectProductOrder, setProductOrder] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [cancelOrder, setCancelOrder] = useState(false);
    const [acceptOrder, setAcceptOrder] = useState(false);
    const [completeOrder, setCompleteOrder] = useState(false);
    const [searchResultsAtStore, setSearchResultsAtStore] = useState([]);
    const [searchResultsShipping, setSearchResultsShipping] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (query) => {
      setSearchQuery(query);
    };
    useEffect(() => {
      if (searchQuery.trim() !== '') {
        axios.get(`${process.env.REACT_APP_API_URL}/order/searchOrderGetReadyAtStore?keyword=${searchQuery}`)
          .then((response) => {
            setSearchResultsAtStore(response.data.data);
          })
          .catch((error) => {
            console.error('Error searching products:', error);
          });
      } else {
        setSearchResultsAtStore([]);
      }
    }, [searchQuery]);
    useEffect(() => {
      if (searchQuery.trim() !== '') {
        axios.get(`${process.env.REACT_APP_API_URL}/order/searchOrderReady?keyword=${searchQuery}`)
          .then((response) => {
            setSearchResultsShipping(response.data.data);
          })
          .catch((error) => {
            console.error('Error searching products:', error);
          });
      } else {
        setSearchResultsShipping([]);
      }
    }, [searchQuery]);
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/order/store-pickup-getready`)
        .then((response) => {
            setOrderGetReady(response.data.data); 
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API: ', error);
        });
    }, []);
    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/order/store-pickup-ready`)
          .then((response) => {
            setOrderReady(response.data.data); 
          })
          .catch((error) => {
            console.error('Lỗi khi gọi API: ', error);
          });
      }, []);
    const handleCancelOrder = (orderId) => {
        axios
          .delete(`${process.env.REACT_APP_API_URL}/order/delete/${orderId}`,{ headers })
          .then((response) => {
            const updatedOrderAtStore = orderDataGetReady.filter(order => order._id !== orderId);
            const updatedOrderShipping = orderDataReady.filter(order => order._id !== orderId);
            message.success('Xoá đơn hàng thành công')
            setOrderGetReady(updatedOrderAtStore);
            setOrderReady(updatedOrderShipping);
          })
          .catch((error) => {
            console.error('Lỗi khi Xoá đơn hàng: ', error);
          });
      };
      const handleConfirmOrder = async (orderId ) => {
        try {
          const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/updateOrder/${orderId}`, { newStatus: 'Đơn hàng sẵn sàng' },{headers});
          if (response.data.success) {
            const updatedOrderAtStore = orderDataGetReady.filter(order => order._id !== orderId);  
            message.success('Đơn hàng sẵn sàng thành công');
            setOrderGetReady(updatedOrderAtStore);
            axios
            .get(`${process.env.REACT_APP_API_URL}/order/store-pickup-ready`)
            .then((response) => {
              setOrderReady(response.data.data); 
            })
            .catch((error) => {
              console.error('Lỗi khi gọi API: ', error);
            });
          } else {
            message.error('Xác nhận đơn hàng không thành công');
          }
        } catch (error) {
          console.error('Lỗi khi xác nhận đơn hàng:', error);
          message.error('Đã xảy ra lỗi khi xác nhận đơn hàng');
        }
      }; 
      const handleCompleteOrder = async (orderId ) => {
        try {
          const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/completeOrder/${orderId}`,null, { headers });
          if (response.data.success) {
            const updatedOrderAtStore = orderDataReady.filter(order => order._id !== orderId);  
            message.success('Đơn hàng đã hoàn thành');
            setOrderReady(updatedOrderAtStore); 
          }
        } catch (error) {
          console.error('Lỗi khi xác nhận đơn hàng:', error);
          message.error('Đã xảy ra lỗi khi xác nhận đơn hàng');
        }
      }; 
      const toggleDisplayOrders = (atStore) => {
        setDisplayOrdersAtStore(atStore);
      };
    return (
        <div>
             <div>
        <Search
          style={{ width: '50%', marginBottom: '10px'  }}
          placeholder="Tìm kiếm đơn hàng"
          onSearch={handleSearch}
          enterButton
        />
      </div>
        <div>
          <Button
           className={`memory-button ${displayOrdersAtStore === true ? 'selected' : ''}`}
            style={{ marginRight: '10px' }}
            onClick={() => toggleDisplayOrders(true)}
          >
            Đang chuẩn bị
          </Button>
          <Button
           className={`memory-button ${displayOrdersAtStore === false ? 'selected' : ''}`}
            onClick={() => toggleDisplayOrders(false)}
          >
            Đã sẵn sàng
          </Button>
        </div>
        <Table columns={columns} dataSource={searchQuery.trim() === '' ? 
          (displayOrdersAtStore ? orderDataGetReady : orderDataReady) : 
          (displayOrdersAtStore ? searchResultsAtStore : searchResultsShipping)
        } />
      </div>
    );
  };
  
  export default TableAtStore;