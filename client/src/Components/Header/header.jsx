import React, { useState, useEffect } from "react";
import { Badge, Button, Col, Menu, Dropdown, FloatButton } from 'antd';
import axios from "axios";
import { CustomerServiceOutlined } from '@ant-design/icons';
import { WrapperCartButton, WrapperHeaderAccount, WrapperHeaderImage, WrapperHeaderProduct, WrapperSearch, WrapperSuperHeader } from "./style";
import Search from "antd/es/input/Search";
import {
  ShoppingCartOutlined,
  SearchOutlined,
  UserOutlined,
  FacebookOutlined,
  InstagramOutlined,
  GoogleOutlined,
  GithubOutlined
} from '@ant-design/icons';
import Login from "./login"
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody
} from 'mdb-react-ui-kit';
import Register from "./register";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux'
import { resetUser } from "../../redux/Slide/userSlice";
import { NavLink } from "react-router-dom";
import SuggestCard from "../CardComponent/suggestcard";



const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState('');
  const handleSearch = () => {
    if (searchKeyword) {
      axios.get(`${process.env.REACT_APP_API_URL}/product/searchProduct?keyword=${searchKeyword}`)
        .then((response) => {
          window.location.href = `/lowtoHigh?keyword=${searchKeyword}`;
        })
        .catch((error) => {
          console.error('Lỗi khi gọi API tìm kiếm: ', error);
        });
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/Logout`, {}, { withCredentials: true });
      dispatch(resetUser)
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng xuất:', error);
    }
  };
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [centredModal, setCentredModal] = useState(false);
  const toggleShow = () => setCentredModal(!centredModal);

  const [centredModal1, setCentredModal1] = useState(false);

  const toggleShow1 = () => setCentredModal1(!centredModal1);

  const user = useSelector((state) => state.user)
  const closePopup = () => {
    setCentredModal(false);
  };

  const menu = (
    <Menu>
      {user.role_id === 1 && (
        <Menu.Item key="1">
          <NavLink to="/admin">Quản lý</NavLink>
        </Menu.Item>
      )}
      <Menu.Item key="2">
        <NavLink to="/profile">Thông tin cá nhân</NavLink>
      </Menu.Item>
      <Menu.Item key="4">
        <NavLink to="/orders">Đơn hàng của bạn</NavLink>
      </Menu.Item>
      <Menu.Item key="3">
        <NavLink onClick={handleLogout}>Đăng xuất</NavLink>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    if (user && user._id) {
      axios.get(`${process.env.REACT_APP_API_URL}/cart/getToCart/${user._id}`)
        .then((response) => {
          const cartData = response.data.data;
          setData(cartData);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
        });
    }
  }, [user]);
  const [data, setData] = useState(null);
  return (
    <WrapperSuperHeader >
      <div className="header-container" >
        <div className="first-com">
          <NavLink to={`/`} className="ant-image" >
            <img className="logo" src="../../image/didong1.png" alt="blink" />
          </NavLink>
        </div>
        <div className="second-com">
          <div className="search-box" >
            {!isHiddenSearch && (
              <div style={{ width: `100%`, display: 'flex', flexDirection: 'column' }}>
                <Search
                  placeholder="Tìm Kiếm"
                  onSearch={(value) => {
                    if (value) {
                      handleSearch();
                    }
                  }}
                  enterButton={
                    <Button style={{
                      backgroundImage: 'linear-gradient(to bottom, #ff914d, #ffde59)',
                    }}>
                      <SearchOutlined style={{ width: '10px', height: '20px', color: 'black' }} />
                    </Button>
                  }
                  size="large"
                  value={searchKeyword}
                  onChange={(e) => {
                    const newSearchKeyword = e.target.value;
                    setSearchKeyword(newSearchKeyword);
                  }}
                  allowClear />
                   <div style={{ width: `190%`, display: 'flex', flexDirection: 'column' }}>
                  <SuggestCard searchKeyword={searchKeyword} />
                  </div>
                <div className="link-sp"> 
                  <a href="/warranty" style={{ color: '#fff' }}>Tra cứu bảo hành</a>
                  <a href="#" style={{ color: '#fff' }}>Chính sách bảo hành</a>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="third-com">
          <NavLink to={`/cart`} className="btn-cart">
            {!isHiddenCart && (
              <Badge count={data ? data.length : 0} size="small">
                <button class="custom-button" style={{ backgroundColor: '#CC0000', right: '0px' }}>
                  <ShoppingCartOutlined style={{ fontSize: '20px' }} >
                  </ShoppingCartOutlined>&nbsp;Giỏ hàng
                </button>
              </Badge>
            )}
          </NavLink>
          <div className="header-acc">
            {user?.fullName ? (
              <div>
                <Dropdown overlay={menu} placement="bottomLeft" style={{ width: '50px', height: '50px', cursor: 'pointer' }} >
                  <div className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    <UserOutlined style={{ fontSize: '20px' }} /> Xin chào, {user.fullName}
                  </div>
                </Dropdown>
              </div>
            ) : (
              <div>
                <div class="popup" onClick={toggleShow}>
                  <span style={{ fontSize: '15px' }} >
                    Đăng nhập
                  </span>
                </div>
                <span style={{ fontSize: '15px' }} > &nbsp; / &nbsp; </span>
                <div class="popup" onClick={toggleShow1}>
                  <span style={{ fontSize: '15px' }} >
                    Đăng ký&nbsp;
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{
            right: 24,
            bottom: 97,
          }}
          icon={<CustomerServiceOutlined />}
          tooltip={<div>Chăm sóc khách hàng</div>}>
          <FloatButton icon={<FacebookOutlined />} href="https://www.facebook.com/didonggenz" tooltip={<div>Facebook</div>} />
          <FloatButton icon={<InstagramOutlined />} tooltip={<div>Instagram</div>} />
          <FloatButton icon={<GithubOutlined />} href="https://github.com/nguyenduynguyen06/TieuLuanChuyenNganh" tooltip={<div>Github</div>} />
        </FloatButton.Group>
        <FloatButton.BackTop
          style={{
            right: 24,
          }} />
      </div>
      <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal} >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <Login onClose={closePopup} />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>



      <MDBModal show={centredModal1} tabIndex='-1' setShow={setCentredModal1}>
        <MDBModalDialog size='xl'>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow1}></MDBBtn>
            </MDBModalHeader>
            <Register></Register>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </WrapperSuperHeader>
  )
}
export default Header