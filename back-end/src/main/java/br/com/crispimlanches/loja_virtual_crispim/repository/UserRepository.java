package br.com.crispimlanches.loja_virtual_crispim.repository;

import br.com.crispimlanches.loja_virtual_crispim.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findUserByUsername(String userName);
}
