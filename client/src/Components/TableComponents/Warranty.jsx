import { Button, Input, Radio, Space } from 'antd';
import React, { useState } from 'react';
import { WrapperWarranty } from './style';
import Loading from '../LoadingComponents/Loading';
import axios from 'axios';
import moment from 'moment';
import { ArrowLeftOutlined } from "@ant-design/icons";
const WarrantySearch = () => {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(1);
    const [data, setData] = useState(null);
    const [sdt, setSdt] = useState(null);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const tableCellStyle = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/order/checkBH`, { phone: sdt });
            setData(response.data.products);
        } catch (error) {
            console.error('Error calling API:', error);
        } finally {
            setLoading(false);
        }
    };
    const goBack = () => {
        window.history.back();
      };
    
    return (
        <WrapperWarranty>
             <div className="btn-back">
          <a onClick={goBack}>
            <ArrowLeftOutlined /> Quay lại
          </a>
        </div>
            <div className='title'>
                <p>Tra cứu thông tin bảo hành</p>
            </div>
            <div className='radio-box'>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>Tra cứu theo số điện thoại</Radio>
                </Radio.Group>
            </div>
            <div className='input-box'>
                <Space.Compact style={{ width: '60%' }}>
                    <Input
                        placeholder="Vui lòng nhập số điện thoại để tra cứu"
                        value={sdt}
                        onChange={(e) => setSdt(e.target.value)}
                    />
                    <Button type="primary" onClick={handleSearch} disabled={loading}>
                        KIỂM TRA
                    </Button>
                </Space.Compact>
            </div>
            <div className='table'>
                <Loading isLoading={loading}>
                    <table style={{ fontSize: '15px', width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableCellStyle}>Tên sản phẩm</th>
                                <th style={tableCellStyle}>Bộ nhớ</th>
                                <th style={tableCellStyle}>Màu</th>
                                <th style={tableCellStyle}>Số lượng</th>
                                <th style={tableCellStyle}>Hạn bảo hành</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((item, index) => (
                                <tr key={index}>
                                    <td style={tableCellStyle}>{item.product.name}</td>
                                    <td style={tableCellStyle}>{item.memory}</td>
                                    <td style={tableCellStyle}>{item.color}</td>
                                    <td style={tableCellStyle}>{item.quantity}</td>
                                    <td style={tableCellStyle}> {item.change.dateChange ? (
                                                                    moment(item.change.dateChange, 'DD/MM/YYYY HH:mm:ss')
                                                                        .add(item.product.warrantyPeriod, 'months')
                                                                        .format('DD-MM-YYYY')
                                                                ) : (
                                                                    moment(item.completeDate, 'DD/MM/YYYY HH:mm:ss')
                                                                        .add(item.product.warrantyPeriod, 'months')
                                                                        .format('DD-MM-YYYY')
                                                                )}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Loading>
            </div>
        </WrapperWarranty>
    );
};

export default WarrantySearch;
