package br.com.crispimlanches.loja_virtual_crispim.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name="cost_value")
    private BigDecimal costValue;

    @Column(name = "sale_value")
    private BigDecimal saleValue;


    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "status")
    private Boolean status;

    @OneToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REMOVE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id")
    @Setter
    private List<Image> images;
}
