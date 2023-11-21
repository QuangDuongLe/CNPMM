import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBRow,
    MDBInput,
} from 'mdb-react-ui-kit';
import { PageWrapper, WrapperPaymentInfo } from "./style";
import { Button, Cascader, Col, Row, Modal, FloatButton, message } from "antd";
import Header from "../../Components/Header/header";
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";

const PaymentInfo = () => {
    const user1 = useSelector((state) => state.user)
    const [total, setTotal] = useState(0);
    const calculateTotalPrice = (cartData) => {
        return cartData.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };
    const [order, setOrder] = useState(
        {
            paymentMethod: 'Thanh toán khi nhận hàng',
            shippingMethod: 'Giao tận nơi'
        }
    );
    useEffect(() => {
        setOrder(prevOder => ({
            ...prevOder,
            userName: user1.fullName,
            userEmail: user1.email,
            address: user1.addRess,
            userPhone: user1.phone_number,
        }));
    }, [user1]);

    const addOrder = event => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/order/addOrder/${user1._id}`, order)
            .then((response) => {
                window.location.href = `/order-success`
            })
            .catch((error) => {
                message.error('Không có sản phẩm nào!');
            });
    };

    const goBack = () => {
        window.history.back();
    };


    const [selectedPayment, setSelectedPayment] = useState('atStore');
    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
        if (e.target.value === 'atStore') {
            setOrder((prevOrder) => ({
                ...prevOrder,
                paymentMethod: 'Thanh toán khi nhận hàng',
            }));
        } else if (e.target.value === 'vnpay') {
            setOrder((prevOrder) => ({
                ...prevOrder,
                paymentMethod: 'VNPAY',
            }));
            const paymentData = {
                amount: totalVoucher || total,
                language: '',
                bankCode: '',
                orderinfo: `${user1.fullName} thanh toán, mã hoá đơn là: `
            };
            axios.post(`${process.env.REACT_APP_API_URL}/VNPAY/create_payment_url`, paymentData)
                .then(response => {
                    window.open(response.data.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    const onChange = event => {
        event.preventDefault();
        setOrder({ ...order, [event.target.name]: event.target.value })
    }
    const [deliveryOption, setDeliveryOption] = useState('homeDelivery');


    const handleRadioChange = (e) => {
        setDeliveryOption(e.target.value);
        if (e.target.value === 'homeDelivery') {
            setOrder((prevOrder) => ({
                ...prevOrder,
                shippingMethod: 'Giao tận nơi',
                address: user1.addRess,
            }));
        }
    };

    const pickStore = (value) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            shippingMethod: 'Nhận tại cửa hàng',
            address: value[0],
        }));
    };
    const options = [
        {
            value: 'Chi nhánh 1, Số 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
            label: 'Chi nhánh 1, Số 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
        },
        {
            value: 'Chi nhánh 2,Hà Nội',
            label: 'Hà Nội',
        },
    ];
    useEffect(() => {
        if (user1 && user1._id) {
            axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user1._id}`)
                .then((response) => {
                    const cartData = response.data.data;
                    setData(cartData);
                    const totalPrice = calculateTotalPrice(cartData);
                    setTotal(totalPrice);
                    setOrder(prevOder => ({
                        ...prevOder,
                        subTotal: totalPrice,
                        totalPay: totalPrice
                    }));
                })
                .catch((error) => {
                    console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
                });
        }
    }, [user1]);
    const [data, setData] = useState(null);
    const [vouchercode, setVoucherCode] = useState('');
    const [totalVoucher, settotalVoucher] = useState(null);
    const checkVoucher = (data) => {
        axios.post(`${process.env.REACT_APP_API_URL}/voucher/useVoucher`, data)
            .then((response) => {
                if (response.data.success) {
                    const voucher = response.data.data
                    setOrder(prevOder => ({
                        ...prevOder,
                        totalPay: total - (total * voucher.discount),
                        vouchercode: voucher.code
                    }));
                    settotalVoucher(total - (total * voucher.discount))
                    message.success('Áp dụng voucher thành công')
                } else {
                    message.error(response.data.error);
                }
            })
            .catch((error) => {
                message.error('Mã voucher sai');
            });
    };
    const isSmallScreen = window.innerWidth <= 500;

    return (
        <PageWrapper>
            <div className="container">
                <WrapperPaymentInfo>
                    <div className="nav">
                        <button className="btn-back" onClick={goBack}>
                            <ArrowLeftOutlined /> Quay lại
                        </button>
                        <div className="nav__item2">
                            <span>Thanh toán</span>
                        </div>
                    </div>
                    <form onSubmit={addOrder}>
                        <div className="block-box">

                            <div className="view-list">
                                <div className="view-list__wrapper">
                                    {data && data.map((item) => (
                                        <div className="item" key={item.product._id}>
                                            <img className='item__img' src={item.pictures} alt={item.product.name} />
                                            <div className="item-info">
                                                <div className="item-name">
                                                    <span>{item.product.name} - {item.memory}</span>
                                                    <span>{item.color}</span>
                                                </div>
                                                <div className="item-price">
                                                    <div>
                                                        <div className="box-info__box-price">
                                                            <span className="product__price--show">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(item.price)}</span>
                                                            {item.productVariant.oldPrice && (
                                                                <span className="product__price--through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(item.productVariant.oldPrice)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span>Số lượng : &nbsp;
                                                        <span style={{ color: 'red' }}>{item.quantity}</span>
                                                    </span>
                                                    <span>Bảo hành : &nbsp;
                                                        <span style={{ color: 'red' }}>{item.product.warrantyPeriod} tháng</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr></hr>
                            <div className="block-customer">
                                <p>Thông tin khách hàng</p>
                                <div className="cus-inf">
                                    <div className="cus-infor" >
                                        <MDBInput wrapperClass='mb-4' label='Họ và tên' name="userName" value={order.userName} onChange={onChange} type='text' tabIndex="1" />
                                    </div>
                                    <div className="cus-infor">
                                        <MDBInput wrapperClass='mb-4' label='Số điện thoại' name="userPhone" value={order.userPhone} onChange={onChange} type='text' tabIndex="3" />
                                    </div>
                                </div>
                                <MDBInput wrapperClass='mb-4' label='Email' name="userEmail" value={order.userEmail} onChange={onChange} type='email' tabIndex="4" />
                                <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }} className="picking-address">
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="homeDelivery"
                                            checked={deliveryOption === 'homeDelivery'}
                                            onChange={handleRadioChange}
                                        />
                                        <label>&nbsp;Giao tận nơi</label>
                                        {deliveryOption === 'homeDelivery' && (
                                            <MDBInput style={{ marginTop: '10px' }} wrapperClass='mb-4' label='Địa chỉ' name="address" value={order.address} onChange={onChange} type='text' tabIndex="2" />
                                        )}
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="storePickup"
                                            checked={deliveryOption === 'storePickup'}
                                            onChange={handleRadioChange}
                                        />
                                        <label>&nbsp;Nhận tại cửa hàng</label>
                                        {deliveryOption === 'storePickup' && (
                                            <div>
                                                <Cascader
                                                    className="cascader"
                                                    options={options}
                                                    onChange={pickStore}
                                                    placeholder="Hãy chọn địa chỉ cửa hàng"
                                                    dropdownHeight={20}
                                                    dropdownRender={(menu) => (
                                                        <div
                                                            style={{
                                                                width: isSmallScreen ? '300px' : '100%', // Sử dụng điều kiện media để thiết lập width
                                                                ...(isSmallScreen && { overflowX: 'auto' }),
                                                            }}
                                                        >
                                                            {menu}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        <br></br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="info-payment">
                            <div className="block-promotion">
                                <div className="block-promotion-input" style={{ width: '75%' }}>
                                    <MDBInput
                                        wrapperClass='mb-4'
                                        label='Mã giảm giá'
                                        placeholder="Hãy điền mã giảm giá"
                                        name="vouchercode"
                                        value={vouchercode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        type='text'
                                        style={{ width: '100%' }}
                                        tabIndex="5"
                                    />
                                </div>
                                <div className="button-vou">
                                    <Button
                                        size='middle'
                                        className="button__voucher"
                                        onClick={() => checkVoucher({ code: vouchercode })}
                                    >
                                        Áp dụng
                                    </Button>

                                </div>
                            </div>
                            <div className="info-quote">
                                <div className="info-quote__block">
                                    <div className="quote-block__item">
                                        <p className="quote-block__title">Tiền hàng (Tạm tính) </p>
                                        <p className="quote-block__value"> <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(total)}</span></p>
                                    </div>
                                    <div className="quote-block__item">
                                        <p className="quote-block__title">Phí vận chuyển </p>
                                        <p className="quote-block__value">Miễn phí</p>
                                    </div>
                                </div>
                                <div className="info-quote__bottom">
                                    <p className="quote-bottom__title">Tổng tiền </p>
                                    <p className="quote-bottom__value">
                                        {totalVoucher ? (
                                            <del style={{ fontSize: '17px' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)} <br />
                                            </del>
                                        ) : (
                                            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                            </span>
                                        )}
                                        {totalVoucher && (
                                            <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#FF3300' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalVoucher)}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="payment-quote">
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="atStore"
                                        checked={selectedPayment === 'atStore'}
                                        onChange={handlePaymentChange}
                                    />
                                    &nbsp; Thanh toán khi nhận hàng
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="vnpay"
                                        checked={selectedPayment === 'vnpay'}
                                        onChange={handlePaymentChange}
                                    />
                                    &nbsp; VNPAY  <img src="data:image/png;base64,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" alt="Hình ảnh VNPAY" style={{ width: '100px', height: '100px' }} />
                                </label>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="bottom-bar">
                            <div className="btn-submit">
                                <button className="btn-next" type="submit">Đặt hàng</button>
                            </div>
                        </div>
                    </form>
                </WrapperPaymentInfo>
            </div>
            <FloatButton.BackTop />
        </PageWrapper >
    )
}

export default PaymentInfo;