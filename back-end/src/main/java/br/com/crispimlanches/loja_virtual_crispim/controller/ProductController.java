package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.dto.ProductDTO;
import br.com.crispimlanches.loja_virtual_crispim.service.ProductService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/product")
@CrossOrigin
public class ProductController {
    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ProductDTO> create(@RequestBody ProductDTO productDTO){
        return productService.create(productDTO);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<ProductDTO> update(@RequestBody ProductDTO productDTO){
        return productService.update(productDTO);
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long productId){
        return productService.delete(productId);
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> readAll(Pageable pageable){
        return productService.readAll(pageable);
    }
}
