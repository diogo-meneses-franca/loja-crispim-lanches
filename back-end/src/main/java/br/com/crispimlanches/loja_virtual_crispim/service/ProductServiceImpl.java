package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.ProductDTO;
import br.com.crispimlanches.loja_virtual_crispim.entity.Product;
import br.com.crispimlanches.loja_virtual_crispim.repository.ProductRepository;
import br.com.crispimlanches.loja_virtual_crispim.utils.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProductServiceImpl implements ProductService{

    private ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository){
        this.productRepository = productRepository;
    }
    @Override
    public ResponseEntity<ProductDTO> create(ProductDTO productDTO) {
        productDTO.setStatus(true);
        Product product = productRepository.saveAndFlush(ParseUtils.parse(productDTO, Product.class));
        ProductDTO response = ParseUtils.parse(product, ProductDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ProductDTO> update(ProductDTO productDTO) {
        Product product = productRepository.saveAndFlush(ParseUtils.parse(productDTO, Product.class));
        ProductDTO response = ParseUtils.parse(product, ProductDTO.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> delete(Long productId) {
        Product product = productRepository.findById(productId).get();
        product.setStatus(false);
        productRepository.saveAndFlush(product);
        return new ResponseEntity<>("Produto inativado com sucesso", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Page<ProductDTO>> readAll(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        Page<ProductDTO> productDTOPage = productPage.map(product -> ParseUtils.parse(product, ProductDTO.class));
        return new ResponseEntity<>(productDTOPage, HttpStatus.OK);
    }
}
