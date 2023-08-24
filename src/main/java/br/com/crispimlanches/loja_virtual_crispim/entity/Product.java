package br.com.crispimlanches.loja_virtual_crispim.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private BigDecimal costValue;
    private BigDecimal saleValue;
    @ManyToOne
    @JoinColumn(name = "brandId")
    private ProductBrand brand;
    @ManyToOne
    @JoinColumn(name = "categoryId")
    private Category category;
    private Boolean status;
}
