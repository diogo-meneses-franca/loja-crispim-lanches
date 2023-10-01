package br.com.crispimlanches.loja_virtual_crispim.repository;

import br.com.crispimlanches.loja_virtual_crispim.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
