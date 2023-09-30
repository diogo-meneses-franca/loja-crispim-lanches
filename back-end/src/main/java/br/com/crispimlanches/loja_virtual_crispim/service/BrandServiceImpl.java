package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.BrandDTO;
import br.com.crispimlanches.loja_virtual_crispim.entity.Brand;
import br.com.crispimlanches.loja_virtual_crispim.repository.BrandRepository;
import br.com.crispimlanches.loja_virtual_crispim.utils.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BrandServiceImpl implements BrandService{
    private BrandRepository brandRepository;
    @Autowired
    public BrandServiceImpl(BrandRepository brandRepository){
        this.brandRepository = brandRepository;
    }


    @Override
    public ResponseEntity<BrandDTO> create(BrandDTO brandDTO) {
        Brand brand = ParseUtils.parse(brandDTO, Brand.class);
        brand.setStatus(true);
        BrandDTO response = ParseUtils.parse(brandRepository.saveAndFlush(brand), BrandDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<BrandDTO> update(BrandDTO brandDTO) {
        Brand brand = ParseUtils.parse(brandDTO, Brand.class);
        BrandDTO response = ParseUtils.parse(brandRepository.saveAndFlush(brand), BrandDTO.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<HttpStatus> delete(Long id) {
        Brand brand = brandRepository.findById(id).get();
        brand.setStatus(false);
        brandRepository.saveAndFlush(brand);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<Page<BrandDTO>> readAll(Pageable pageable) {
        Page<Brand> brandPage = brandRepository.findAll(pageable);
        Page<BrandDTO> brandDTOPage = brandPage.map(brand -> ParseUtils.parse(brand, BrandDTO.class));
        return new ResponseEntity<>(brandDTOPage, HttpStatus.OK);
    }
}
