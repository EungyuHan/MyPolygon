package com.example.wid.service;

import com.example.wid.dto.ClassCertificateDTO;
import com.example.wid.entity.ClassCertificateEntity;
import com.example.wid.entity.MemberEntity;
import com.example.wid.entity.CertificateInfoEntity;
import com.example.wid.entity.enums.CertificateType;
import com.example.wid.repository.ClassCertificateRepository;
import com.example.wid.repository.MemberRepository;
import com.example.wid.repository.SignatureInfoRepository;
import com.example.wid.repository.CertificateInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@Service
public class CertificateService {
    private final MemberRepository memberRepository;
    private final ClassCertificateRepository classCertificateRepository;
    private final CertificateInfoRepository certificateInfoRepository;
    private final SignatureInfoRepository signatureInfoRepository;

    @Autowired
    public CertificateService(MemberRepository memberRepository, ClassCertificateRepository classCertificateRepository, CertificateInfoRepository certificateInfoRepository, SignatureInfoRepository signatureInfoRepository) {
        this.memberRepository = memberRepository;
        this.classCertificateRepository = classCertificateRepository;
        this.certificateInfoRepository = certificateInfoRepository;
        this.signatureInfoRepository = signatureInfoRepository;
    }

    // 수업에 대한 증명서를 생성
    public void createClassCertificate(ClassCertificateDTO classCertificateDTO, Authentication authentication) throws IOException, ParseException {
        // 사용자 인증서 매핑정보 저장
        CertificateInfoEntity certificateInfoEntity = new CertificateInfoEntity();
        MemberEntity issuerEntity = memberRepository.findByEmail(classCertificateDTO.getIssuerEmail()).get();
        MemberEntity userEntity = memberRepository.findByUsername(authentication.getName()).get();
        certificateInfoEntity.setIssuer(issuerEntity);
        certificateInfoEntity.setUser(userEntity);
        certificateInfoEntity.setCertificateType(CertificateType.CLASS_CERTIFICATE);

        MultipartFile file = classCertificateDTO.getFile();
        String originalFilename = file.getOriginalFilename();
        String storedFilename = System.currentTimeMillis() + "_" + originalFilename;
        // 파일 저장 경로 설정
        // 저장경로 상대경로로 수정 요망
        String savePath = "C:/Users/SAMSUNG/Desktop/wid/src/main/resources/static/" + storedFilename;
        file.transferTo(new File(savePath));

        certificateInfoEntity.setOriginalFilename(originalFilename);
        certificateInfoEntity.setStoredFilename(storedFilename);


        // 인증서 생성
        ClassCertificateEntity classCertificateEntity = new ClassCertificateEntity();
        
        // 사용자가 입력한 정보 기반
        classCertificateEntity.setMajor(classCertificateDTO.getMajor());
        classCertificateEntity.setSubject(classCertificateDTO.getSubject());
        classCertificateEntity.setProfessor(classCertificateDTO.getProfessor());
        classCertificateEntity.setDetail(classCertificateDTO.getDetail());

        String startDate = classCertificateDTO.getStartDate();
        String endDate = classCertificateDTO.getEndDate();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        classCertificateEntity.setStartDate(formatter.parse(startDate));
        classCertificateEntity.setEndDate(formatter.parse(endDate));

        // 사용자의 정보 기반

        classCertificateEntity.setName(userEntity.getName());
        // 사용자의 소속 정보 기반
        // 사용자의 소속정보를 성정하는 부분이 미구현되어 임시값으로 조정
        classCertificateEntity.setBelong("JeonBuk National University");

        certificateInfoEntity.setClassCertificate(classCertificateEntity);
        classCertificateEntity.setCertificateInfo(certificateInfoEntity);

        certificateInfoRepository.save(certificateInfoEntity);
        classCertificateRepository.save(classCertificateEntity);
    }
}
