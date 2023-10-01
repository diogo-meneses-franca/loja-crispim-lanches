package br.com.crispimlanches.loja_virtual_crispim.repository;


import br.com.crispimlanches.loja_virtual_crispim.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
