import React from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const buttonStyle = {
    position: 'absolute',
    top: '80%',
    left: '80%',
    transform: 'translate(-50%, -50%)',
    width: '15%',
    height: '6%',
    background: '#fff'
  };
  const buttonHoverStyle = {
    backgroundColor: '#5170ff', // Màu nền khi hover
    color: 'white', // Màu chữ khi hover
  };


  return (
    <div className="not-found-container" style={{ position: 'relative' }}>
      <img src='../../image/404.png' alt='404' style={{ width: '100%' }} />
      <MDBBtn style={buttonStyle} hoverStyle={buttonHoverStyle}>
        <Link to="/" style={{color: '#5170ff', fontSize: '16px', fontWeight: 'bold'}}>Trở về trang chủ</Link>
      </MDBBtn>
    </div>
  );
}

export default NotFoundPage;
