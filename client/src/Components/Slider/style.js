import { Row } from "antd";
import styled from "styled-components";

export const WrapperBanner = styled.div`
    width:100%;
    display: flex;
    flex-direction: row;
    justify-items: stretch;
    .slider{
        height:auto;
    }
    .mainbanner {
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.05);
        border-radius: 0.125rem;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        overflow: hidden;
        width:66.5%;
    }
    .right-banner {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        display: flex;
        flex-direction: column;
        margin-left: 0.3125rem;
        gap: 4px;
        width: 33.5%;
    }
    .right-banner .imgsmall {
        width: 100%;
    }
    .right-banner .imgsmall img{
        width: 100%;
    }
    @media screen and (max-width: 500px) {
        flex-direction:column;
        .mainbanner {
            width: 100%;
        }
        .right-banner {
            width: 100%;
            flex-direction: row;
            margin-left: 0;

        }
    }
  
    
`