import React from 'react';
import styled from 'styled-components';

/* 가장 간단한 버튼 모양  */

const ButtonEx = styled.button`
background-color:#0A377C; /* 메인색상 */
border: none;
color: white;
padding: 15px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
cursor: pointer;
border-radius: 8px;
`;

function Button(props) {
    const ID = props.name;
    return(
        <ButtonEx onClick={props.onClick}>{ID}</ButtonEx>
    )
}

export default Button;