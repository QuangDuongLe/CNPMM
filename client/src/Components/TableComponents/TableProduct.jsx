import React, { useState, useEffect } from "react";
import { Alert, InputNumber, Modal, Table } from 'antd';
import { Space } from 'antd';
import { Switch } from 'antd';
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined,PlusOutlined,MinusCircleOutlined,AppstoreOutlined } from '@ant-design/icons';
import axios from "axios";
import Search from "antd/es/input/Search";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined } from '@ant-design/icons';
import {  message, Upload ,Collapse} from 'antd';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Image,
  List 
} from 'antd';
import { useSelector } from "react-redux";


const TableProduct = () => {
  const user = useSelector((state)=> state.user)
  const headers = {
    token: `Bearers ${user.access_token}`,
};
  const props = (fieldKey) => ({
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
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
    const uploadedFilePath = info.file.response.imageUrl;
    if (typeof uploadedFilePath === 'string') {
      const updatedAttributes = form.getFieldValue('attributes');
      updatedAttributes[fieldKey].pictures = uploadedFilePath;
      form.setFieldsValue({ attributes: updatedAttributes });
    } else {
      console.error('uploadedFilePath is not a string:', uploadedFilePath);
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}
  });
  const propss = {
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
  const [form] = Form.useForm();
  const [currentProductId, setCurrentProductId] = useState(null);
  const [currentProductvariantId, setCurrentProducvarianttId] = useState(null);
  const [currentAttributeId, setCurrentAttributeId] = useState(null);
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Bảo hành/tháng',
      dataIndex: 'warrantyPeriod',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      render: brand => brand.name,
    },
    {
      title: "Hình ảnh hiển thị",
      dataIndex: "thumnails",
      render: thumbnails => (
        <div style={{
          display: "flex",
          flexWrap: "wrap",  
        }}>
          {thumbnails.map((imageUrl, index) => (
              <img
                src={imageUrl}
                alt={`Thumbnail ${index}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
                loading="lazy"
              />
          ))}
        </div>
      ),
    },    
    {
      title: 'Thao tác',
      dataIndex: "_id",
      render:  record => (
        <Space size="middle">
            <a>
        <AppstoreAddOutlined onClick={() => {
          setCurrentProductId(record);
          setAddVariant(true);
        }} />
      </a>
          <a>
              <EditOutlined onClick={() =>  {      
                setCurrentProductId(record)
              setUpdate(true);
            }} /> 
            </a>
          <a onClick={() => {setDeleteModalVisible(true); setCurrentProductId(record);}}> <DeleteOutlined /></a>
                  <Modal
          title="Xác nhận xoá sản phẩm"
          visible={isDeleteModalVisible}
          onOk={() => {
            handleDeleteProduct(currentProductId)
            setDeleteModalVisible(false); 
          }}
          onCancel={() => setDeleteModalVisible(false)} 
        >
          <p>Bạn có chắc chắn muốn xoá sản phẩm này?</p>
        </Modal>
         <Modal title="Sửa thông tin sản phẩm"
            visible={isUpdate}
            onOk={() => {
              form
              .validateFields()
              .then((values) => {
                handleSaveEdit(currentProductId, values);
                setUpdate(false);
              })
              .catch((errorInfo) => {
                console.error('Validation failed:', errorInfo);
              });
            }}
            onCancel={() => {
              setUpdate(false);
            }}
          >  
            <Alert
            message="Lưu ý: Sửa thuộc tính nào chỉ cần điền vào thuộc tính đó không cần điền tất cả"
            type="warning"
            showIcon
            style={{ marginBottom: '16px',background:'#FFFF99' }}
          />
          <Form
                {...formItemLayout}
                form={form}
                style={{
                  maxWidth: 600,
                }}
                scrollToFirstError
              >
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                
                >
                  <Input/>
                </Form.Item>

                <Form.Item
                  name="warrantyPeriod"
                  label="Bảo hành/tháng"
              
                >
                    <Input type="number"/>
                </Form.Item>
                <Form.Item
                  name="releaseTime"
                  label="Ngày ra mắt"
                >
                  <DatePicker  />
                </Form.Item>
                   <Form.Item
                    name="thumnails"
                    label="Hình ảnh"
                  >
                    <Upload {...propss}>
                       <Button icon={<UploadOutlined />}>Ảnh</Button>
                     </Upload>
               </Form.Item>
               <Form.Item
                  name="include"
                  label="Sản phẩm gồm"
                
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="desc"
                  label="Mô tả"
                >
                  <ReactQuill
                    theme="snow" 
                    placeholder="Nhập mô tả ở đây..." 
                  />
                </Form.Item>
                <Form.Item
                    name='promotion'
                    label="Khuyến mãi"
                  >
                   <ReactQuill
                    theme="snow" 
                    placeholder="Nhập khuyến mãi ở đây..." 
                  />
                  </Form.Item>
              </Form>
            </Modal>
            <Modal
  title="Thêm biến thể"
  visible={isAddVariant}
  onOk={() => {
    form
      .validateFields()
      .then((values) => {
        addProductVariant(currentProductId, values);
        setAddVariant(false);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  }}
  onCancel={() => {
    setAddVariant(false);
  }}
>
          <Alert
            message="Lưu ý: Chỉ có điện thoại là có bộ nhớ, nếu sản phẩm không phải điện thoại vui lòng không điền"
            type="warning"
            showIcon
            style={{ marginBottom: '16px',background:'#FFFF99' }}
          />
  <Form
    {...formItemLayout}
    form={form}
    style={{
      maxWidth: 600,
    }}
    scrollToFirstError
  >
    <Form.Item
      name="memory"
      label="Bộ nhớ"
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="imPrice"
      label="Giá nhập"
    >
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name="newPrice"
      label="Giá bán"
    >
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
    <Form.List name="attributes">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }) => (
        <Collapse key={key}>
          <Collapse.Panel header={`Thuộc tính ${key + 1}`} key={key}>
            <Form.Item
              {...restField}
              name={[name, 'color']}
              fieldKey={[fieldKey, 'color']}
              label="Màu sắc"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền màu sắc!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'quantity']}
              fieldKey={[fieldKey, 'quantity']}
              label="Số lượng"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền số lượng!',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'pictures']}
              fieldKey={[fieldKey, 'pictures']}
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ảnh',
                },
              ]}
            >
               <Upload {...props(fieldKey)}>
                <Button icon={<UploadOutlined />}>Ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'sku']}
              fieldKey={[fieldKey, 'sku']}
              label="SKU"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền SKU!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'status']}
              fieldKey={[fieldKey, 'status']}
              label="Trạng thái"
            >
              <Input />
            </Form.Item>
            <MinusCircleOutlined onClick={() => { remove(name); }} />
          </Collapse.Panel>
        </Collapse>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => { add(); }}
          icon={<PlusOutlined />}
        >
          Thêm thuộc tính
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>
  </Form>
</Modal>
        </Space>
      )
    },
    {
      title: 'Ẩn/Hiện',
      dataIndex: 'isHide',
      render: (isHide, record) => (
        <Switch
          checked={!isHide}
          onChange={(checked) => {
            handleToggleHide(record._id, !checked);
          }}
        />
      ),
    },
    {
      title: "Biến thể",
      dataIndex: "variant",
      render: (text, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setSelectedProduct(record);
              setVariantModalVisible(true);
            }}
          >
            <AppstoreOutlined />
          </a>
        </Space>
      ),
    },
  ];
  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
const [attributeModalVisible, setAttributeModalVisible] = useState(false);
const [selectedVariant, setSelectedVariant] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleteVariantVisible, setDeleteVariantVisible] = useState(false);
  const [isDeleteAttributeVisible, setDeleteAttributeVisible] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const [isAddVariant, setAddVariant] = useState(false);
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const handleCategoryClick = (categoryId) => {
    axios
    .get(`${process.env.REACT_APP_API_URL}/product/getIdByCategory/${categoryId}`)
            .then((response) => {
              setSelectedCategory(categoryId);
              setProductData(response.data.data);
            })
            .catch((error) => {
              console.error('Lỗi khi gọi API: ', error);
            });
        };
  const addProductVariant = async (parentId, variantData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/addProductvariant/${parentId}`,
        variantData, { headers }
      );
      
      const updatedProductData = productData.map((product) => {
        if (product._id === parentId) {
          return { ...product, variant: [...product.variant, response.data.data] };
        }
        return product;
      });
      message.success('Thêm biến thể thành công')
      setProductData(updatedProductData)
      form.resetFields();
    } catch (error) {
      throw error; 
    }
  };
  const addAttributes = async (variantId, attributesData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/addAttributes/${variantId}`,
        { attributes: attributesData },{ headers }
      );
      const updatedProductData = productData.map((product) => {
        if (product.variant.some((variant) => variant._id === variantId)) {
          const updatedVariants = product.variant.map((variant) => {
            if (variant._id === variantId) {
              return {
                ...variant,
                attributes: response.data.data.attributes,
              };
            }
            return variant;
          });
          return {
            ...product,
            variant: updatedVariants,
          };
        }
        return product;
      });
      const updatedSelectedProduct = { ...selectedProduct };
      updatedSelectedProduct.variant = updatedProductData.find(
        (product) => product._id === selectedProduct._id
      ).variant;
      message.success('Thêm thuộc tính thành công')
      setSelectedProduct(updatedSelectedProduct);
      setProductData(updatedProductData);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi thêm thuộc tính:", error);
    }
  };
  const updateProductVariant = async (variantId, newData) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/product/editProductVariant/${variantId}`, newData, { headers });
      const updatedVariant = response.data.data;
  
      setProductData(prevProductData => {
        const updatedProductData = prevProductData.map(product => {
          const updatedVariants = product.variant.map(variant => (variant._id === updatedVariant._id ? updatedVariant : variant));
          return { ...product, variant: updatedVariants };
        });
  
        return updatedProductData;
      });
  
      message.success('Sửa biến thể thành công');
      form.resetFields();
      setUpdate(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật biến thể: ", error);
    }
  };
  
  
  
  const handleSaveEdit = (id, values) => {
    const productId = id;
    axios.put(`${process.env.REACT_APP_API_URL}/product/editProduct/${productId}`, values, { headers })
      .then((response) => {
        const updatedProduct = response.data.data;
  
        setProductData((prevData) => {
          return prevData.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
          );
        });
  
        message.success('Sửa sản phẩm thành công');
        form.resetFields();
        setUpdate(false);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm: ", error);
      });
  };
  
  
  
  const handleDeleteProduct = (productId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/product/delete/${productId}`,{ headers })
      .then((response) => {
        const updatedProducts = productData.filter(product => product._id !== productId);
        message.success('Xoá sản phẩm thành công')
        setProductData(updatedProducts);
      })
      .catch((error) => {
        console.error('Lỗi khi xóa sản phẩm: ', error);
      });
  };
  const handleDeleteProductvariant = (variantId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/product/deleteVariant/${variantId}`,{ headers })
      .then((response) => {
        const updatedProductData = productData.map((product) => {
          const updatedVariants = product.variant.filter(
            (variant) => variant._id !== variantId
          );
          return { ...product, variant: updatedVariants };
        });
        message.success('Xoá biến thể thành công')
        setProductData(updatedProductData);

        const updatedSelectedProduct = {
          ...selectedProduct,
          variant: selectedProduct.variant.filter(
            (variant) => variant._id !== variantId
          ),
        };
        setSelectedProduct(updatedSelectedProduct);
      })
      .catch((error) => {
        console.error('Lỗi khi xóa biến thể sản phẩm: ', error);
      });
  };
  
  
  const handleToggleHide = (productId, checked) => {
    axios.put(`${process.env.REACT_APP_API_URL}/product/editProduct/${productId}`, {
        isHide: checked, 
      },{ headers })
      .then((response) => {     
        const updatedProduct = {
          ...productData.find(product => product._id === productId),
          isHide: checked, 
        };
        const updatedProducts = productData.map(product =>
          product._id === productId ? updatedProduct : product
        );
        setProductData(updatedProducts);
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật sản phẩm: ', error);
      });
  };
  const [isAddAttributes, setAddAttributes] = useState(false);
  const [isUpdateVariant, setUpdateVariant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addQuantityAttributes, setaddQuantityAttribute] = useState(false);
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${searchQuery}`)
        .then((response) => {
          setSearchResults(response.data.data);
        })
        .catch((error) => {
          console.error('Error searching products:', error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  const handleDeleteAttribute = (variantId, attributeId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/product/deleteAttributes/${variantId}/${attributeId}`,{ headers })
      .then((response) => {
        const updatedSelectedVariant = {
          ...selectedVariant,
          attributes: selectedVariant.attributes.filter(
            (attribute) => attribute._id.toString() !== attributeId.toString()
          ),
        };
        setSelectedVariant(updatedSelectedVariant);
  
        const updatedSelectedProduct = {
          ...selectedProduct,
          variant: selectedProduct.variant.map((variant) => {
            if (variant._id === variantId) {
              return {
                ...variant,
                attributes: variant.attributes.filter(
                  (attribute) => attribute._id.toString() !== attributeId.toString()
                ),
              };
            }
            return variant;
          }),
        };
        setSelectedProduct(updatedSelectedProduct);
        setProductData((prevData) => {
          const updatedData = prevData.map((product) => {
            const updatedVariants = product.variant.map((variant) => {
              if (variant._id === variantId) {
                return {
                  ...variant,
                  attributes: variant.attributes.filter(
                    (attribute) => attribute._id.toString() !== attributeId.toString()
                  ),
                };
              }
              return variant;
            });
            return { ...product, variant: updatedVariants };
          });
          return updatedData;
        });
  
        message.success('Xoá thuộc tính thành công')
      })
      .catch((error) => {
        console.error('Lỗi khi xóa mục giỏ hàng:', error);
      });
  };
  const addQuantityAttribute = async (variantId, attributeId, newData) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/product/addQuantity/${variantId}/${attributeId}`,
        newData, { headers }
      );
  
      if (response.data.success) {
        const updatedVariant = response.data.data;
  
        
        setProductData((prevData) => {
          const updatedData = prevData.map((product) => {
            const updatedVariants = product.variant.map((variant) => {
              return variant._id === updatedVariant._id ? updatedVariant : variant;
            });
            return { ...product, variant: updatedVariants };
          });
          return updatedData;
        });
  
        message.success('Cộng thêm số lượng thành công');
        form.resetFields();
        setaddQuantityAttribute(false);
      } else {
        console.error('Lỗi khi cập nhật biến thể:', response.data.error);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật biến thể:', error);
    }
  };
  
  
  const [category, setCategory] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/category/getAll`)
      .then((response) => {
          setCategory(response.data.data); 
          if (isFirstLoad && response.data.data.length > 0) {
            handleCategoryClick(response.data.data[0]._id);
            setIsFirstLoad(false);
          }
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API: ', error);
      });
  }, []);
  return (
    <div>
      <Alert
        message="Tìm kiếm từ tất cả sản phẩm"
        type="info"
        showIcon
      />
      <br/>
         <div>
        <Search
          style={{ width: '50%' }}
          placeholder="Tìm kiếm sản phẩm"
          onSearch={handleSearch}
          enterButton
        />
      </div>
      <br/>
      <div>
        {category.map((category) => (
          <Button
            key={category._id}
            style={{ marginRight: '10px' }}
            onClick={() => handleCategoryClick(category._id)}
            className={`memory-button ${selectedCategory === category._id ? 'selected' : ''}`}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <span
          style={{
            marginLeft: 8,
          }}
        >
        </span>
      </div>
      <Table columns={columns} dataSource={searchQuery.trim() === '' ? productData.map((product, index) => ({
        ...product,
        key: index,
      })) : searchResults.map((product, index) => ({
        ...product,
        key: index,
      }))} />
<Modal
  title="Danh sách biến thể"
  visible={variantModalVisible}
  onCancel={() => setVariantModalVisible(false)}
  footer={null}
  width={1000}
>
<Alert
            message="Lưu ý: Sau khi sửa biến thể chỉ cần tắt danh sách đi mở lại sẽ được cập nhật"
            type="warning"
            showIcon
            style={{ marginBottom: '16px',background:'#FFFF99' }}
          />
  {selectedProduct && (
    <Table
      dataSource={selectedProduct.variant}
      columns={[
        {
          title: 'Bộ nhớ',
          dataIndex: 'memory',
          key: 'memory',
        },
        {
          title: 'Giá nhập',
          dataIndex: 'imPrice',
          key: 'imPrice',
        },
        {
          title: 'Giá cũ',
          dataIndex: 'oldPrice',
          key: 'oldPrice',
        },
        {
          title: 'Giá bán',
          dataIndex: 'newPrice',
          key: 'newPrice',
        },
    
        {
          title: 'Thuộc tính',
          render: (text, record) => (
            <Space size="middle">
               <a
            onClick={() => {
              setSelectedVariant(record);
              setAttributeModalVisible(true);
            }}><AppstoreOutlined/> </a>
            </Space>
          ),
        },
        {
          title: 'Thao tác',
          render: (text, record) => (
            <Space size="middle">
               <a onClick={() => {setDeleteVariantVisible(true); setCurrentProducvarianttId (record._id)}}> <DeleteOutlined /></a>
                  <Modal
          title="Xác nhận xoá biến thể"
          visible={isDeleteVariantVisible}
          onOk={() => {
            handleDeleteProductvariant(currentProductvariantId);
            setDeleteVariantVisible(false); 
          }}
          onCancel={() => setDeleteVariantVisible(false)} 
        >
          <p>Bạn có chắc chắn muốn xoá biến thể này?</p>
        </Modal>
              <a><EditOutlined onClick={() =>  {      
               setUpdateVariant(true);
               setCurrentProducvarianttId (record._id)
            }}/></a>
              <a ><AppstoreAddOutlined onClick={() =>  {      
              setAddAttributes(true);
              setCurrentProducvarianttId (record._id)
            }} /></a>
       <Modal
  title="Thêm thuộc tính cho biến thể"
  visible={isAddAttributes}
  onOk={() => {
    form
      .validateFields()
      .then((values) => {
        addAttributes(currentProductvariantId, values.attributes);
        setAddAttributes(false);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  }}
  onCancel={() => {
    setAddAttributes(false);
  }}
>
 
  <Form
    {...formItemLayout}
    form={form}
    style={{
      maxWidth: 600,
    }}
    scrollToFirstError
  >
 
    <Form.Item name="attributes" label="Thuộc tính">
      <Form.List name="attributes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Collapse key={key}>
                <Collapse.Panel header={`Thuộc tính ${key + 1}`} key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, 'color']}
                    fieldKey={[fieldKey, 'color']}
                    label="Màu sắc"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng điền màu sắc!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
              {...restField}
              name={[name, 'quantity']}
              fieldKey={[fieldKey, 'quantity']}
              label="Số lượng"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền số lượng!',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'pictures']}
              fieldKey={[fieldKey, 'pictures']}
              label="Hình ảnh"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ảnh',
                },
              ]}
            >
               <Upload {...props(fieldKey)}>
                <Button icon={<UploadOutlined />}>Ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'sku']}
              fieldKey={[fieldKey, 'sku']}
              label="SKU"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng điền SKU!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'status']}
              fieldKey={[fieldKey, 'status']}
              label="Trạng thái"
            >
              <Input />
            </Form.Item>
                  <MinusCircleOutlined onClick={() => { remove(name); }} />
                </Collapse.Panel>
              </Collapse>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => { add(); }}
                icon={<PlusOutlined />}
              >
                Thêm thuộc tính
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  </Form>
</Modal>

<Modal
  title="Sửa biến thể"
  visible={isUpdateVariant}
  onOk={() => {
    form
      .validateFields()
      .then((values) => {
        updateProductVariant(currentProductvariantId, values);
        setUpdateVariant(false);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  }}
  onCancel={() => {
    setUpdateVariant(false);
  }}
>
<Alert
            message="Lưu ý: Sửa thuộc tính nào chỉ cần điền vào thuộc tính đó không cần điền tất cả"
            type="warning"
            showIcon
            style={{ marginBottom: '16px',background:'#FFFF99' }}
          />
  <Form
    {...formItemLayout}
    form={form}
    style={{
      maxWidth: 600,
    }}
    scrollToFirstError
  >
    <Form.Item
      name="memory"
      label="Bộ nhớ"
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="imPrice"
      label="Giá nhập"
   
    >
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name="oldPrice"
      label="Giá cũ"
    >
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      name="newPrice"
      label="Giá bán"
    >
      <InputNumber style={{ width: '100%' }} />
    </Form.Item>
  </Form>
</Modal>



          </Space>
          ),
        },
      ]}
    />
  )}
