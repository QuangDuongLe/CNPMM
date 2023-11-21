import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import {  message, Upload } from 'antd';
import {
  Button,
  Form,
  Input,
} from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
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

const NewCategory = () => {
  const [form] = Form.useForm();
  const user = useSelector((state)=> state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
};
  const props = {
    name: 'image',
    action: `${process.env.REACT_APP_API_URL}/upload`,
    headers: {
      authorization: 'authorization-text',
    },
    accept: '.jpg, .jpeg, .png',
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Chỉ cho phép tải lên tệp JPG hoặc PNG!');
      }
      return isJpgOrPng;
    }, 
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        const uploadedFilePaths = info.file.response.imageUrl
        console.log('uploadedFilePaths',uploadedFilePaths)
        form.setFieldsValue({ picture: uploadedFilePaths });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/category/addCategory`, values,{headers});
      if (response.data.success) {
        message.success('Thêm danh mục thành công');
        form.resetFields();
      } else {
        message.error('Thêm danh mục thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      message.error('Đã xảy ra lỗi khi thêm danh mục');
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
        label="Tên danh mục"
        rules={[
          {
            required: true,
            message: 'Điền tên của danh mục',
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name="picture"
        label="Hình ảnh"
        rules={[
          {
            required: true,
            message: 'Vui lòng chọn ảnh',
          },
        ]}
      >
       <Upload {...props}>
    <Button icon={<UploadOutlined />}>Ảnh</Button>
  </Upload>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
      </Form>
  )
}
export default NewCategory