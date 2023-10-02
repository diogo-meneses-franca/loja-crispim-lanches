package br.com.crispimlanches.loja_virtual_crispim.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "address")
@Data
public class Address extends Auditable {
    @Id
    private Long id;

    private boolean mainAdress;
    private String street;

    private String number;
    private String complement;
    private String district;
    @ManyToOne
    private City city;
    private String postCode;
    @ManyToOne
    private User user;

}