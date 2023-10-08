package br.com.crispimlanches.loja_virtual_crispim.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AwsService {
    ResponseEntity<java.net.URL> getPresignedUrl();
}
