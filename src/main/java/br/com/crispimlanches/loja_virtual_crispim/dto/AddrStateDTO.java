package br.com.crispimlanches.loja_virtual_crispim.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AddrStateDTO {
    private Long id;
    private String name;
    private String acronym;
    private Boolean status;
    private Date createDate;
    private Date updateDate;

}
