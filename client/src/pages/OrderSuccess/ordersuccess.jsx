import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Row } from 'antd';
import {  WrapperContainer } from './style';

const OrderSuccess = () => {
    

    return (
        <WrapperContainer >
            <Row style={{ alignItems: 'center' }}>
                <CheckCircleOutlined style={{ color: 'green', fontSize: '4rem' }} />
            </Row>
            <p className='notice' >Đặt hàng thành công!</p>
            <p className='content' >Chúng tôi sẽ liên hệ Quý khách để xác nhận đơn hàng trong thời gian sớm nhất! Có thể xem chi tiết đơn hàng ở email hoặc nhấp vào nút dưới</p>
            <Row className='button' style={{display: 'flex', gap: '20px'}}>
                <Button href='/profile' size='large'>Xem chi tiết đơn hàng</Button>
                <Button href='/' style={{background: "#8c52ff", color: '#fff'}} size='large'> Tiếp tục mua hàng
                </Button>
            </Row>
        </WrapperContainer>
    );
}

export default OrderSuccess;
