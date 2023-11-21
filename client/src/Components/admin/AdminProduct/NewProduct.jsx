import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Alert
} from 'antd';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

const { Option } = Select;
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

const NewProduct = () => {
  const user = useSelector((state) => state.user)
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formProperties, setFormProperties] = useState([]);
  const { nameCategory } = useParams();

  const props = {
    name: 'images',
    action: `${process.env.REACT_APP_API_URL}/uploads`,
    headers: {
      authorization: 'authorization-text',
    },
    accept: '.jpg, .jpeg, .png',
    multiple: true,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Chỉ cho phép tải lên tệp JPG hoặc PNG!');
      }
      return isJpgOrPng;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        const uploadedFilePaths = info.fileList
          .filter((file) => file.status === 'done')
          .map((file) => file.response.imageUrls);
        const allImageUrls = [].concat(...uploadedFilePaths);
        console.log('')
        form.setFieldsValue({ thumnails: allImageUrls });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  useEffect(() => {
    if (categories) {
      const category = categories.find((cat) => cat.name === nameCategory);
      if (category) {
        const categoryId = category._id;
        fetchBrandsByCategory(categoryId);
      }
    }
  }, [categories, nameCategory]);


  const fetchBrandsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}`);
      setBrands(response.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thương hiệu theo danh mục:', error);
    }
  };

  const handlePropertyChange = (propertyKey, value) => {
    setFormProperties({
      ...formProperties,
      [propertyKey]: value,
    });
  };
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`)
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);


  const renderAttributes = () => {
    if (selectedCategory === 'Điện thoại') {
      return (
        <>
          <Form.Item
            label="Mặt kính cảm ứng"
            name="matkinh"
            rules={[
              { required: true, message: 'Vui lòng điền Mặt kính cảm ứng' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Mặt kính cảm ứng', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Công nghệ màn hình"
            name="cnmh"
            rules={[
              { required: true, message: 'Vui lòng điền Công nghệ màn hình' },

            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Công nghệ màn hình', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Độ phân giải màn hình"
            name="phangiaimh"
            rules={[
              { required: true, message: 'Vui lòng điền Độ phân giải màn hình' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Camera sau', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Màn hình rộng"
            name="mhrong"
            rules={[
              { required: true, message: 'Vui lòng điền Màn hình rộng' },

            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Màn hình rộng', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Độ sáng tối đa"
            name="dsmax"
            rules={[
              { required: true, message: 'Vui lòng điền Độ sáng tối đa' },

            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Độ sáng tối đa', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Độ phân giải"
            name="backcampg"
            rules={[
              { required: true, message: 'Vui lòng điền Độ phân giải' },

            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Độ phân giải (BC)', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Quay phim"
            name="quayfilm"
            rules={[
              { required: true, message: 'Vui lòng điền Quay phim' },

            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Quay phim', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Tính năng (BC)"
            name="tinhnangbc"
            rules={[
              { required: true, message: 'Vui lòng điền Tính năng' },
            ]}
          >
           <ReactQuill
            theme="snow"
            placeholder="Nhập mô tả ở đây..."
            onChange={(content, delta, source, editor) => {
    
              handlePropertyChange('Tính năng (BC)', content);
            }}
          />
          </Form.Item>
          <Form.Item
            label="Độ phân giải"
            name="frontcampg"
            rules={[
              { required: true, message: 'Vui lòng điền Độ phân giải' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Độ phân giải (FC)', e.target.value)} />
          </Form.Item>
            <Form.Item
            label="Tính năng (FC)"
            name="tinhnangfc"
            rules={[
              { required: true, message: 'Vui lòng điền Tính năng' },
            ]}
          >
               <ReactQuill
            theme="snow"
            placeholder="Nhập mô tả ở đây..."
            onChange={(content, delta, source, editor) => {
           
              handlePropertyChange('Tính năng (FC)', content);
            }}
          />
          </Form.Item>
          <Form.Item
            label="Hệ điều hành"
            name="os"
            rules={[
              { required: true, message: 'Vui lòng điền Hệ điều hành' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Hệ điều hành', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Chip xử lý (CPU)"
            name="chipcpu"
            rules={[
              { required: true, message: 'Vui lòng điền Chip xử lý (CPU)' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Chip xử lý (CPU)', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Tốc độ CPU"
            name="cpuspd"
            rules={[
              { required: true, message: 'Vui lòng điền Tốc độ CPU' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Tốc độ CPU', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Chip đồ họa (GPU)"
            name="chipgpu"
            rules={[
              { required: true, message: 'Vui lòng điền Chip đồ họa (GPU)' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Chip đồ họa (GPU)', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="RAM"
            name="ram"
            rules={[
              { required: true, message: 'Vui lòng điền RAM' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('RAM', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Dung lượng còn lại (khả dụng)"
            name="avrom"
            rules={[
              { required: true, message: 'Vui lòng điền Dung lượng còn lại (khả dụng)' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Dung lượng còn lại (khả dụng)', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thẻ nhớ"
            name="thenho"
            rules={[
              { required: true, message: 'Vui lòng điền Thẻ nhớ ' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Thẻ nhớ', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Danh bạ"
            name="danhba"
            rules={[
              { required: true, message: 'Vui lòng điền Danh bạ' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Danh bạ', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Mạng di động"
            name="network"
            rules={[
              { required: true, message: 'Vui lòng điền Mạng di động' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Mạng di động', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="SIM"
            name="SIM"
            rules={[
              { required: true, message: 'Vui lòng điền SIM' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('SIM', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Wifi"
            name="Wifi"
            rules={[
              { required: true, message: 'Vui lòng điền Wifi' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Wifi', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="GPS"
            name="GPS"
            rules={[
              { required: true, message: 'Vui lòng điền GPS' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('GPS', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Bluetooth"
            name="Bluetooth"
            rules={[
              { required: true, message: 'Vui lòng điền Bluetooth' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Bluetooth', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Cổng kết nối/sạc"
            name="portc"
            rules={[
              { required: true, message: 'Vui lòng điền Cổng kết nối/sạc' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Cổng kết nối/sạc', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Jack tai nghe"
            name="jack"
            rules={[
              { required: true, message: 'Vui lòng điền Jack tai nghe' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Jack tai nghe', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Loại pin"
            name="pintype"
            rules={[
              { required: true, message: 'Vui lòng điền Loại pin' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Loại pin', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Dung lượng pin"
            name="pinsize"
            rules={[
              { required: true, message: 'Vui lòng điền Dung lượng pin' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Dung lượng pin', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Hỗ trợ sạc tối đa"
            name="maxcharge"
            rules={[
              { required: true, message: 'Vui lòng điền Hỗ trợ sạc tối đa' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Hỗ trợ sạc tối đa', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Công nghệ pin"
            name="pintech"
            rules={[
              { required: true, message: 'Vui lòng điền Công nghệ pin' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Công nghệ pin', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Bảo mật nâng cao"
            name="secu"
            rules={[
              { required: true, message: 'Vui lòng điền Bảo mật nâng cao' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Bảo mật nâng cao', e.target.value)} />
          </Form.Item>
          <Form.Item
          label="Tính năng đặc biệt"
          name="tinhnangdacbiet"
          rules={[
            { required: true, message: 'Vui lòng điền Tính năng đặc biệt' },
          ]}
        >
          <ReactQuill
            theme="snow"
            placeholder="Nhập mô tả ở đây..."
            onChange={(content, delta, source, editor) => {
            
              handlePropertyChange('Tính năng đặc biệt', content);
            }}
          />
        </Form.Item>
          <Form.Item
            label="Kháng nước, bụi"
            name="wtdust"
            rules={[
              { required: true, message: 'Vui lòng điền Kháng nước, bụi' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Kháng nước, bụi', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Ghi âm"
            name="record"
            rules={[
              { required: true, message: 'Vui lòng điền Ghi âm' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Ghi âm', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Xem phim"
            name="watch"
            rules={[
              { required: true, message: 'Vui lòng điền Xem phim' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Xem phim', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Nghe nhạc"
            name="listen"
            rules={[
              { required: true, message: 'Vui lòng điền Nghe nhạc' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Nghe nhạc', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thiết kế"
            name="design"
            rules={[
              { required: true, message: 'Vui lòng điền Thiết kế' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Thiết kế', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Chất liệu"
            name="mater"
            rules={[
              { required: true, message: 'Vui lòng điền Chất liệu' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Chất liệu', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Kích thước, khối lượng"
            name="sizephone"
            rules={[
              { required: true, message: 'Vui lòng điền Kích thước, khối lượng' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Kích thước, khối lượng', e.target.value)} />
          </Form.Item>
        </>
      );
    } else if (selectedCategory === 'Ốp lưng') {
      return (
        <>
          <Form.Item
            label="Loại ốp lưng"
            name="caseType"
            rules={[
              { required: true, message: 'Vui lòng điền loại ốp lưng' },
            ]}
          >
            <Input onChange={(e) => handlePropertyChange('Loại ốp lưng', e.target.value)} />
          </Form.Item>
        </>
      );
    } else if (selectedCategory === 'Cáp sạc') {
      return (
        <>
          <Form.Item
            label="Công nghệ/Tiện ích" name="tech" rules={[{ required: true, message: 'Vui lòng điền Công nghệ/Tiện ích' },]}>
            <Input onChange={(e) => handlePropertyChange('Công nghệ/Tiện ích', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Chức năng" name="chucnang" rules={[{ required: true, message: 'Vui lòng điền Chức năng' },]}>
            <Input onChange={(e) => handlePropertyChange('Chức năng', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Đầu vào" name="input" rules={[{ required: true, message: 'Vui lòng điền Đầu vào' },]}>
            <Input onChange={(e) => handlePropertyChange('Đầu vào', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Đầu ra" name="output" rules={[{ required: true, message: 'Vui lòng điền Đầu ra' },]}>
            <Input onChange={(e) => handlePropertyChange('Đầu ra', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Độ dài dây" name="length" rules={[{ required: true, message: 'Vui lòng điền Độ dài dây' },]}>
            <Input onChange={(e) => handlePropertyChange('Độ dài dây', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Công suất tối đa" name="maxcs" rules={[{ required: true, message: 'Vui lòng điền Công suất tối đa' },]}>
            <Input onChange={(e) => handlePropertyChange('Công suất tối đa', e.target.value)} />
          </Form.Item>
        </>
      );
    } else if (selectedCategory === 'Pin dự phòng') {
      return (
        <>
          <Form.Item
            label="Dung lượng" name="dungLuong" rules={[{ required: true, message: 'Vui lòng điền dung lượng' },]}>
            <Input onChange={(e) => handlePropertyChange('Dung lượng', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Hiệu suất sạc" name="hieusuat" rules={[{ required: true, message: 'Vui lòng điền Hiệu suất sạc' },]}>
            <Input onChange={(e) => handlePropertyChange('Hiệu suất sạc', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Lõi pin" name="loi" rules={[{ required: true, message: 'Vui lòng điền Lõi pin' },]}>
            <Input onChange={(e) => handlePropertyChange('Lõi pin', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Công nghệ/Tiện ích" name="tech" rules={[{ required: true, message: 'Vui lòng điền Công nghệ/Tiện ích' },]}>
            <Input onChange={(e) => handlePropertyChange('Công nghệ/Tiện ích', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thời gian sạc đầy pin" name="time" rules={[{ required: true, message: 'Vui lòng điền Thời gian sạc đầy pin' },]}>
            <Input onChange={(e) => handlePropertyChange('Thời gian sạc đầy pin', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Nguồn ra" name="ra" rules={[{ required: true, message: 'Vui lòng điền Nguồn ra' },]}>
            <Input onChange={(e) => handlePropertyChange('Nguồn ra', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Nguồn vào" name="vao" rules={[{ required: true, message: 'Vui lòng điền Nguồn vào' },]}>
            <Input onChange={(e) => handlePropertyChange('Nguồn vào', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Kích thước" name="kichThuoc" rules={[{ required: true, message: 'Vui lòng điền kích thước' },]}>
            <Input onChange={(e) => handlePropertyChange('Kích thước', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Trọng lượng" name="trongLuong" rules={[{ required: true, message: 'Vui lòng điền trọng lượng' },]}>
            <Input onChange={(e) => handlePropertyChange('Trọng lượng', e.target.value)} />
          </Form.Item>
        </>
      );
    } else if (selectedCategory === 'Tai nghe') {
      return (
        <>
          <Form.Item
            label="Thời lượng pin tai nghe" name="pin" rules={[{ required: true, message: 'Vui lòng điền Thời lượng pin tai nghe' },]}>
            <Input onChange={(e) => handlePropertyChange('Thời lượng pin tai nghe', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thời lượng pin hộp sạc" name="boxpin" rules={[{ required: true, message: 'Vui lòng điền Thời lượng pin hộp sạc' },]}>
            <Input onChange={(e) => handlePropertyChange('Thời lượng pin hộp sạc', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Cổng sạc" name="port" rules={[{ required: true, message: 'Vui lòng điền Cổng sạc' },]}>
            <Input onChange={(e) => handlePropertyChange('Cổng sạc', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Công nghệ âm thanh" name="tech" rules={[{ required: true, message: 'Vui lòng điền Công nghệ âm thanh' },]}>
            <Input onChange={(e) => handlePropertyChange('Công nghệ âm thanh', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Tương thích" name="tuongthich" rules={[{ required: true, message: 'Vui lòng điền Tương thích' },]}>
            <Input onChange={(e) => handlePropertyChange('Tương thích', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Ứng dụng kết nối" name="app" rules={[{ required: true, message: 'Vui lòng điền Ứng dụng kết nối' },]}>
            <Input onChange={(e) => handlePropertyChange('Ứng dụng kết nối', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Tiện ích" name="tienich" rules={[{ required: true, message: 'Vui lòng điền Tiện ích' },]}>
            <Input onChange={(e) => handlePropertyChange('Tiện ích', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Kết nối cùng lúc" name="connects" rules={[{ required: true, message: 'Vui lòng điền Kết nối cùng lúc' },]}>
            <Input onChange={(e) => handlePropertyChange('Kết nối cùng lúc', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Công nghệ kết nối" name="contech" rules={[{ required: true, message: 'Vui lòng điền Công nghệ kết nối' },]}>
            <Input onChange={(e) => handlePropertyChange('Công nghệ kết nối', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Điều khiển" name="ctrl" rules={[{ required: true, message: 'Vui lòng điền Điều khiển' },]}>
            <Input onChange={(e) => handlePropertyChange('Điều khiển', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Phím điều khiển" name="ctrlbtn" rules={[{ required: true, message: 'Vui lòng điền Phím điều khiển' },]}>
            <Input onChange={(e) => handlePropertyChange('Phím điều khiển', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Kích thước" name="size" rules={[{ required: true, message: 'Vui lòng điền Kích thước' },]}>
            <Input onChange={(e) => handlePropertyChange('Kích thước', e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Khối lượng" name="weight" rules={[{ required: true, message: 'Vui lòng điền Khối lượng' },]}>
            <Input onChange={(e) => handlePropertyChange('Khối lượng', e.target.value)} />
          </Form.Item>
        </>
      );
    } else {
      return null;
    }
  };
  const handleCategoryChange = async (value) => {
    setSelectedCategory(value);

    try {
      const category = categories.find((cat) => cat.name === value);
      if (category) {
        const categoryId = category._id;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand/${categoryId}`);
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brands for the selected category:', error);
    }
  };

  const onFinish = async (values) => {
    const headers = {
      token: `Bearers ${user.access_token}`,
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/product/addProduct`, {
        ...values, properties: formProperties
      }, { headers }
      );
      message.success('Thêm sản phẩm thành công')
      form.resetFields();
      setSelectedCategory(null);
    } catch (error) {
      message.error('Hãy thêm biến thể cho danh mục vừa thêm')
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
      <Alert
        message="Lưu ý: Sau khi thêm sản phẩm phải thêm ít nhất 1 biến thể của sản phẩm thì mới có thể tiếp tục thêm sản phẩm"
        type="warning"
        showIcon
        style={{ marginBottom: '16px', background: '#FFFF99' }}
      />
      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[
          {
            required: true,
            message: 'Điền tên của sản phẩm',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="warrantyPeriod"
        label="Bảo hành/tháng"
        rules={[
          {
            required: true,
            message: 'Vui lòng điền thời gian bảo hành',
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="categoryName"
        label="Danh mục"
        rules={[
          {
            required: true,
            message: 'Chọn danh mục',
          },
        ]}
      >
        <Select placeholder="Chọn danh mục" onChange={handleCategoryChange}>
          {categories.map((category) => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="brandName"
        label="Thương hiệu"
        rules={[
          {
            required: true,
            message: 'Chọn thương hiệu',
          },
        ]}
      >
        <Select placeholder="Chọn thương hiệu">
          {brands.map((brand) => (
            <Option key={brand.id} value={brand.name}>
              {brand.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="releaseTime"
        label="Ngày ra mắt"
        rules={[
          {
            required: true,
            message: 'Chọn ngày ra mắt',
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Alert
        message="Lưu ý: Sản phẩm có phụ kiện đi kèm thì điền vào"
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />
      <Form.Item
        name="include"
        label="Sản phẩm gồm"
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="thumnails"
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
      <Form.Item
        name="desc"
        label="Mô tả"
        rules={[
          {
            required: true,
            message: 'Vui lòng điền mô tả bảo hành',
          },
        ]}
      >
        <ReactQuill
          theme="snow"
          placeholder="Nhập mô tả ở đây..."
        />
      </Form.Item>
      {renderAttributes()}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};
export default NewProduct;