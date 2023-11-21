import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TitleWrapper, WrapperSlider } from './style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { RightCircleFilled, LeftCircleFilled } from '@ant-design/icons'

function SuggestProduct({ suggested }) {
    const [products, setProducts] = useState([]);
   

    const CustomPrevArrow = (props) => (
        <div {...props} className="custom-prev-arrow" style={{ ...arrowStyleprev, left: 0 }}>
            <LeftCircleFilled style={{ fontSize: '30px' }} />
        </div>
    );

    const CustomNextArrow = (props) => (
        <div {...props} className="custom-next-arrow" style={{ ...arrowStyle, right: 0 }}>
            <RightCircleFilled style={{ fontSize: '30px' }} />
        </div>
    );

    const arrowStyleprev = {
        width: '5%',
        cursor: 'pointer',
        position: 'absolute',
        paddingLeft: '10px',
        zIndex: '1',
    };
    const arrowStyle = {
        width: '5%',
        cursor: 'pointer',
        position: 'absolute',
        paddingLeft: '10px',
        zIndex: '1',
    };
    if (window.innerWidth <= 500) {
        arrowStyle.transform = 'translateX(-150%)';
    }

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6, // Trượt qua 5 sản phẩm khi bấm "Next"
        prevArrow: <CustomPrevArrow />, // Thêm nút "prev" tùy chỉnh
        nextArrow: <CustomNextArrow />, // Thêm nút "next" tùy chỉnh
        responsive: [
            {
                breakpoint: 500, // Adjust this breakpoint as needed
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
        ],
    };
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${suggested}`)
            .then((response) => {
                setProducts(response.data.data)
            }
            ).catch((response) => {
                console.log(response.err)
            })
    }, [suggested]);
    const handleCardClick = (product) => {
        const url = `/product/${product.name}/undefined`
        window.location.href = url;
    };

    const containerStyle = {
        maxHeight: 'none'
    };


    return (
      <div style={{ width: '100%' }}>
      {products.some((product) => product.isHide === false && !product.variant.some((v) => v.memory)) && (
        <>
          <TitleWrapper>
            <p>Sản phẩm gợi ý</p>
          </TitleWrapper>
          <WrapperSlider {...settings}>
            {products
              .filter((product) => product.isHide === false && !product.variant.some((v) => v.memory))
              .map((product) => (
                <div className='box' key={product._id}>
                  <div className='card' onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
                    <div className='image' onClick={() => handleCardClick(product)} style={{ display: 'flex', justifyContent: 'center' }}>
                      <img src={product.thumnails[0]} alt={product.name} />
                    </div>
                    <div className='desc'>
                      <h1>{product?.name}</h1>
                      <div>
                        <div style={{ margin: 0 }}>
                          <p style={{ fontWeight: 700, height: '20px' }}>
                            {product?.variant[0]?.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>
                        </div>
                        <div style={{}}>
                          <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                            {product?.variant[0]?.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </WrapperSlider>
        </>
      )}
    </div>    
    );
}

export default SuggestProduct;
