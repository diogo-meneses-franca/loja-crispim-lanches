package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    User findByUserName(String userName);

    void save(User user);
}
