import React,{useEffect,useState} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {  DatePicker, message, Upload } from 'antd';
import {
  Button,
  Form,
  Input,
  Select
} from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
const {Option} = Select
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 8,
    },
  },
};

const NewVoucher = () => {
  const user = useSelector((state)=> state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
};
  const [form] = Form.useForm();
  
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/voucher/addVoucher`, values,{ headers });
      if (response.data.success) {
        message.success('Thêm voucher thành công');
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi thêm: ' );
    }
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Tên voucher"
        rules={[
          {
            required: true,
            message: 'Điền tên của voucher',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="code"
        label="Mã voucher"
        rules={[
          {
            required: true,
            message: 'Điền mã voucher',
          },
        ]}
      >
      <Input/>
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Số lượng"
        rules={[
          {
            required: true,
            message: 'Điền số lượng',
          },
        ]}
      >
      <Input type='number'/>
      </Form.Item>
      <Form.Item
        name="discount"
        label="Giảm giá/%"
        rules={[
          {
            required: true,
            message: 'Điền tên quốc gia',
          },
        ]}
      >
        <Input type='number'/>
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Ngày bắt đầu"
        rules={[
          {
            required: true,
            message: 'Chọn ngày bắt đầu',
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="endDate"
        label="Ngày kết thúc"
        rules={[
          {
            required: true,
            message: 'Chọn ngày kết thúc',
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
      </Form>
  )
}
export default NewVoucher