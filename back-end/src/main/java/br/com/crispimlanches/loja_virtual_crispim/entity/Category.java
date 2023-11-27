package br.com.crispimlanches.loja_virtual_crispim.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "category")
@Data
public class Category extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "status")
    private Boolean status;

}
