import styled,{keyframes} from 'styled-components';
import React,{ useState } from 'react';
import Button from './Button';
import axios from 'axios';


function CreateUser(props){
    const [id, setID] = useState("");
    const [password, setPassword] = useState("");
    const [checkPW, setCheckPW] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isCreated, setCreated] = useState(false);
    const [isChecked, setIsChecked]  = useState(true);

    const Check = (e) => {
        e.preventDefault();
        if(!id) {
            return alert("사용자 ID를 입력해주세요");
        }
        else if (!password) {
            return alert("passward를 입력해주세요");
        }
        else if ( password != checkPW){
            return alert("비밀번호가 서로 동일하지 않습니다");
        }
        else if (!name) {
            return alert("사용자의 이름을 적어주세요");
        }
        else {
            sendUserInfo();    
    };
    }
    
    const sendUserInfo = () => {
        props.UserInfo.username = id;
        props.UserInfo.email = email;
        props.UserInfo.phone = phone;
        props.UserInfo.name = name;
        props.UserInfo.password = password;
        console.log(props.UserInfo);
        if(props.UserInfo.Role == "User"){
            axios.post('http://localhost:8080/register/user', props.UserInfo)
        }
        else if(props.UserInfo.Role == "Issuer"){
            axios.post('http://localhost:8080/register/issuer', props.UserInfo)
        }
        else if(props.UserInfo.Role == "Verifier"){
            axios.post('http://localhost:8080/register/verifier', props.UserInfo)
        }
        setCreated(true);
    }

    const closeModal = () => {
            props.onClose();
    }
    
    return(

        <Modals>
            
            {isCreated === false && 
            <ModalContent>
            <button onClick={props.onClose}>취소</button>
                <form onSubmit={Check}>
                <img src='img/logo.png' width={`180px`} height={`180px`}></img>
                    <div>
                    <Create type='text' size="30" value={id} placeholder="사용할 ID를 입력해주세요" onChange={(e)=>{
                        setID(e.target.value)
                    }}></Create>
                    </div>
                    <div>
                    <Create type='password' size="30" value={password} placeholder="사용할 패스워드를 입력해주세요" onChange={(e)=>{
                        setPassword(e.target.value)
                    }}></Create>
                    </div>
                    <div>
                    <Create type='password' size="30"value={checkPW} placeholder="패스워드를 한번 더 입력해주세요" onChange={(e)=>{
                        setCheckPW(e.target.value)
                    }}></Create>
                    </div>
                    <div>
                    <Create type='text' size="30"value={name} placeholder="이름" onChange={(e)=>{
                        setName(e.target.value)
                    }}></Create>
                    <Create type='text' size="30"value={email} placeholder="이메일" onChange={(e)=>{
                        setEmail(e.target.value)
                    }}></Create>
                    </div>
                    <Create type='text' size="30"value={phone} placeholder="전화번호" onChange={(e)=>{
                        setPhone(e.target.value)
                    }}></Create>
                    <div>
                    <Button name="제출하기"><input type='submit'></input></Button>
                    </div>
                </form>
            </ModalContent>
            
            }

            
            {isCreated === true && 
            <ModalContent>
                <PrivateKeyModal>
                    <h3>'{props.UserInfo.name}' 회원님</h3>
                    <h3>회원가입을 환영합니다.</h3>
                    <Instruction>비밀번호가 공개되지 않도록 주의해주세요</Instruction>
                    <div>
                    <h5>로그인 후 서비스를 이용해주세요.</h5>
                    <input type={'checkbox'} onClick={()=>{setIsChecked(!isChecked)}}></input>
                    </div>
                    <Button name={"닫기"} onClick={closeModal} disabled={isChecked}></Button>
                </PrivateKeyModal>
                
            </ModalContent>
            }
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
    background-color: #cacfd3;
    border-radius: 10px;
    box-shadow:0 2px 3px 0 rgba(34,36,38,0.15);
`
const Create = styled.input`
    padding: 10px 25px;
    margin: 5px 10px;
    border-radius: 5px;
    border: none;
    box-shadow:0 2px 3px 0 rgba(34,36,38,0.15);
`

const PrivateKeyModal = styled.div`
    position: relative;
    top: 10%;
    display: block;
    justify-content: center;
    width: 50%;
    height: 70%;
    padding: 40px;
    margin: auto;
    text-align: center;
    background: #06345a3d;
    border-radius: 10px;
    box-shadow:0 2px 3px 0 rgba(34,36,38,0.15);
`

const PrivateKeyDiv = styled.div`
    background-color: White;
    display: flex;
    width: 75%;
    height: 15%;
    margin: auto;
    justify-content: center;
    align-items: center;
    margin: auto;
    border-radius: 10px;
`

const ShowPrivateKey = styled.div`
    position: relative;
    background-color: White;
    width: 95%;
    height: 80%;
    margin: auto;
    overflow-x: auto; 
    white-space: nowrap; 
`

const colorChange = keyframes`
    0% {
        color: red; 
    }
    50% {
        color: white; 
    }
    100% {
        color: red; 
    }
`;

const Instruction = styled.h5`
    animation: ${colorChange} 4s infinite;
`


export default CreateUser;