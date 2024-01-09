package br.com.crispimlanches.loja_virtual_crispim.security;

import br.com.crispimlanches.loja_virtual_crispim.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
public class LojaVirtualCrispimConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService){
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userService);
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationSuccessHandler customAuthenticationSuccessHandler) throws Exception{
        http.authorizeHttpRequests(configurer ->
                configurer.requestMatchers("/category").hasRole("ADMIN")
                        .anyRequest().authenticated()
        ).formLogin(form ->
                form.loginPage("/showMyLoginPage")
                        .loginProcessingUrl("authenticateTheUser")
                        .successHandler(customAuthenticationSuccessHandler)
                        .permitAll()
        ).logout(logout -> logout.permitAll()
        ).exceptionHandling(configurer -> configurer.accessDeniedPage("/access-denied"));
        return http.build();

    }
}
