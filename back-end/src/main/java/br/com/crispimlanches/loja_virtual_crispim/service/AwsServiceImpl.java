package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.utils.UniqueFileKeyGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class AwsServiceImpl implements AwsService {

    @Override
    public ResponseEntity<URL> getPresignedUrl() {
        String key = UniqueFileKeyGenerator.generateUniqueFileKey();
        S3Presigner presigner = S3Presigner.create();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket("loja-crispim")
                .key(key)
                .contentType("image/jpeg")
                .build();

        PutObjectPresignRequest putObjectPresignRequest =
                PutObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(60))
                        .putObjectRequest(putObjectRequest)
                        .build();

        PresignedPutObjectRequest presignedPutObjectRequest =
                presigner.presignPutObject(putObjectPresignRequest);
        return new ResponseEntity<>(presignedPutObjectRequest.url(), HttpStatus.OK);

    }
}