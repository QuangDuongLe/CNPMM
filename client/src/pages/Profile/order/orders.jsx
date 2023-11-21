import React, { useEffect, useState } from 'react';
import { Col, Row, Segmented } from 'antd';
import Tab from './tab';
import Header from '../../../Components/Header/header';


const Orders = () => {
    return (
        <div>
            <Header></Header>
            <br></br>
                <div style={{ width: '100%', padding: '0 10px 0 10px'}}>
                    <Tab />
                </div>
        </div>

    )
}

export default Orders