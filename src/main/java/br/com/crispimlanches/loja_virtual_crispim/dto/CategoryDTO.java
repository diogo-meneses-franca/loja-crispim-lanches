package br.com.crispimlanches.loja_virtual_crispim.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private Date createDate;
    private Date updateDate;
    private Boolean status;
}
