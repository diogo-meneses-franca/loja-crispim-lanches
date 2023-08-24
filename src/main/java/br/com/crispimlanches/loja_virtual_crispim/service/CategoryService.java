package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.CategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface CategoryService {
    ResponseEntity<CategoryDTO> create(CategoryDTO categoryDTO);

    ResponseEntity<CategoryDTO> update(CategoryDTO categoryDTO);

    ResponseEntity<String> delete(Long id);

    ResponseEntity<Page<CategoryDTO>> readAll(Pageable pageable);
}
