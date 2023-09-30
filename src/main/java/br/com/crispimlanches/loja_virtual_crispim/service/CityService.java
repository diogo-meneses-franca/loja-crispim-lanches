package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.CityDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface CityService {
    ResponseEntity<CityDTO> create(CityDTO cityDTO);

    ResponseEntity<CityDTO> update(CityDTO cityDTO);

    ResponseEntity<String> delete(Long cityId);

    ResponseEntity<Page<CityDTO>> readAll(Pageable pageable);
}
