package com.example.wid.configuration;

import com.example.wid.security.JwtFilter;
import com.example.wid.security.JwtUtil;
import com.example.wid.security.LoginFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JwtUtil jwtUtil;

    @Autowired
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JwtUtil jwtUtil) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setExposedHeaders(Arrays.asList("Authorization"));
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf((auth) ->auth.disable());
        http.formLogin((auth) ->auth.disable());
        http.httpBasic((auth) ->auth.disable());
        http.headers((headers) -> headers.frameOptions((options) -> options.disable()));

        http.authorizeHttpRequests((auth) -> auth
                .requestMatchers("/", "/login", "/register/**", "/error").permitAll() // 해당 경로는 모두 허용
                .requestMatchers(HttpMethod.GET, "/register/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // 해당 경로는 모두 허용
                .requestMatchers("/did/**").permitAll()

                .requestMatchers("/rsa/**", "/folder/**").authenticated() // 해당 경로는 인증된 사용자만 허용

                .requestMatchers("/admin").hasRole("ADMIN") // 해당 경로는 ADMIN 권한만 허용
                .requestMatchers("/certificate/user/**").hasRole("USER") // 해당 경로는 USER 권한만 허용
                .requestMatchers("/certificate/issuer/**").hasRole("ISSUER") // 해당 경로는 ISSUER 권한만 허용
                .requestMatchers("/certificate/verifier/**").hasRole("VERIFIER") // 해당 경로는 VERIFIER 권한만 허용
        );

        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        http.addFilterBefore(new JwtFilter(jwtUtil), LoginFilter.class);
        http.addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
