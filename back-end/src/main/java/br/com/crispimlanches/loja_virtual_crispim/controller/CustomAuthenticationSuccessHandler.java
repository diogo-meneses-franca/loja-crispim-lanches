package br.com.crispimlanches.loja_virtual_crispim.controller;

import br.com.crispimlanches.loja_virtual_crispim.entity.User;
import br.com.crispimlanches.loja_virtual_crispim.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Controller;

import java.io.IOException;

@Controller
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private UserService userService;
    @Autowired
    public CustomAuthenticationSuccessHandler(UserService userService){
        this.userService = userService;
    }


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String userName = authentication.getName();

        User user = userService.findByUserName(userName);

        HttpSession session = request.getSession();

        session.setAttribute("user", user);

        response.sendRedirect(request.getContextPath() + "/");
    }
}
