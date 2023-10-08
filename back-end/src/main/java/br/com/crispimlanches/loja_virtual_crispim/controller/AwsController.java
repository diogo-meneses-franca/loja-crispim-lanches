package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.service.AwsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;

@RequestMapping("/presignedUrl")
@CrossOrigin
@RestController
public class AwsController {
    private AwsService awsService;

    @Autowired
    public AwsController(AwsService awsService){
        this.awsService = awsService;
    }

    @GetMapping
    ResponseEntity<URL> getPresignedUrl(){
        return awsService.getPresignedUrl();
    }
}
