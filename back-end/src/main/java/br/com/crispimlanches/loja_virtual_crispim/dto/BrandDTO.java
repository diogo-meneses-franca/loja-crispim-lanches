package br.com.crispimlanches.loja_virtual_crispim.dto;

import lombok.Data;

import java.util.Date;

@Data
public class BrandDTO {
    private Long id;
    private String name;
    private Boolean status;
    private Date createDate;
    private Date updateDate;


}
