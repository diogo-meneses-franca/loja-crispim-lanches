package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.BrandDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface BrandService {
    ResponseEntity<BrandDTO> create(BrandDTO brandDTO);

    ResponseEntity<BrandDTO> update(BrandDTO brandDTO);

    ResponseEntity<HttpStatus> delete(Long id);

    ResponseEntity<Page<BrandDTO>> readAll(Pageable pageable);
}
