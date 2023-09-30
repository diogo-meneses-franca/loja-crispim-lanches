package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.CategoryDTO;
import br.com.crispimlanches.loja_virtual_crispim.entity.Category;
import br.com.crispimlanches.loja_virtual_crispim.repository.CategoryRepository;
import br.com.crispimlanches.loja_virtual_crispim.utils.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService{

    private CategoryRepository categoryRepository;
    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }
    @Override
    public ResponseEntity<CategoryDTO> create(CategoryDTO categoryDTO) {
        Category category = ParseUtils.parse(categoryDTO, Category.class);
        category.setStatus(true);
        CategoryDTO response = ParseUtils.parse(categoryRepository.saveAndFlush(category), CategoryDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<CategoryDTO> update(CategoryDTO categoryDTO) {
        Category category = ParseUtils.parse(categoryDTO, Category.class);
        CategoryDTO response = ParseUtils.parse(categoryRepository.saveAndFlush(category), CategoryDTO.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> delete(Long id) {
        Category category = categoryRepository.findById(id).get();
        category.setStatus(false);
        categoryRepository.saveAndFlush(category);
        return new ResponseEntity<>("Dado excluído com sucesso!", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Page<CategoryDTO>> readAll(Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.findAll(pageable);
        Page<CategoryDTO> categoryDTOPage = categoryPage.map(category -> ParseUtils.parse(category, CategoryDTO.class));
        return new ResponseEntity<>(categoryDTOPage, HttpStatus.OK);
    }
}
