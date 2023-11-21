// src/CartComponent/CartItem.js

import React, { useEffect, useState } from 'react';

import { HeaderWrapper } from './style';
import { ArrowLeftOutlined } from "@ant-design/icons";

function CartHeader({ product, removeFromCart }) {


  const goBack = () => {
    window.history.back();
  };

  return (
    <HeaderWrapper>
      <div className='cart-page-header'>
        <div className="btn-back">
          <a onClick={goBack}>
            <ArrowLeftOutlined /> Quay lại
          </a>
        </div>
        <div className='cart-page-logo' >
          <a viewBox="0 0 192 65" className='logo-icon' href='/'>
            <img src='../../image/didong2.png' />
          </a>
          <a className='cart-page-name' href='/cart'>Giỏ hàng</a>
        </div>
      </div>
    </HeaderWrapper>

  );
}

export default CartHeader;
