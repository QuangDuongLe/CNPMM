import React, { useState, useEffect } from "react";
import {  Switch, Table, Image, Upload, Button, message, Modal, Alert, Space} from 'antd';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import { AppstoreOutlined,DeleteOutlined } from '@ant-design/icons';
import './button.css'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Search from "antd/es/input/Search";
import { useSelector } from "react-redux";

import html2canvas from "html2canvas";
import Invoice from "./Invoice";

const TableComplete = () => {
  const handlePrintPDF = async (order) => {
    try {
      setIsPrinting(true);
      const pdfDoc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const canvas = await html2canvas(document.getElementById('invoiceContent'), {
        scale: 3,
      });
      const imgData = canvas.toDataURL('image/png');
      pdfDoc.addImage(imgData, 'PNG', 0, 0, 210, 297, '', 'FAST');
      pdfDoc.setFont('Roboto');
      pdfDoc.save(`order_invoice_${order.orderCode}.pdf`);
      setIsPrinting(false);
    } catch (error) {
      console.error('Error while generating PDF:', error);
      
    }
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
                        {
                          title: 'Đã đổi trả',
                          dataIndex: 'change',
                          render: (change) => (
                            <div>
                              {change.dateChange ? (
                                <div>Đã đổi trả vào ngày {change.dateChange}</div>
                              ) : (
                                <div>Chưa đổi trả</div>
                              )}
                            </div>
                          )
                        },
                        {
                          title: 'Đổi trả',
                          dataIndex: 'change',
                          render: (text, record) => {
                            if (record.change.isHave && record.memory!= undefined ) {
                              return <span style={{ color: '#FF3300' }}>Đã đổi</span>;
                            } else {
                            return (
                              <>
                            <Button style={{color:'#FF3300'}} onClick={() => {
                              setCurrrentProduct(record._id);
                              setChange(true);
                            }}>Đổi</Button>
                            
                            <Modal
                            title="Xác nhận đổi hàng"
                            visible={change}
                            onOk={() => {
                             handleChangeProduct(currrentProductOrder,selectProductOrder._id)
                              setChange(false); 
                            }}
                            onCancel={() => setChange(false)} 
                          >
                          <p>Bạn có chắc chắn muốn đổi sản phẩm  này?</p>
                          </Modal>
                          </>
                            )
                          }
                        }
                      }
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
        title: 'Hoá đơn',
        dataIndex: 'actions',
        render: (text, record) => (
          <Space size="middle">
              <a
              onClick={() => {
                setInvoice(record)
                setInvoiceModalVisible(true);
              }}
            >
              <AppstoreOutlined />
            </a>
            <Modal
                visible={invoiceModalVisible}
                onCancel={() => setInvoiceModalVisible(false)}
                footer={null}
                width = {840}
                >
              <div id="invoiceContent">
              <Invoice order={invoice} style={{ width: '100%' }} />
              </div>
              <Button
                onClick={() => handlePrintPDF(invoice)}
                type="primary"
                style={{ width: '100%', marginTop: '10px' }}
                loading={isPrinting} 
              >
                {isPrinting ? 'Đang In...' : 'In PDF'}
              </Button>
              </Modal>
          </Space>
          
        ),
      },   
    ];
    const user = useSelector((state)=> state.user)
    const headers = {
      token: `Bearers ${user.access_token}`,
  };
  const [isPrinting, setIsPrinting] = useState(false);
    const [currrentProductOrder, setCurrrentProduct] = useState(null); 
    const [change, setChange] = useState(false); 
    const [orderDataAtStore, setOrderAtStore] = useState([]); 
    const [orderDataAtShipping, setOrderShipping] = useState([]);
    const [displayOrdersAtStore, setDisplayOrdersAtStore] = useState(true);
    const [orderModalVisible, setOrderModalVisible] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
    const [selectProductOrder, setProductOrder] = useState(null);
 
    const [searchResultsAtStore, setSearchResultsAtStore] = useState([]);
    const [searchResultsShipping, setSearchResultsShipping] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const handleChangeProduct = async (id,orderId) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/order/changeProduct?id=${id}&orderId=${orderId}`,null,{headers}
        );
        if (response.data.success) {
          axios
        .get(`${process.env.REACT_APP_API_URL}/order/completedAtStore`)
        .then((response) => {
            setOrderAtStore(response.data.data); 
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API: ', error);
        });
        axios
        .get(`${process.env.REACT_APP_API_URL}/order/completedShipping`)
        .then((response) => {
          setOrderShipping(response.data.data); 
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API: ', error);
        });
          message.success('Đã đổi trả thành công');
        } else {
          message.error(response.data.error);
        }
      } catch (error) {
        console.error('Có lỗi xảy ra khi gọi API:', error);
      }
    };
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
        .get(`${process.env.REACT_APP_API_URL}/order/completedAtStore`)
        .then((response) => {
            setOrderAtStore(response.data.data); 
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API: ', error);
        });
    }, []);
    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/order/completedShipping`)
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
  
  export default TableComplete;