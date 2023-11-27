package br.com.crispimlanches.loja_virtual_crispim.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "image")
@Data
public class Image extends Auditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "url")
    private String url;

    @Column(name = "status")
    private boolean status;
}
