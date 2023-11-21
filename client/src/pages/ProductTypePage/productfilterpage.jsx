import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Menu, Row } from 'antd'
import ListBrand from "../../Components/ListBrandComponent/ListBrandComponent";
import Header from "../../Components/Header/header";
import FilterCard from "../../Components/CardComponent/filtercard";
import Slide from "../../Components/Slider/Slide"
import { WrapperContent, WrapperTextValue, WrapperType, WrapperFilterList } from "./style";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { DownOutlined, FallOutlined, RiseOutlined } from '@ant-design/icons';
import axios from "axios";

const FilterProductPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    const location = useLocation();
    const { nameCategory, nameBrand } = useParams();

    const isFilterPage = location.pathname.startsWith(`/lowtoHigh`);
    const isFilterPage1 = location.pathname.startsWith(`/hightoLow`);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [includeOldPrice, setIncludeOldPrice] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const handlePriceSelection = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
    };
    const handlememory = (memory) => {
        setSelectedMemory(memory);
    };
    const handleOldPrice = (value) => {
        if (value === true) {
            setIncludeOldPrice(true);
        } else {
            setIncludeOldPrice(false);
        }
    };
    const handle = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedMemory('');
        setIncludeOldPrice('');
    };
    let pathToUse;
    if (location.pathname.startsWith('/lowtoHigh')) {
        pathToUse = '/lowtoHigh';
    } else if (location.pathname.startsWith('/hightoLow')) {
        pathToUse = '/hightoLow';
    }
    else if (location.pathname.startsWith('/type')) {
        pathToUse = '/lowtoHigh';
    }
    const hasNameBrand = nameBrand ? `/${nameBrand}` : '';
    const renderContent = (type, categories) => {
        switch (type) {
          case 'categories':
            return categories.map((category) => (
              <NavLink to={`/lowtoHigh/${category.name}`} key={category._id}>
                 <WrapperTextValue active={nameCategory === category.name}>
                  <div onClick={handle}>{category.name}</div>
                </WrapperTextValue>
              </NavLink>
            ));
          default:
            return {};
        }
      };
    const menu1 = (
        <Menu>
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 2000000)}>
                Dưới 2 triệu
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(2000000, 4000000)}>
                Từ 2 đến 4 triệu
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(4000000, 7000000)}>
                Từ 4 đến 7 triệu
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(7000000, 13000000)}>
                Từ 7 đến 13 triệu
            </Menu.Item>
            <Menu.Item key="5" onClick={() => handlePriceSelection(13000000, 20000000)}>
                Từ 13 đến 20 triệu
            </Menu.Item>
            <Menu.Item key="6" onClick={() => handlePriceSelection(20000000, 999999999999)}>
                Trên 20 triệu
            </Menu.Item>
        </Menu>
    );
    const menu2 = (
        <Menu>
            <Menu.Item key="5" onClick={() => handlememory('32GB')}>
                32GB
            </Menu.Item>
            <Menu.Item key="6" onClick={() => handlememory('64GB')}>
                64GB
            </Menu.Item>
            <Menu.Item key="7" onClick={() => handlememory('128GB')}>
                128GB
            </Menu.Item>
            <Menu.Item key="8" onClick={() => handlememory('256GB')} >
                256GB
            </Menu.Item>
            <Menu.Item key="9" onClick={() => handlememory('512GB')}>
                512GB
            </Menu.Item>
            <Menu.Item key="10" onClick={() => handlememory('1TB')}>
                1TB
            </Menu.Item>
        </Menu>
    );
    const menu3 = (
        <Menu>
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 50000)}>
                Dưới 50.000đ
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(50000, 100000)}>
                Từ 50.000 - 100.000đ
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(100000, 200000)}>
                Từ 100.000 - 200.000đ
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(200000, 500000)}>
                Từ 200.000 - 500.000đ
            </Menu.Item>
            <Menu.Item key="5" onClick={() => handlePriceSelection(500000, 99999999999)}>
                Trên 500.000đ
            </Menu.Item>
        </Menu>
    );
    const menu4 = (
        <Menu>
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 300000)}>
                Dưới 300.000đ
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(300000, 500000)}>
                Từ 30.000 - 500.000đ
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(500000, 700000)}>
                Từ 500.000 - 700.000đ
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(700000, 999999999999)}>
                Trên 700.000đ
            </Menu.Item>
        </Menu>
    );
    const menu5 = (
        <Menu>
            <Menu.Item key="1" onClick={() => handlePriceSelection(0, 200000)}>
                Dưới 200.000đ
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handlePriceSelection(200000, 500000)}>
                Từ 200.000 - 500.000đ
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handlePriceSelection(500000, 1000000)}>
                Từ 500.000 - 1 triệu
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handlePriceSelection(1000000, 2000000)}>
                Từ 1 - 2 triệu
            </Menu.Item>
            <Menu.Item key="5" onClick={() => handlePriceSelection(2000000, 4000000)}>
                Từ 2 - 4 triệu
            </Menu.Item>
            <Menu.Item key="6" onClick={() => handlePriceSelection(4000000, 999999999999)}>
                Trên 4 triệu
            </Menu.Item>
        </Menu>
    );
    const [categories, setCategories] = useState([]);

    useEffect(() => {
  
      const fetchCategories = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/getAll`);
          setCategories(response.data.data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách danh mục:', error);
        }
      };
      fetchCategories();
    }, []);
    return (
        <WrapperType>
            <Header />
            <div className="container" style={{ width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
                <div className="navi" style={{width: '100%'}}>
                    <br></br>
                    <Slide/>
                    <WrapperContent>
                        {renderContent('categories', categories)}
                    </WrapperContent>
                    <ListBrand />
                    {nameCategory ? (
                        <WrapperFilterList>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <NavLink to={`/lowtoHigh/${nameCategory}${hasNameBrand}`} >
                                    <Button style={{ display: 'inline-flex', alignItems: 'center' }} className={isFilterPage ? 'memory-button selected' : 'memory-button'} onClick={handle}>
                                        <RiseOutlined style={{ verticalAlign: 'middle', marginRight: '5px' }} />Giá Thấp - Cao
                                    </Button>
                                </NavLink>
                                <NavLink to={`/hightoLow/${nameCategory}${hasNameBrand}`}>
                                    <Button style={{ display: 'inline-flex', alignItems: 'center' }} className={isFilterPage1 ? 'memory-button selected' : 'memory-button'} onClick={handle}>
                                        <FallOutlined style={{ verticalAlign: 'middle', marginRight: '5px' }} />Giá Cao - Thấp
                                    </Button>
                                </NavLink>
                            </div>
                            {nameCategory === `Tai nghe` && (
                                <Dropdown overlay={menu5} placement="bottomLeft">
                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                        Giá <DownOutlined />
                                    </a>
                                </Dropdown>
                            )}
                            {nameCategory === `Cáp sạc` && (
                                <Dropdown overlay={menu3} placement="bottomLeft">
                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                        Giá <DownOutlined />
                                    </a>
                                </Dropdown>
                            )}
                            {nameCategory === `Ốp lưng` && (
                                <Dropdown overlay={menu3} placement="bottomLeft">
                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                        Giá <DownOutlined />
                                    </a>
                                </Dropdown>
                            )}
                            {nameCategory === `Pin dự phòng` && (
                                <Dropdown overlay={menu4} placement="bottomLeft">
                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                        Giá <DownOutlined />
                                    </a>
                                </Dropdown>
                            )}
                            {nameCategory === `Điện thoại` && (
                                <Dropdown overlay={menu1} placement="bottomLeft">
                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                        Giá <DownOutlined />
                                    </a>
                                </Dropdown>
                            )}
                            {nameCategory === `Điện thoại` && (
                                <Dropdown overlay={menu2} placement="bottomLeft">
                                    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                        Bộ nhớ <DownOutlined />
                                    </a>
                                </Dropdown>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    style={{
                                        marginLeft: '10px',
                                        border: includeOldPrice ? '1px solid red' : '',
                                    }}
                                    onClick={() => handleOldPrice(!includeOldPrice)}
                                >
                                    Giảm giá
                                </Button>
                            </div>
                        </WrapperFilterList>
                    ) : (
                        null
                    )}
                </div>
                <div style={{ width: '100%', background: '#fff', borderRadius: '6px' }}>
                    <FilterCard
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        includeOldPrice={includeOldPrice}
                        selectedMemory={selectedMemory}
                    />
                </div>
            </div>
        </WrapperType>
    )
}

export default FilterProductPage;