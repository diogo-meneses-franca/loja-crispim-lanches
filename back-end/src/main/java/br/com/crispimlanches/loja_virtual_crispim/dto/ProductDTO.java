package br.com.crispimlanches.loja_virtual_crispim.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal costValue;
    private BigDecimal saleValue;
    private BrandDTO brand;
    private CategoryDTO category;
    private boolean status;
    private Date createDate;
    private Date updateDate;
    private List<ImageDTO> images;
}
