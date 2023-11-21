import React, { useState, useEffect } from "react";
import {  Switch, Table, Image, Upload, Button, message, Modal, Alert, Space} from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { AppstoreOutlined,DeleteOutlined } from '@ant-design/icons';
import './button.css'
import Search from "antd/es/input/Search";

const TableCancel = () => {
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
        title: 'Ngày và giờ nhận',
        dataIndex: 'completeDate',
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
    ];
    const [orderDataAtStore, setOrderAtStore] = useState([]); 
    const [orderDataAtShipping, setOrderShipping] = useState([]);
    const [displayOrdersAtStore, setDisplayOrdersAtStore] = useState(true);
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [selectProductOrder, setProductOrder] = useState(null);
    const [searchResultsAtStore, setSearchResultsAtStore] = useState([]);
    const [searchResultsShipping, setSearchResultsShipping] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (query) => {
      setSearchQuery(query);
    };
    useEffect(() => {
      if (searchQuery.trim() !== '') {
        axios.get(`${process.env.REACT_APP_API_URL}/order/searchOrderAtStoreComplete?keyword=${searchQuery}`)
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
        axios.get(`${process.env.REACT_APP_API_URL}/order/searchOrderShippingComplete?keyword=${searchQuery}`)
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
        .get(`${process.env.REACT_APP_API_URL}/order/cancelAtStore`)
        .then((response) => {
            setOrderAtStore(response.data.data); 
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API: ', error);
        });
    }, []);
    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/order/cancelShipping`)
          .then((response) => {
            setOrderShipping(response.data.data); 
          })
          .catch((error) => {
            console.error('Lỗi khi gọi API: ', error);
          });
      }, []);
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
            Nhận tại cửa hàng
          </Button>
          <Button
           className={`memory-button ${displayOrdersAtStore === false ? 'selected' : ''}`}
            onClick={() => toggleDisplayOrders(false)}
          >
            Giao tận nơi
          </Button>
        </div>
        <Table columns={columns} dataSource={searchQuery.trim() === '' ? 
          (displayOrdersAtStore ? orderDataAtStore : orderDataAtShipping) : 
          (displayOrdersAtStore ? searchResultsAtStore : searchResultsShipping)
        } />
      </div>
    );
  };
  
  export default TableCancel;