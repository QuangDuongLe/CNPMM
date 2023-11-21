import styled from "styled-components";

export const WrapperDashboard = styled.div`
    .sum-box{
        display: flex;
        gap: 30px;
        justify-content: flex-start;
    }
    .sum-box-item{
        border: 2px solid #5f2b89;
        padding: 10px;
        display: flex;
        flex-direction: column;
        border-radius: 20px;
        text-align: center;
        gap: 20px;
    }
    .sum-title{
        font-size: 15px;
    }
    .sum-quantity{
        font-size: 20px;
        color: #5f2b89;
    }
`