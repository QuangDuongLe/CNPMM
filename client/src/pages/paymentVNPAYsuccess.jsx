import React, { useEffect, useState } from 'react';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const PaymentSuccess = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [transactionData, setTransactionData] = useState(null);
    useEffect(() => {
        fetch(`/api/VNPAY/vnpay_return?${params}`) 
            .then(response => response.json())
            .then(data => setTransactionData(data))
            .catch(error => console.error('Lỗi khi lấy dữ liệu từ server:', error));
    }, []);

    const containerStyle = {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    };

    const iconStyle = {
        color: transactionData && transactionData.vnp_ResponseCode === '00' ? 'green' : 'red',
        fontSize: '4rem',
    };

    if (!transactionData) {
        return (
            <div className="container" style={containerStyle}>
                <div style={contentStyle}>
                    <p style={{ fontSize: '2rem' }}>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={containerStyle}>
            <div style={contentStyle}>
                <p style={{ fontSize: '1.5rem' }}>Mã giao dịch: {transactionData.vnp_TransactionNo}</p>
                <p style={{ fontSize: '1.5rem' }}>Nội dung thanh toán: {transactionData.vnp_OrderInfoFormatted}</p>
                <p style={{ fontSize: '1.5rem' }}>Số tiền giao dịch: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transactionData.vnp_Amount / 100)}</p>
                <p style={{ fontSize: '1.5rem' }}>Ngân hàng giao dịch: {transactionData.vnp_BankCode}</p>
                <p style={{ fontSize: '1.5rem' }}>Ngày tạo hoá đơn: {transactionData.vnp_PayDate}</p>
                <Row>
                    {transactionData.vnp_ResponseCode === '00' ? (
                        <CheckCircleOutlined style={iconStyle} />
                    ) : (
                        <CloseCircleOutlined style={iconStyle} />
                    )}
                </Row>
                <p style={{ fontSize: '2.5rem', color: iconStyle.color }}>
                    {transactionData.vnp_ResponseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </p>
            </div>
        </div>
    );
}

export default PaymentSuccess;
