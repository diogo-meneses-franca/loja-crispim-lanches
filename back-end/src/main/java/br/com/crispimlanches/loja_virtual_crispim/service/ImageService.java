package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.ImageDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface ImageService {

    ResponseEntity<ImageDTO> create(ImageDTO imageDTO);

    ResponseEntity<ImageDTO> update(ImageDTO imageDTO);

    ResponseEntity<String> delete(Long imageId);

    ResponseEntity<Page<ImageDTO>> readAll(Pageable pageable);
}
