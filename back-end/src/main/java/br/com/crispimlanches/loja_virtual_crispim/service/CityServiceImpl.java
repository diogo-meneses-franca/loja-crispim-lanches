package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.CityDTO;
import br.com.crispimlanches.loja_virtual_crispim.entity.City;
import br.com.crispimlanches.loja_virtual_crispim.repository.CityRepository;
import br.com.crispimlanches.loja_virtual_crispim.utils.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CityServiceImpl implements CityService{

    private CityRepository cityRepository;
    @Autowired
    public CityServiceImpl(CityRepository cityRepository){
        this.cityRepository = cityRepository;
    }
    @Override
    public ResponseEntity<CityDTO> create(CityDTO cityDTO) {
        City city = ParseUtils.parse(cityDTO, City.class);
        CityDTO response = ParseUtils.parse(cityRepository.saveAndFlush(city), CityDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<CityDTO> update(CityDTO cityDTO) {
        City city = ParseUtils.parse(cityDTO, City.class);
        CityDTO response = ParseUtils.parse(cityRepository.saveAndFlush(city), CityDTO.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> delete(Long cityId) {
        City city = cityRepository.findById(cityId).get();
        city.setStatus(false);
        cityRepository.saveAndFlush(city);
        return new ResponseEntity<>("Dado excluído com sucesso!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Page<CityDTO>> readAll(Pageable pageable) {
        Page<City> cityPage = cityRepository.findAll(pageable);
        Page<CityDTO> cityDTOPage = cityPage.map(city -> ParseUtils.parse(city, CityDTO.class));
        return new ResponseEntity<>(cityDTOPage, HttpStatus.OK);
    }
}
