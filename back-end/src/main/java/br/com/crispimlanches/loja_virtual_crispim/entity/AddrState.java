package br.com.crispimlanches.loja_virtual_crispim.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addr_state")
@Data
@NoArgsConstructor
public class AddrState extends Auditable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "acronym")
    private String acronym;

    @Column(name = "status")
    private Boolean status;


}
