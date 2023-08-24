package br.com.crispimlanches.loja_virtual_crispim.repository;

import br.com.crispimlanches.loja_virtual_crispim.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
}
