package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.dto.AddrStateDTO;
import br.com.crispimlanches.loja_virtual_crispim.service.AddrStateService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/addrState")
public class AddrStateController {
    private AddrStateService addrStateService;

    @Autowired
    public AddrStateController(AddrStateService addrStateService){
        this.addrStateService = addrStateService;
    }

    @PostMapping
    public ResponseEntity<AddrStateDTO> create(@RequestBody AddrStateDTO addrStateDTO){
        return addrStateService.create(addrStateDTO);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<AddrStateDTO> update(@RequestBody AddrStateDTO addrStateDTO){
        return addrStateService.update(addrStateDTO);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<String> delete(@PathVariable("id") Long addrStateId){
        return addrStateService.delete(addrStateId);
    }

    @GetMapping
    public ResponseEntity<Page<AddrStateDTO>> readAll(Pageable pageable){
        return addrStateService.realAll(pageable);
    }
}
