package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface ProductService {

    ResponseEntity<ProductDTO> create(ProductDTO productDTO);

    ResponseEntity<ProductDTO> update(ProductDTO productDTO);

    ResponseEntity<String> delete(Long productId);

    ResponseEntity<Page<ProductDTO>> readAll(Pageable pageable);
}
