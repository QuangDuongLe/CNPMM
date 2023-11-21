import React, { useState, useEffect } from 'react'
import { Card } from 'antd';
import { CardWrapper, Wrapper } from './style';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import Loading from '../../Components/LoadingComponents/Loading';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
        setCategories(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <Wrapper>
      <div className='background'>
        <span className='title'>Danh mục sản phẩm</span>
      </div>
      <Loading isLoading={loading}>
      <CardWrapper >
        {categories.filter((category) => category.isHide === false).map((category) => (
          <NavLink key={category._id} className='card' to={`/lowtoHigh/${category.name}`}>
            <img src={category.picture} className='img-fluid' alt='' loading="lazy"/>
            <p className='cate-name'>{category.name}</p>
          </NavLink>
        ))}
      </CardWrapper>
      </Loading>
    </Wrapper>

  )
}

export default Category