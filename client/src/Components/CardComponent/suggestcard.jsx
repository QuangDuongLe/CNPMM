import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { WrapperSuggestCard } from './styled';
import { Rate } from 'antd';
import Loading from '../LoadingComponents/Loading';

function SuggestCard({ searchKeyword }) {
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (searchKeyword) {
      getCategoryByName(searchKeyword);
    } else {
      setSearchedProducts([]);
    }
  }, [searchKeyword]);

  const getCategoryByName = async (keyword) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${keyword}`);
      const productsData = response.data.data;
      setSearchedProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };
  const handleNavLinkClick = () => {
    setSearchedProducts([]);
  };

  if (!searchKeyword || searchedProducts.length === 0) {
    return null;
  }
  const calculateAverageRating = (product) => {
    if (product.length === 0) {
      return 0;
    }

    const totalRating = product.reduce((total, item) => total + item.rating, 0);
    return totalRating / product.length;
  }
  return (
    <WrapperSuggestCard>
      <Loading isLoading={loading}>
      <div className='view-list'>
        {searchedProducts.map((product) => (
          product.variant.map((variant) => (
            <NavLink className='view-list__wrapper' to={`/product/${product.name}/${variant.memory}`} key={product._id + variant.memory} onClick={handleNavLinkClick} >
              <div className='item' >
                <div className='item__img'>
                  <img src={product.thumnails[0]} alt={product.name} loading="lazy"/>
                </div>
                <div className='item-info'>
                  <div className='item-name'>
                    <span>{product.name} - {variant.memory}</span>
                  </div>
                  <div className='item-price'>
                    <div className='box-info__box-price'>
                      <div style={{display:'flex', gap:'4px', height: '20px'}}>
                        <p className='product__price--show' style={{ fontWeight: '500' }}>
                          {variant.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                        <p className='product__price--through' style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                          {variant.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>

                      </div>
                      {product?.ratings.length > 0 ? (
                        <Rate className='stars' disabled allowHalf value={calculateAverageRating(product.ratings)} />
                      ) : (
                        null
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </NavLink>
          ))
        ))}
      </div>
      </Loading>
    </WrapperSuggestCard>
  );
}

export default SuggestCard;
