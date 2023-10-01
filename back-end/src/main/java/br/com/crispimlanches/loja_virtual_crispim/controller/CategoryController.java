package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.dto.CategoryDTO;
import br.com.crispimlanches.loja_virtual_crispim.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
@CrossOrigin
public class CategoryController {
    private CategoryService categoryService;
    @Autowired
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> create(@RequestBody CategoryDTO categoryDTO){
        return categoryService.create(categoryDTO);
    }

    @PutMapping
    public ResponseEntity<CategoryDTO> update(@RequestBody CategoryDTO categoryDTO){
        return categoryService.update(categoryDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id){
        return categoryService.delete(id);
    }

    @GetMapping
    public ResponseEntity<Page<CategoryDTO>> readAll(Pageable pageable){
        return categoryService.readAll(pageable);
    }
}
