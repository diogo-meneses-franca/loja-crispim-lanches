package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.dto.CityDTO;
import br.com.crispimlanches.loja_virtual_crispim.service.CityService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/city")
public class CityController {
    private CityService cityService;
    @Autowired
    public CityController(CityService cityService){
        this.cityService = cityService;
    }

    @PostMapping
    public ResponseEntity<CityDTO> create(@RequestBody CityDTO cityDTO){
        return cityService.create(cityDTO);
    }
    @PutMapping
    @Transactional
    public ResponseEntity<CityDTO> update(@RequestBody CityDTO cityDTO){
        return cityService.update(cityDTO);
    }
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<String> delete(@PathVariable("id") Long cityId){
        return cityService.delete(cityId);
    }

    @GetMapping
    public ResponseEntity<Page<CityDTO>> readAll(Pageable pageable){
        return cityService.readAll(pageable);
    }

}
