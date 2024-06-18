import Button from '../Components/Button';
import React,{ useState } from 'react';
import styled from 'styled-components';
import Waves from '../Components/Waves';
import {Link, useAsyncError} from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import PDFpreviewer from '../Components/PDFpreviewer';
import ConfirmSubmitModal from '../Components/ConfirmSubmitModal';
import axios from 'axios';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function UserCreateVC() {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [professor , setProfessor] = useState("");
    const [issuer, setIssuer] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState("");

    const [file, setFile] = useState(null);
    const [sendFile, setSendFile] = useState(null);
    const [isModalopen, setModal] = useState(false);
    
    const handleFileChange = (event) =>{
        const inputFile = event.target.files[0];
        if(inputFile) {
            setSendFile(inputFile);
            const reader = new FileReader();
            reader.onload = function (event) {
                setFile(event.target.result);
            };
            reader.readAsArrayBuffer(inputFile);
        }
    }


    const submit = () => {

        if(sendFile){
            const formData = new FormData();
            formData.append('studentID', name);
            formData.append('subject', subject);
            formData.append('professor', professor);
            formData.append('summary', summary);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('issuerEmail',issuer);
            formData.append('file', sendFile);
            axios.post("http://localhost:8080/certificate/user/class", formData,{
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            });
        setModal(!isModalopen);
    }

}

    return(
        <BackGround>
            <div div style={{ zIndex: 1 }}>
                
                    <LogoContainer>
                    <img src='img/logo.png' width={`80px`} height={`80px`} alt='Logo'></img>
                    </LogoContainer>
                    <HomeContainer>
                    <Link to="/MainPage">
                        <img src='img/Home.png' width={`60px`} height={`60px`} alt='Logo'></img>
                        </Link>
                    </HomeContainer>
                    <HelpContainer>
                        <Link to="/Help">
                        <img src='img/Help.png' width={`75x`} height={`75px`} alt='Logo'></img>
                        </Link>
                    </HelpContainer>
                    
            
            <ContentContainer>
                <FormContainer>
                    <form>
                    <FormH4>신청인  <FormInput onChange={(e)=>{setName(e.target.value);}}></FormInput></FormH4>
                    <FormH4>신청교수    <FormInput onChange={(e)=>{setProfessor(e.target.value);}}></FormInput></FormH4>
                    <FormH4>과목 <FormInput onChange={(e)=>{setSubject(e.target.value);}}></FormInput></FormH4>
                    <FormH4>요청대상 <FormInput onChange={(e)=>{setIssuer(e.target.value);}}></FormInput></FormH4>
                    <FormH4>시작일 <FormInput onChange={(e)=>{setStartDate(e.target.value);}}></FormInput></FormH4>
                    <FormH4>마감일 <FormInput onChange={(e)=>{setEndDate(e.target.value);}}></FormInput></FormH4>
                    <div style={{background:'white', width:'50%'}}><input type={'file'} 
                    onChange={handleFileChange}></input></div>
                    </form>
                    <div style={{right:'10%'}}></div>
                    <Button name={'제출하기'} onClick={submit}></Button>
                </FormContainer>
    
                <DescriptionContainer>
                    <FormH4>설명</FormH4>
                    <DescriptionTextarea onChange={(e)=>{setSummary(e.target.value);}}></DescriptionTextarea>
                </DescriptionContainer>
                
                <PreviewContainer>
                    <FormH4>미리보기</FormH4>
                    <PDFpreviewer file={file}></PDFpreviewer>
                </PreviewContainer>
                
            </ContentContainer>
            
            </div>
            { isModalopen && <ConfirmSubmitModal name = {name} professor = {professor}></ConfirmSubmitModal>}
            <Waves></Waves>
        </BackGround>
    )
}



const BackGround = styled.div`
    position: fixed;
    background: linear-gradient(to right, #FFFFFF, #0083b0);
    width: 100%;
    height: 100vh;
    padding: 0px;
    display: flex;
`
const LogoContainer = styled.div`
    position: fixed; 
    width: 60%;
    height: 12%;
    left: 5%;
    background-color: transparent;
`

const HomeContainer = styled.div`
    position: fixed;
    width: 10%;
    height: 12%;
    top:1%;
    right:15%;
`
const HelpContainer = styled.div`
    position: fixed;
    width: 10%;
    height: 12%;
    right:5%;
`

const ContentContainer = styled.div`
    position: fixed;
    top: 12%;
    left: 50%;
    width: 90%;
    height: 87%;
    background-color: rgba(0, 0, 0, 0.25);
    transform: translate(-50%);
    border-radius: 15px;
`
const FormContainer = styled.div`
    position: absolute;
    top: 2%;
    left: 5%;
    width: 45%;
    height: 60%;
`

const FormH4 = styled.h4`
    margin: auto;
    padding: 5px 10px;
    color: white;
`

const FormInput = styled.input`
    padding: 6px 25px;
    margin: 2px 2px;
    border-radius: 5px;
    border: none;
    box-shadow: 0.5px 0.5px 2px black;
`

const DescriptionContainer = styled.div`
    position: absolute;
    width: 45%;
    top: 57%;
    left: 4%;
`

const DescriptionTextarea = styled.textarea`
    width: 100%;  
    height: 200px;
    border-radius: 10px;
`

const PreviewContainer = styled.div`
    position: absolute;
    top: 2%;
    right: 4%;
    width: 45%;
    height: 97%;
    overflow: auto;
    border-radius: 10px;
    background-color: #5c5c5c;
`


export default UserCreateVC;