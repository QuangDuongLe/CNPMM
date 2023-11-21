import React, { useState, useEffect } from "react"
import { Button, Col, Image, Row, Table, Rate, message, Input } from 'antd'
import {
    WrapperStyleColImage,
    WrapperStyleImageSmall,
    WrapperStyleImageBig,
    WrapperStyleTextSell,
    WrapperPriceTextProduct,
    WrapperPriceProduct,
    WrapperQuantityProduct,
    WrapperInputNumber,
    WrapperPropTable,
    WrapperDetail,
    WrapperPolicy,
} from "./style"
import { PlusOutlined, MinusOutlined, RetweetOutlined, PropertySafetyOutlined, DropboxOutlined, GiftOutlined } from '@ant-design/icons'
import ButtonComponent from "../ButtonComponent/ButtonComponent"
import ProductDescription from "./productdesscription"
import CommentBox from "./commentcomponent"
import axios from "axios"
import { NavLink, useParams } from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons"

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Rating from "./ratecomponent"
import SuggestProduct from "./suggestproductcomponent"
import ProductSale from "./productsale"
import { useSelector } from "react-redux"



const { Column, ColumnGroup } = Table;

const ProductDetailComponents = () => {
    const user = useSelector((state) => state.user)
    const [productDetails, setProductDetails] = useState(null);
    const { productName, memory } = useParams();
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSold, setSelectedSold] = useState({});
    const [selectedMemories, setSelectedMemories] = useState({});
    const [selectedSKU, setSelectedSKU] = useState({});
    const [selectedQuantity, setSelectedQuantity] = useState({});
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    const collapse = () => {
        setExpanded(false);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1200,
        appendDots: (dots) => (
            <ul style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', listStyle: 'none', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {dots}
            </ul>)
    };
    const addToCart = async (userId, productName, SKU, quantity) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/addCart?userId=${userId}&productName=${productName}&SKU=${SKU}&quantity=${quantity}`)
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (memory !== `undefined`) {
            axios.get(`${process.env.REACT_APP_API_URL}/product/getDetails/${productName}`)
                .then((response) => {
                    const productDetails = response.data.data;
                    setProductDetails(productDetails);

                    const defaultMemory = memory;

                    const initialMemories = {
                        [productDetails._id]: defaultMemory
                    };

                    setSelectedMemories(initialMemories);


                    if (productDetails && productDetails.variant) {
                        productDetails.variant.forEach((variant) => {
                            if (variant.memory === defaultMemory && variant.attributes && variant.attributes.length > 0) {
                                const defaultColor = variant.attributes[0].color;
                                setSelectedColor((prevSelected) => ({
                                    ...prevSelected,
                                    [variant._id]: defaultColor,
                                }));
                                const selectedAttribute = variant.attributes.find((attribute) => attribute.color === defaultColor);
                                if (selectedAttribute) {
                                    setSelectedSold((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sold,
                                    }));
                                    setSelectedSKU((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sku,
                                    }));
                                    setSelectedQuantity((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.quantity,
                                    }));
                                }
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product details:', error);
                });
        } else {
            axios.get(`${process.env.REACT_APP_API_URL}/product/getDetails/${productName}`)
                .then((response) => {
                    const productDetails = response.data.data;
                    setProductDetails(productDetails);

                    const initialMemories = {
                        [productDetails._id]: productDetails.variant[0].memory
                    };
                    setSelectedMemories(initialMemories);
                    if (productDetails && productDetails.variant) {
                        productDetails.variant.forEach((variant) => {
                            if (variant.memory === productDetails.variant[0].memory && variant.attributes && variant.attributes.length > 0) {
                                const defaultColor = variant.attributes[0].color;
                                setSelectedColor((prevSelected) => ({
                                    ...prevSelected,
                                    [variant._id]: defaultColor,
                                }));
                                const selectedAttribute = variant.attributes.find((attribute) => attribute.color === defaultColor);
                                if (selectedAttribute) {
                                    setSelectedSold((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sold,
                                    }));
                                    setSelectedSKU((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.sku,
                                    }));
                                    setSelectedQuantity((prevSelected) => ({
                                        ...prevSelected,
                                        [variant._id]: selectedAttribute.quantity,
                                    }));
                                }
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching product details:', error);
                });
        }
    }, [productName, memory]);
    const handleAddToCart = async () => {
        try {
            if (memory !== 'undefined') {
                const selectedVariant = productDetails.variant.find((variant) => variant.memory === memory);
                if (selectedVariant) {
                    const selectedSKUName = selectedSKU[selectedVariant._id]
                    await addToCart(user._id, productName, selectedSKUName, quantity);
                    message.success('Thêm vào giỏ hàng thành công')

                }
            } else {
                const selectValues = Object.values(selectedSKU);
                const selectedColorName = selectValues[selectValues.length - 1];
                await addToCart(user._id, productName, selectedColorName, quantity);
                message.success('Thêm vào giỏ hàng thành công')

            }
        } catch (error) {
            console.error('Lỗi:', error);
            message.error('Vui lòng đăng nhập để tiếp tục')
        }
    };
    const handleBuyNow = async () => {
        try {
            if (memory !== 'undefined') {
                const selectedVariant = productDetails.variant.find((variant) => variant.memory === memory);
                if (selectedVariant) {
                    const selectedSKUName = selectedSKU[selectedVariant._id];
                    await addToCart(user._id, productName, selectedSKUName, quantity);
                    message.success('Thêm vào giỏ hàng thành công', 1);


                    window.location.href = '/cart';

                }
            } else {
                const selectValues = Object.values(selectedSKU);
                const selectedColorName = selectValues[selectValues.length - 1];
                await addToCart(user._id, productName, selectedColorName, quantity);
                message.success('Thêm vào giỏ hàng thành công', 1);


                window.location.href = '/cart';

            }
        } catch (error) {
            console.error('Lỗi:', error);
            message.error('Vui lòng đăng nhập để tiếp tục');
        }
    };




    const [quantity, setQuantity] = useState(1);

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < 3) {
            setQuantity(quantity + 1);
        }
    };
    const handleChange = (value) => {
        setQuantity(value);
    };


    const dataSource = productDetails && productDetails.properties
        ? Object.keys(productDetails.properties).map((propertyKey) => ({
            key: propertyKey,
            prop: propertyKey,
            info: productDetails.properties[propertyKey] || 'N/A',
        }))
        : [];
    if (memory !== `undefined`) {
        dataSource.unshift({
            key: '0',
            prop: 'Dung lượng lưu trữ',
            info: memory,
        });
    }
    let totalRating = 0;
    let averageRating = 0;

    if (productDetails?.ratings.length > 0) {
        totalRating = productDetails.ratings.reduce((total, review) => total + review.rating, 0);
        averageRating = totalRating / productDetails.ratings.length;
    }
    const goBack = () => {
        window.history.back();
    };
    return (
        <WrapperDetail>
            <div style={{ background: '#fff', padding: '10px' }}>
                <button style={{ border: 'none', background: 'transparent' }} onClick={goBack}>
                    <ArrowLeftOutlined /> Quay lại
                </button>
            </div>
            <Row style={{ background: '#fff' }} >

                {productDetails ? (
                    memory !== `undefined` ? (
                        <div className="product-name">
                            <h5 style={{ margin: 0 }}>
                                {productDetails.name} {memory}
                            </h5>
                            <div className="rate-ave">
                                <Rate disabled allowHalf value={averageRating} />
                                <span style={{ fontSize: 16 }}>{averageRating.toFixed(1)}</span>
                            </div>
                        </div>

                    ) : (
                        <div>
                            <h3>{productDetails.name}</h3>
                        </div>
                    )
                ) : (
                    <p>Loading...</p>
                )}
            </Row>
            <Row className="product-pick">
                <Col className="slider-col">
                    <Slider {...sliderSettings} className="slider" style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                        {productDetails && productDetails.thumnails.slice(1).map((thumbnail, index) => (
                            <WrapperStyleImageBig key={index}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image src={thumbnail} alt={`Thumbnail ${index}`} className="slider-image" />
                                </div>
                            </WrapperStyleImageBig>
                        ))}
                    </Slider>
                    <Row style={{ display: 'flex', marginTop: '10px', padding: '5px', alignItems: 'center', justifyContent: 'flex-start', border: '1px solid #ccc', borderRadius: '4px' }}>
                        {productDetails && productDetails.variant && selectedMemories[productDetails._id] ? (
                            productDetails.variant
                                .filter((variant) => variant.memory === selectedMemories[productDetails._id])
                                .map((variant) =>
                                    variant.attributes ? (
                                        variant.attributes.map((attribute, attributeIndex) => (
                                            <WrapperStyleColImage key={attributeIndex} span={3} >
                                                <WrapperStyleImageSmall src={attribute.pictures} alt={`Attribute ${attributeIndex}`} preview={false} />
                                            </WrapperStyleColImage>
                                        ))
                                    ) : null
                                )
                        ) : null}
                    </Row>
                </Col>
                <br></br>
                <Col className="pick-col">
                    <div className="button-row" style={{ padding: '0 0 10px' }}>
                        {productDetails?.variant.map((variant) => (
                            variant?.memory && (
                                <NavLink to={`/product/${productName}/${variant.memory}`}>
                                    <Button
                                        className={` memory-button ${variant?.memory === selectedMemories[productDetails._id] ? 'selected' : ''}`}

                                        onClick={() => {
                                            setSelectedMemories((prevSelected) => ({
                                                ...prevSelected,
                                                [productDetails._id]: variant?.memory,
                                            }));
                                        }}
                                        style={{ padding: '5px 5px', marginInlineEnd: '5px' }}>
                                        {variant?.memory}
                                    </Button>
                                </NavLink>
                            )
                        ))}
                    </div>
                    <div >
                        {productDetails?.variant.map((variant) => {
                            if (variant.attributes && variant.attributes.length > 0) {
                                const colors = variant.attributes.map((attribute) => attribute.color);
                                const uniqueColors = [...new Set(colors)];
                                if (variant.memory === selectedMemories[productDetails._id]) {
                                    return (
                                        <div style={{ padding: '10xp' }} key={variant._id}>
                                            <div className="btn-color" >

                                                {uniqueColors.map((color, index) => (
                                                    <Button
                                                        key={index}
                                                        className={`memory-button ${color === selectedColor[variant._id] ? 'selected' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedColor((prevSelected) => ({
                                                                ...prevSelected,
                                                                [variant._id]: color,
                                                            }));
                                                            const selectedAttribute = variant.attributes.find(
                                                                (attribute) => attribute.color === color
                                                            );
                                                            if (selectedAttribute) {
                                                                setSelectedSold((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: selectedAttribute.sold,
                                                                }));
                                                                setSelectedSKU((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: selectedAttribute.sku,
                                                                }));
                                                                setSelectedQuantity((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: selectedAttribute.quantity,
                                                                }));
                                                            } else {
                                                                setSelectedSold((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: 'N/A',
                                                                }));
                                                                setSelectedSKU((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: 'N/A',
                                                                }));
                                                                setSelectedQuantity((prevSelected) => ({
                                                                    ...prevSelected,
                                                                    [variant._id]: 'N/A',
                                                                }));
                                                            }
                                                        }}
                                                        style={{ padding: '5px 5px', marginInlineEnd: '5px' }}
                                                    >
                                                        {color}
                                                    </Button>
                                                ))}
                                            </div>
                                            <WrapperStyleTextSell>
                                                <p>SKU: {selectedSKU[variant._id]}</p>
                                                <p>Đã bán: {selectedSold[variant._id]}</p>
                                                <p>Số lượng còn lại: {selectedQuantity[variant._id]}</p>
                                            </WrapperStyleTextSell>
                                        </div>
                                    );
                                }
                            }
                            return null;
                        })}
                    </div>
                    {productDetails ? (
                        <div>
                            <WrapperPriceTextProduct>
                                {productDetails?.variant.find((variant) => variant.memory === selectedMemories[productDetails._id])?.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </WrapperPriceTextProduct>
                            <span style={{ color: '#000', textDecoration: 'line-through' }}>
                                {productDetails?.variant.find((variant) => variant.memory === selectedMemories[productDetails._id])?.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng:</div>
                        <div>
                            <Button type="primary" size='medium' style={{ background: 'transparent', border: '1px solid #ccc', color: '#000', boxShadow: 'none', borderRadius: '5px' }} onClick={handleDecreaseQuantity}>-</Button>
                            <WrapperInputNumber
                                type="number"
                                value={quantity}
                                onChange={handleChange}
                                size="middle"
                                defaultValue={1}
                                upHandler={null}
                                downHandler={null}
                                min={1}
                                max={3}
                            />
                            <Button type="primary" size='medium' style={{ background: 'transparent', border: '1px solid #ccc', color: '#000', boxShadow: 'none', borderRadius: '5px' }} onClick={handleIncreaseQuantity}>+</Button>
                        </div>
                    </div >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            bordered={false}
                            size={40}
                            styleButton={{
                                background: 'rgb(225,57,69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={handleBuyNow}
                            textButton={'Mua Ngay'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
                        </ButtonComponent>
                        <ButtonComponent
                            bordered={false}
                            size={40}
                            styleButton={{
                                background: 'rgb(225,57,69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={handleAddToCart}
                            textButton={'Thêm Vào Giỏ'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
                        </ButtonComponent>
                    </div>
                    <br></br>
                </Col>
                <Row>
                    <Col className="policy-col">
                        <WrapperPolicy>
                            <div className="policy_intuitive cate42 scenarioNomal">
                                <div className="policy">
                                    <ul className="policy__list">
                                        <li className="policy-item">
                                            <RetweetOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></RetweetOutlined>
                                            <p>
                                                1 đổi 1 trong&nbsp;
                                                <b>3 ngày&nbsp;</b>đối với sản phẩm là điện thoại và trong thời gian bảo hành đối với sản phẩm là phụ kiện&nbsp;
                                                <a href="/" title="Chính sách dổi trả">Xem chi tiết</a>
                                            </p>
                                        </li>
                                        {productDetails && productDetails.warrantyPeriod ? (
                                            <li className="policy-item" data-field="IsSameBHAndDT">
                                                <PropertySafetyOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></PropertySafetyOutlined>
                                                <p>Bảo hành chính hãng điện thoại&nbsp;
                                                    <b>{productDetails.warrantyPeriod} tháng</b> tại các trung tâm bảo hành hãng&nbsp;
                                                    <a href="/" title="Chính sách bảo hành">Xem chính sách bảo hành</a>
                                                </p>
                                            </li>
                                        ) : (
                                            <li className="policy-item" data-field="IsSameBHAndDT">
                                                <PropertySafetyOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></PropertySafetyOutlined>
                                                <p> Không bảo hành
                                                </p>
                                            </li>
                                        )}
                                        {productDetails && productDetails.include ? (
                                            <li className="policy-item">
                                                <DropboxOutlined style={{ fontSize: '30px', left: 0, position: 'absolute', top: '18px' }}></DropboxOutlined>
                                                <p>Bộ sản phẩm gồm Bộ sản phẩm gồm: {productDetails.include} </p>
                                            </li>
                                        ) : null}
                                    </ul>

                                </div>
                            </div>
                        </WrapperPolicy>
                    </Col>
                    <Col className="sale-col">
                        <Row style={{ height: 'auto', textAlign: 'justify' }}>
                            {productDetails && productDetails.promotion ? (
                                <div style={{ fontSize: '14px' }}>
                                    <div style={{ fontSize: '20px', color: 'red' }}> <GiftOutlined /> Khuyến mãi </div>
                                    <div>(chỉ áp dụng tại cửa hàng)</div>
                                    <ProductSale promotion={productDetails.promotion} />
                                </div>
                            ) : (
                                null
                            )}
                        </Row>
                    </Col>
                </Row>
            </Row>
            <hr className="my-4" />
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col className="des-col">
                    <h3>Mô tả sản phẩm</h3>
                    <div
                        style={{
                            height: expanded ? 'auto' : '600px',
                            overflowY: 'hidden',
                            textAlign: 'justify',
                            position: 'relative',
                        }}
                    >
                        {productDetails ? (
                            <ProductDescription description={productDetails.desc} />
                        ) : (
                            <p>Loading...</p>
                        )}

                        <div
                            style={{
                                position:'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'linear-gradient(to bottom, transparent, white)',
                                padding: '30px 10px 0px',
                                boxSizing: 'border-box',
                                display:'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {!expanded ? (
                                <Button onClick={toggleExpand} style={{width: '200px',textTransform: 'uppercase', cursor: 'pointer' }}>
                                    Xem thêm
                                </Button>
                            ) : (
                                <Button onClick={collapse} style={{width: '200px',textTransform: 'uppercase', cursor: 'pointer' }}>
                                    Thu gọn
                                </Button>
                            )}
                        </div>
                    </div>
                </Col>
                <Col className="prop-col" >
                    <WrapperPropTable dataSource={dataSource} pagination={false}>
                        <ColumnGroup title="Thông số kỹ thuật">
                            <Column dataIndex="prop" key="prop" />
                            <Column
                                dataIndex="info"
                                key="info"
                                render={(text, record) => {
                                    const containsHTML = /<[a-z][\s\S]*>/i.test(text);
                                    return containsHTML ? (
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                    ) : (
                                        text
                                    );
                                }}
                            />
                        </ColumnGroup>
                    </WrapperPropTable>
                </Col>
            </Row>
            <hr className="my-4" />
            {productDetails && memory !== "undefined" && (
                <Row>
                    <SuggestProduct suggested={productDetails.name.replace(/\s*\d+([GgBb]{1,2})?\s*$/, '')} />
                </Row>
            )}
            <hr className="my-4" />
            <Row>
                <Rating productName={productName}></Rating>
            </Row>
            <hr className="my-4" />
            <Row >
                <CommentBox />
            </Row>
            <hr className="my-4" />
        </WrapperDetail>
    )
}

export default ProductDetailComponents;