import styled from "styled-components"; 

export const WrapperType = styled.div`
.align-checkbox {
    vertical-align: middle; /* Align the checkbox vertically with the text */
    margin-left: 10px; /* Adjust the spacing as needed */
  }
`


export const WrapperFilterList = styled.nav` 
padding: 10px;
display: flex;
gap: 10px;
flex-wrap: wrap;
.ant-dropdown-menu-item {
    padding: 8px 16px;
  }
  
  /* Style the anchor links inside dropdowns */
  .ant-dropdown-link {
    padding: 10px 20px;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    color: #000;
  }
  
  /* Adjust the position of dropdowns */
  .ant-dropdown-placement-bottomLeft .ant-dropdown-menu {
    top: 100%;
  }
  
  .ant-dropdown-placement-bottomRight .ant-dropdown-menu {
    top: 100%;
    right: 0;
  }
  .memory-button.selected {
    border: 1px solid #FE3300;
  }
`
export const WrapperTextValue =styled.div`
  margin-top: 10px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid  #9999ff; 
  padding: 10px;
  &:hover {
    a{
      color:#fff;
    }
    border: 1px solid  #fff; 
    background: #9999ff;
  }
  a {
    font-size:16px;
    font-weight: 500px;
    text-align: center;
    &:hover{
      color: #fff;
    }
  }
  ${(props) =>
    props.active &&
    `
    border: 1px solid #fff;
    background: #9999ff;
    div {
      color: #fff;
    }
  `}
`
export const WrapperContent = styled.div`
    display: flex;
    font-size: 14px;

    //align-items: center;
    gap: 12px;
`