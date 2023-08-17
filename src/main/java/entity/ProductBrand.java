package entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "productBrand")
@Data
public class ProductBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Boolean status;

}