</Modal>




<Modal
  title={`Thuộc tính của biến thể - ${selectedVariant?.memory}`}
  visible={attributeModalVisible}
  onCancel={() => setAttributeModalVisible(false)}
  footer={null}
  width={800}
>
  
  {selectedVariant && (
    <Table
      dataSource={selectedVariant.attributes}
      columns={[
        {
          title: 'Mã sản phẩm',
          dataIndex: 'sku',
          key: 'sku',
        },
        {
          title: 'Màu sắc',
          dataIndex: 'color',
          key: 'color',
        },
        {
          title: 'Số lượng',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Đã bán',
          dataIndex: 'sold',
          key: 'sold',
        },
        {
          title: 'Hình ảnh',
          dataIndex: 'pictures',
          key: 'pictures',
          render: pictures => (
            <div>
                <Image
                  src={pictures}
                  alt={`Hình ảnh `}
                  style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                />
            </div>
          ),
        },
        {
          title: 'Thao tác',
          render: (text, record) => (
            <Space size="middle">
              <a onClick={() => { setDeleteAttributeVisible(true); setCurrentAttributeId(record._id) }}>
                <DeleteOutlined />
              </a>
              <a onClick={() => { setaddQuantityAttribute(true); setCurrentAttributeId(record._id) }}>
                <PlusOutlined />
              </a>
              <Modal
                title="Xác nhận xoá thuộc tính"
                visible={isDeleteAttributeVisible}
                onOk={() => {
                 handleDeleteAttribute(selectedVariant._id,currentAttributeId);
                 setDeleteAttributeVisible(false);
                }}
                onCancel={() => setDeleteAttributeVisible(false)}
              >
                <p>Bạn có chắc chắn muốn xoá thuộc tính này?</p>
              </Modal>
              <Modal
                  title="Cộng thêm số lượng"
                  visible={addQuantityAttributes}
                  onOk={() => {
                    form
                      .validateFields()
                      .then((values) => {
                        addQuantityAttribute(selectedVariant._id,currentAttributeId, values);
                        setaddQuantityAttribute(false);
                      })
                      .catch((errorInfo) => {
                        console.error('Validation failed:', errorInfo);
                      });
                  }}
                  onCancel={() => {
                    setaddQuantityAttribute(false);
                  }}
                >
                    <Alert
                    message="Lưu ý: Điền số lượng vào sẽ cộng thêm với số lượng đã có trước đó, chỉ cần tắt tất cả form rồi mở lại sẽ được cập nhật lại số lượng"
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px',background:'#FFFF99' }}
                  />
                  <Form
                    {...formItemLayout}
                    form={form}
                    style={{
                      maxWidth: 600,
                    }}
                    scrollToFirstError
                  >
                    <Form.Item
                      name="quantity"
                      label="Số lượng cộng thêm"
                    >
                      <Input />
                    </Form.Item>
                  </Form>
                </Modal>  
            </Space>
          )
        }
      ]}
    />
  )}
</Modal>
    </div>
  );
};

export default TableProduct;
