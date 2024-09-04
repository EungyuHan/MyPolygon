import styled,{keyframes} from 'styled-components';
import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import axios from 'axios';

function ConfirmCertificationModal(props) {
    const [isChecked,setIsChecked] = useState(false);
    const navigate = useNavigate();

    const submit = () => {
        //axios 통신으로 데이터 보내기

        navigate('/AdminPage');
    }

    return(
        <Modals>
            <ModalContent>
            
                    <FormH4>인 증 명  <FormInput value='[프로젝트] 소프트웨어공학캡스톤프로젝트'/></FormH4>
                    <FormH4>신 청 인  <FormInput value='Name'/></FormH4>
                    <FormH4>만료기한  <FormInput value='2025.09.11'/></FormH4>
            
                <h3 style={{color:'white'}}>인증 유의사항</h3>
                <InformDiv>
                    <InformText>해당 내역은 네크워크 내에 저장되며 만료기한까지 유효합니다.</InformText>
                    <InformText> </InformText>
                    <InformText> </InformText>
                    <InformText>이슈어의 키로 암호화되기 때문에 해당 내용을 증명해준</InformText>
                    <InformText>교수님의 성함이 블록체인 내에 저장이 된다는 사실을 고지합니다.</InformText>
                </InformDiv>

                <Button name={'인증완료'}  onClick={submit}></Button>

            </ModalContent>
        </Modals>
    )
}

const Modals = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    display: block;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:2;
`

const ModalContent = styled.div`
    position: relative;
    top: 10%;
    display: block;
    width: 50%;
    height: 70%;
    padding: 40px;
    margin: auto;
    text-align: center;
    background: linear-gradient(to top, #FFFFFF, #0083b0);
    border-radius: 10px;
    box-shadow:0 2px 3px 0 rgba(34,36,38,0.15);
`

const FormH4 = styled.h4`
    size: 5;
    margin: auto;
    padding: 5px 10px;
    color: white;
    text-align: left; // 텍스트를 왼쪽으로 정렬합니다.
  width: 80%;
`

const FormInput =  styled.input`
    padding: 6px 25px;
    margin: 2px 2px;
    border-radius: 5px;
    border: none;
    width: 55%; // 폭을 100%로 설정하여 글씨가 잘리지 않도록 합니다.
    box-sizing: border-box;
`

const InformDiv = styled.div`
    position: relative;
    width:80%;
    height: 50%;
    display: flex;
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    margin:auto;
    text-align: center;
    background-color:white;
    border-radius:10px;
`
const InformText = styled.h4`
    margin:10px;
`
export default ConfirmCertificationModal;