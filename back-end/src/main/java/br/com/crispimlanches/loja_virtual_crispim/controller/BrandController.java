package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.dto.BrandDTO;
import br.com.crispimlanches.loja_virtual_crispim.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/brand")
@CrossOrigin
public class BrandController {
    private BrandService brandService;
    @Autowired
    public BrandController(BrandService brandService){
        this.brandService = brandService;
    }

    @PostMapping
    public ResponseEntity<BrandDTO> create(@RequestBody BrandDTO brandDTO){
        return brandService.create(brandDTO);
    }

    @PutMapping
    public ResponseEntity<BrandDTO> update(@RequestBody BrandDTO brandDTO){
        return brandService.update(brandDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id){
        return brandService.delete(id);
    }

    @GetMapping
    public ResponseEntity<Page<BrandDTO>> readAll(Pageable pageable){
        return brandService.readAll(pageable);
    }
}
