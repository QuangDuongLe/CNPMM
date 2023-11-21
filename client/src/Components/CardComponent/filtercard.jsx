import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Pagination, Rate } from 'antd';
import { WrapperCard, WrapperFilterCard } from './styled';
import { InfoCircleFilled } from '@ant-design/icons'
import Loading from '../LoadingComponents/Loading';

function FilterCard({ minPrice, maxPrice, includeOldPrice, selectedMemory }) {
  const { nameCategory, nameBrand } = useParams();
  const location = useLocation();
  const searchKeyword = new URLSearchParams(location.search).get('keyword');
  const [products, setProducts] = useState([]);
  const propertyNames = ["RAM", "Dung lượng pin", "Chip xử lý (CPU)"];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (searchKeyword) {
      performSearch(searchKeyword);
    }
  }, [searchKeyword]);
  const performSearch = (keyword) => {
    axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${keyword}`)
      .then((response) => {
        const productsData = response.data.data;
        setProducts(productsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API tìm kiếm: ', error);
        setLoading(false);
      });
  };
  useEffect(() => {
    setLoading(true);
    if (nameCategory) {
      if (nameBrand) {
        if (minPrice !== null && maxPrice !== null || includeOldPrice !== null || selectedMemory !== null) {
          if (location.pathname.startsWith('/lowtoHigh')) {
            getProductsByCategoryAndBrandWithPrice(nameCategory, nameBrand, minPrice, maxPrice, includeOldPrice, selectedMemory);
          } else if (location.pathname.startsWith('/hightoLow')) {
            getProductsByCategoryAndBrandHightoLowWithPrice(nameCategory, nameBrand, minPrice, maxPrice, includeOldPrice, selectedMemory);
          }
        } else {
          if (location.pathname.startsWith('/lowtoHigh')) {
            getProductsByCategoryAndBrand(nameCategory, nameBrand);
          } else if (location.pathname.startsWith('/hightoLow')) {
            getProductsByCategoryAndBrandHightoLow(nameCategory, nameBrand);
          }
        }
      } else {
        if (minPrice !== null && maxPrice !== null || includeOldPrice !== null || selectedMemory !== null) {
          if (location.pathname.startsWith('/lowtoHigh')) {
            getProductsByCategoryNameWithPrice(nameCategory, minPrice, maxPrice, includeOldPrice, selectedMemory);
          } else if (location.pathname.startsWith('/hightoLow')) {
            getProductsByCategoryNameHightoLowWithPrice(nameCategory, minPrice, maxPrice, includeOldPrice, selectedMemory);
          }
        } else {
          if (location.pathname.startsWith('/lowtoHigh')) {
            getProductsByCategoryName(nameCategory);
          } else if (location.pathname.startsWith('/hightoLow')) {
            getProductsByCategoryNameHightoLow(nameCategory);
          }
        }
      }
    }

  }, [nameCategory, nameBrand, location.pathname, minPrice, maxPrice, includeOldPrice, selectedMemory]);
  useEffect(() => {
    setLoading(true);
    if (
      (minPrice !== null && maxPrice !== null) ||
      includeOldPrice !== null ||
      selectedMemory !== null
    ) {
      if (location.pathname.startsWith('/lowtoHigh')) {
        if (nameBrand) {
          getProductsByCategoryAndBrandWithPrice(nameCategory, nameBrand, minPrice, maxPrice, includeOldPrice, selectedMemory);
        } else {
          getProductsByCategoryNameWithPrice(nameCategory, minPrice, maxPrice, includeOldPrice, selectedMemory);
        }
      } else if (location.pathname.startsWith('/hightoLow')) {
        if (nameBrand) {
          getProductsByCategoryAndBrandHightoLowWithPrice(nameCategory, nameBrand, minPrice, maxPrice, includeOldPrice, selectedMemory);
        } else {
          getProductsByCategoryNameHightoLowWithPrice(nameCategory, minPrice, maxPrice, includeOldPrice, selectedMemory);
        }
      }
    }
  }, [location.search, minPrice, maxPrice, includeOldPrice, selectedMemory]);
  const getProductsByCategoryName = async (categoryName) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/${category._id}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);

    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };
  const getProductsByCategoryNameHightoLow = async (categoryName) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/highToLow/${category._id}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);

    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };
  const getProductsByCategoryNameWithPrice = async (categoryName, minPrice, maxPrice, includeOldPrice, selectedMemory) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      let queryParams = `minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&includeOldPrice=${includeOldPrice || ''}&selectedMemory=${selectedMemory || ''}`;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/${category._id}?${queryParams}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };
  const getProductsByCategoryNameHightoLowWithPrice = async (categoryName, minPrice, maxPrice, includeOldPrice, selectedMemory) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      let queryParams = `minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&includeOldPrice=${includeOldPrice || ''}&selectedMemory=${selectedMemory || ''}`;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/highToLow/${category._id}?${queryParams}`)
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };
  const getProductsByCategoryAndBrand = async (categoryName, brandName) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      const brandResponse = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand`);
      const brandsData = brandResponse.data.data;
      const brand = brandsData.find((b) => b.name === brandName);
      if (!brand) {
        console.error('Không tìm thấy thương hiệu');
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/${category._id}/${brand._id}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  }

  const getProductsByCategoryAndBrandHightoLow = async (categoryName, brandName) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      const brandResponse = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand`);
      const brandsData = brandResponse.data.data;
      const brand = brandsData.find((b) => b.name === brandName);
      if (!brand) {
        console.error('Không tìm thấy thương hiệu');
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/highToLow/${category._id}/${brand._id}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  }
  const getProductsByCategoryAndBrandWithPrice = async (categoryName, brandName, minPrice, maxPrice, includeOldPrice, selectedMemory) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      const brandResponse = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand`);
      const brandsData = brandResponse.data.data;
      const brand = brandsData.find((b) => b.name === brandName);
      if (!brand) {
        console.error('Không tìm thấy thương hiệu');
        return;
      }
      let queryParams = `minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&includeOldPrice=${includeOldPrice || ''}&selectedMemory=${selectedMemory || ''}`;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/${category._id}/${brand._id}?${queryParams}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };
  const getProductsByCategoryAndBrandHightoLowWithPrice = async (categoryName, brandName, minPrice, maxPrice, includeOldPrice, selectedMemory) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
      const categories = res.data.data;
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error('Không tìm thấy danh mục');
        return;
      }
      const brandResponse = await axios.get(`${process.env.REACT_APP_API_URL}/brand/getBrand`);
      const brandsData = brandResponse.data.data;
      const brand = brandsData.find((b) => b.name === brandName);
      if (!brand) {
        console.error('Không tìm thấy thương hiệu');
        return;
      }
      let queryParams = `minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&includeOldPrice=${includeOldPrice || ''}&selectedMemory=${selectedMemory || ''}`;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/product/filter/highToLow/${category._id}/${brand._id}?${queryParams}`
      );
      const productsData = response.data.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setLoading(false);
    }
  };


  const [currentPage, setCurrentPage] = useState(1);

  const calculateAverageRating = (product) => {
    if (product.length === 0) {
      return 0;
    }

    const totalRating = product.reduce((total, item) => total + item.rating, 0);
    return totalRating / product.length;
  }
  const calculateTotalRatings = (product) => {
    if (!product || !product.ratings) {
      return 0;
    }

    return product.ratings.length;
  }

  const calculateDiscountPercentage = (newPrice, oldPrice) => {
    if (oldPrice) {
      const discount = oldPrice - newPrice;
      const discountPercentage = (discount / oldPrice) * 100;
      return discountPercentage.toFixed(2);
    } else {
      return 0;
    }
  };

  const productsPerPage = 12;
  const totalProducts = products.filter((product) => !product.isHide).length;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, totalProducts);

  const productsToDisplay = useMemo(() => {
    return products
      .filter((product) => !product.isHide)
      .slice(startIndex, endIndex);
  }, [products, startIndex, endIndex]);

  

  return (
    <Loading isLoading={loading}>
      <div style={{ width: '100%' }}>
        <WrapperFilterCard>
          <ul className='mainContainer' style={{ alignItems: 'center', justifyContent: 'center', listStyle: 'none' }}>
            {productsToDisplay
              .filter((product) => product.isHide === false)
              .map((product) => (
                product.variant.map((variant) => (
                  <li className='box' key={product._id + variant.memory} style={{ padding: '0' }} >
                    <NavLink className='card' to={`/product/${product.name}/${variant.memory}`}>
                      <div className='item-label'>
                        {variant.oldPrice && (
                          <span className='lb-dis'>
                            Giảm giá {calculateDiscountPercentage(variant.newPrice, variant.oldPrice)}%
                          </span>
                        )}
                      </div>
                      <div className='image' style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }} >
                        <img src={product.thumnails[0]} loading="lazy"/>
                      </div>
                      <div className='desc' style={{ alignContent: 'start' }}>
                        <div style={{ height: '3em' }}>
                          <h1 style={{ padding: 3 }}>{product.name} - {variant.memory}</h1>
                        </div>
                        <div>
                          {product?.ratings.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: 'column' }}>
                              <Rate className='stars' disabled allowHalf value={calculateAverageRating(product.ratings)} />
                              <span style={{ margin: 0, height: '25px', fontSize: '13px' }}>Lượt đánh giá: {calculateTotalRatings(product)}</span>
                            </div>
                          ) : (
                            null
                          )}
                          <div style={{ padding: '0 0 30px 0' }}>
                            <p style={{ fontWeight: 700, height: '20px' }}>
                              {variant.newPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                            <p style={{ color: '#000', textDecoration: 'line-through', height: '20px' }}>
                              {variant.oldPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                          </div>
                          <div>
                            {propertyNames.map((propertyName, index) => {
                              const propertyValue = product?.properties?.[propertyName];
                              if (propertyValue !== undefined) {
                                return (
                                  <div style={{ padding: '0 7px', display: 'flex', alignItems: 'center' }}>
                                    <i class="fas fa-circle" style={{ fontSize: 3 }}></i>
                                    <p key={index} style={{ fontSize: '13px', color: 'black', textAlign: 'left', paddingLeft: '10px', margin: '0', lineHeight: '19px' }}>
                                      {propertyName}: {propertyValue}
                                    </p>
                                  </div>
                                );
                              }
                              return null; 
                            })}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                ))
              ))}
          </ul>
        </WrapperFilterCard>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          total={products.length}
          pageSize={productsPerPage}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: 'center', marginBottom: '20px' }}
        />
      </div>
    </Loading>
  );
}

export default FilterCard;
