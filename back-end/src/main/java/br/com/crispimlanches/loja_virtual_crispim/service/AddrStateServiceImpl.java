package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.entity.AddrState;
import br.com.crispimlanches.loja_virtual_crispim.dto.AddrStateDTO;
import br.com.crispimlanches.loja_virtual_crispim.repository.AddrStateRepository;
import br.com.crispimlanches.loja_virtual_crispim.utils.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AddrStateServiceImpl implements AddrStateService{
    private AddrStateRepository addrStateRepository;
    @Autowired
    public AddrStateServiceImpl(AddrStateRepository addrStateRepository){
        this.addrStateRepository = addrStateRepository;
    }
    @Override
    public ResponseEntity<AddrStateDTO> create(AddrStateDTO addrStateDTO) {
        AddrState addrState = ParseUtils.parse(addrStateDTO, AddrState.class);
        addrState.setStatus(true);
        AddrStateDTO response = ParseUtils.parse(addrStateRepository.saveAndFlush(addrState), AddrStateDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<AddrStateDTO> update(AddrStateDTO addrStateDTO) {
        AddrState addrState = ParseUtils.parse(addrStateDTO, AddrState.class);
        AddrStateDTO response = ParseUtils.parse(addrStateRepository.saveAndFlush(addrState), AddrStateDTO.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> delete(Long addrStateId) {
        AddrState addrState = addrStateRepository.findById(addrStateId).get();
        addrState.setStatus(false);
        addrStateRepository.saveAndFlush(addrState);
        return new ResponseEntity<>("Dado excluído com sucesso", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Page<AddrStateDTO>> realAll(Pageable pageable) {
        Page<AddrState> addrStatePage = addrStateRepository.findAll(pageable);
        Page<AddrStateDTO> addrStateDTOPage = addrStatePage.map((addrState -> ParseUtils.parse(addrState, AddrStateDTO.class)));
        return new ResponseEntity<>(addrStateDTOPage, HttpStatus.OK);
    }
}
