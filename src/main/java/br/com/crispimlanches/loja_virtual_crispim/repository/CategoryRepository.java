package br.com.crispimlanches.loja_virtual_crispim.repository;

import br.com.crispimlanches.loja_virtual_crispim.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
