package br.com.crispimlanches.loja_virtual_crispim.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CityDTO {
    private Long id;
    private String name;
    private AddrStateDTO state;
    private boolean status;
    private Date createDate;
    private Date updateDate;
}
