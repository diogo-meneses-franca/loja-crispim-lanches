package entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "productCategory")
@Data
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

}
