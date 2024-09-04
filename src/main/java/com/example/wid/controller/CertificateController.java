package com.example.wid.controller;

import com.example.wid.dto.ClassCertificateDTO;
import com.example.wid.dto.CompetitionCertificateDTO;
import com.example.wid.dto.SentCertificateDTO;
import com.example.wid.dto.base.BaseCertificateJson;
import com.example.wid.entity.enums.CertificateType;
import com.example.wid.service.CertificateService;
import com.example.wid.service.FabricService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.hyperledger.fabric.client.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/certificate")
public class CertificateController {
    private final CertificateService certificateService;
    private final FabricService fabricService;
    @Autowired
    public CertificateController(CertificateService certificateService, FabricService fabricService) {
        this.certificateService = certificateService;
        this.fabricService = fabricService;
    }


    @PostMapping(path = "/user/class", consumes = {"multipart/form-data"})
    public ResponseEntity<String> createClassCertificate(@ModelAttribute ClassCertificateDTO classCertificateDTO) throws IOException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        certificateService.createCertificate(classCertificateDTO, authentication, CertificateType.CLASS_CERTIFICATE);

        return ResponseEntity.ok("수업 증명서 생성 완료");
    }

    @PostMapping("/user/competition")
    public ResponseEntity<String> createCompetitionCertificate(@ModelAttribute CompetitionCertificateDTO competitionCertificateDTO) throws IOException{
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        certificateService.createCertificate(competitionCertificateDTO, authentication, CertificateType.COMPETITION_CERTIFICATE);

        return ResponseEntity.ok("대회 증명서 생성 완료");
    }

    @GetMapping("/issuer/list")
    public ResponseEntity<List<BaseCertificateJson>> getCertificateListIssuer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<BaseCertificateJson> issuerCertificates = certificateService.getIssuerCertificates(authentication);
        return ResponseEntity.ok(issuerCertificates);
    }

    @PostMapping("/issuer/sign")
    public ResponseEntity<String> signCertificateIssuer(@RequestBody Map<String, Long> map) throws EndorseException, CommitException, SubmitException, CommitStatusException {
        Long certificateId = map.get("certificateId");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, String> certificateMap = certificateService.signCertificateIssuer(certificateId, authentication);
        fabricService.addNewAssets(certificateMap);
        return ResponseEntity.ok("증명서 1차 서명 완료");
    }

    @PostMapping("/issuer/resign")
    public ResponseEntity<String> signCertificateUser(@RequestBody Map<String, Long> map) throws EndorseException, CommitException, SubmitException, CommitStatusException {
        Long certificateId = map.get("certificateId");
        System.out.println("Certificate ID : " + certificateId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, String> certificateMap = certificateService.signCertificateUser(certificateId);
        fabricService.addNewAssets(certificateMap);
        return ResponseEntity.ok("증명서 2차 서명 완료");
    }

    @GetMapping("/user/list/signed")
    public ResponseEntity<List<Map<String, String>>> getCertificateJson() throws GatewayException, NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, InvalidKeySpecException, BadPaddingException, InvalidKeyException, JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // 임시
//        List<Map<String, String>> allCertificates = new ArrayList<>();
        List<Map<String, String>> allCertificates = fabricService.getAllUserCertificates(authentication);
        return ResponseEntity.ok(allCertificates);
    }

    @GetMapping("/verifier/list/info")
    public ResponseEntity<List<SentCertificateDTO>> getVerifierCertificateInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<SentCertificateDTO> verifierCertificates = certificateService.getVerifierCertificates(authentication);
        return ResponseEntity.ok(verifierCertificates);
    }
}
