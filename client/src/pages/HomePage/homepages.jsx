import React, { useEffect } from "react";
import { WrapperHomePage } from "./styled";
import { Col, Row } from 'antd'
import Category from '../category/category'
import Slide from "../../Components/Slider/Slide"
import Imagebanner from "./imagebanner";
import ProductHomePage from "./ProducHomePage/producthomepage";
import AccessoryHomePage from "./ProducHomePage/accessoryHomePage";
import Header from "../../Components/Header/header";

const HomePage = () => {
  useEffect(()=>{
    window.scrollTo({top:0,behavior: "instant"})
},[])
  return (
    <div className="home-container" >
      <Header></Header>
      <br></br>
      
      <WrapperHomePage style={{display:'flex', justifyContent: 'center', padding: '4%'}}>
        <Col style={{ width: '100%'}}>
          <div >
            <Slide />
          </div>
          <br /> <br />
          <Category></Category>
          <br /><br />
          <ProductHomePage></ProductHomePage>
          <br></br>
          <AccessoryHomePage></AccessoryHomePage>
        </Col>
      </WrapperHomePage>
    </div>

  );
}
export default HomePage