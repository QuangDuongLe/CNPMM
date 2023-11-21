import styled from "styled-components";
export const Wrapper = styled.div`
  .background {
    padding: 10px;
    background-image: linear-gradient(to right, #5170ff,  #ff66c4);
    border-radius: 6px 6px 0 0;
  }
  .title{
    font-size: 22px;
    color: #fff;
    fontWeight: 600;
    text-transform: uppercase;
  }
`

export const CardWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-auto-rows: minmax(min-content,max-content);
  grid-template-columns: repeat(auto-fit,minmax(0,1fr));
  overflow: hidden;
  border-radius: 0 0 8px 8px;
  border: 1px solid #000;
  height: auto;
  .card{
      width:100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      max-height: 200px;
  }
  .img-fluid {
    height: 50%;
    width: auto;
    display: flex;
    align-items: center;
  }
  .img-fluid img{
      width: 100px;
      height: 100px;
  }
  .cate-name{
    color: #000;
    text-transform: uppercase;
    font-weight: 500;
  } 
  .card:hover {
    transform: scale(1);
    z-index:1;
    background: #9999ff;
  }

  @media screen and (max-width: 500px) {
      grid-template-columns: repeat(4,minmax(0,1fr));
      .img-fluid {
        padding-top: 5px;
        min-height: 50%;
        height: auto;
        width: 50%;
      }
      .cate-name{
        font-size: 12px;
      } 
  }
`