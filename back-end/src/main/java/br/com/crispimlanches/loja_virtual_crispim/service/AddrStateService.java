package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.AddrStateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AddrStateService {
    ResponseEntity<AddrStateDTO> create(AddrStateDTO addrStateDTO);

    ResponseEntity<AddrStateDTO> update(AddrStateDTO addrStateDTO);

    ResponseEntity<String> delete(Long addrStateId);

    ResponseEntity<Page<AddrStateDTO>> realAll(Pageable pageable);


}
