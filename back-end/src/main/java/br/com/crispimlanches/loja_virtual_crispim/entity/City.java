package br.com.crispimlanches.loja_virtual_crispim.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "city")
@Data
@NoArgsConstructor
public class City extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name ="addrstate_id")
    private AddrState addrState;

    @Column(name = "status")
    private Boolean status;


}