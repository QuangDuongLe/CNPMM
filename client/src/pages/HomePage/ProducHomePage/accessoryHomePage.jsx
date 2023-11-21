import React, { useState, useEffect, useRef } from 'react';
import { WrapperButtonMore, WrapperCard } from '../styled';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Rate } from 'antd';
import Loading from '../../../Components/LoadingComponents/Loading';

function AccessoryHomePage() {
  const [products, setProducts] = useState([]);
  const [cardsToShow, setCardsToShow] = useState(6);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCategoryByName();
  }, []);

  const getCategoryByName = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const allCategories = res.data.data;
      const phoneCategory = allCategories.find((cat) => cat.name === 'Điện thoại');
      const phoneCategoryId = phoneCategory ? phoneCategory._id : null;
      const otherCategories = allCategories.filter((cat) => cat._id !== phoneCategoryId);
      const productPromises = otherCategories.map((category) => {
        return axios.get(`${process.env.REACT_APP_API_URL}/product/getIdByCategory/${category._id}`);
      });
      const productsData = await Promise.all(productPromises);
      const allProducts = productsData.flatMap((response) => response.data.data);
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };


  const calculateTotalRatings = (product) => {
    if (!product || !product.ratings) {
      return 0;
    }

    return product.ratings.length;
  }
  const buttonStyle = {
    border: '1px solid #ff3300',
    color: '#ff3300',
    width: '240px',
    height: '38px',
    borderRadius: '4px',
    fontWeight: 500,
  };

  const buttonHoverStyle = {
    backgroundColor: '#ff3300',
    color: 'white',
    width: '240px',
    height: '38px',
    borderRadius: '4px',
    fontWeight: 500,
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const hasMoreProducts = products.length > cardsToShow;
  const calculateAverageRating = (product) => {
    if (product.length === 0) {
      return 0;
    }

    const totalRating = product.reduce((total, item) => total + item.rating, 0);
    return totalRating / product.length;
  }
  return (
    <WrapperCard>
      <img className='imgtt' src="..\..\image\banneracc.png" style={{ width: '100%' }} alt='title'></img>
      <Loading isLoading={loading}>
      <div className='mainContainerAcc' style={{ alignItems: 'center', justifyContent: 'center' }}>
        {products.filter((product) => product.isHide === false).slice(0, cardsToShow).map((product) => (
          <NavLink className='box' key={product._id} to={`/product/${product.name}/undefined`}>
            <div className='card' >
              <div className="image">
                <img src={product.thumnails[0]} loading="lazy" />
              </div>
              <div className='desc' >
                <div className='name'>
                  <h1 style={{ padding: 3 }}>{product?.name}</h1>
                </div>
                <div>
                  {product?.ratings.length > 0 ? (
                    <div style={{ display: "flex", gap: '0', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: 0 }}>
                      <Rate style={{ margin: 0 }} disabled allowHalf value={calculateAverageRating(product.ratings)} />
                      <span style={{ margin: 0, height: '25px', fontSize: '13px' }}>Lượt đánh giá: {calculateTotalRatings(product)}</span>
                    </div>
                  ) : (
                    null
                  )}
                  <div style={{ margin: 0 }}>
                    <p style={{ fontWeight: 700, height: '20px' }}>
                      {product?.variant[0]?.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </div>
                  <div style={{}}>
                    <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>{product?.variant[0]?.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      {hasMoreProducts && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <WrapperButtonMore
            textButton="Xem thêm"
            type="outline"
            styleButton={isButtonHovered ? buttonHoverStyle : buttonStyle}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onClick={() => {
              setCardsToShow(cardsToShow + 6); // Increase the number of cards to show
            }}          >
          </WrapperButtonMore>
        </div>)}
        </Loading>
    </WrapperCard>
  );
}

export default AccessoryHomePage;
