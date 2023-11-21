import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { WrapperDashboard } from './style';


function Dashboard() {
    const [productCount, setProductCount] = useState(0);
    const [completedShippingOrders, setCompletedShippingOrders] = useState(0);
    const [completedAtStoreOrders, setCompletedAtStoreOrders] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/getAll`);
                const productsData = res.data.data;
                setProductCount(productsData.length);

                const order1 = await axios.get(`${process.env.REACT_APP_API_URL}/order/completedShipping`);
                setCompletedShippingOrders(order1.data.data.length);

                const order2 = await axios.get(`${process.env.REACT_APP_API_URL}/order/completedAtStore`);
                setCompletedAtStoreOrders(order2.data.data.length);

            } catch (error) {
                console.error('Lỗi:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <WrapperDashboard>
            <div className='sum-box'>
                <div className='sum-box-item'>
                    <span className='sum-title'>Số lượng sản phẩm</span>
                    <span className='sum-quantity'>{productCount}</span>
                </div>
                <div className='sum-box-item'>
                    <span className='sum-title'>Số đơn hoàn thành</span>
                    <span className='sum-quantity'>{completedShippingOrders + completedAtStoreOrders}</span>
                </div>
            </div>
        </WrapperDashboard>
    );
}

export default Dashboard;
