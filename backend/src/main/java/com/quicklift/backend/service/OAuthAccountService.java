package com.quicklift.backend.service;

import com.quicklift.backend.model.OAuthAccount;
import com.quicklift.backend.model.User;
import com.quicklift.backend.model.UserRole;
import com.quicklift.backend.repository.OAuthAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class OAuthAccountService {
    private final OAuthAccountRepository oauthAccountRepository;
    private final UserService userService;
    private final SecureRandom secureRandom = new SecureRandom();

    public OAuthAccountService(OAuthAccountRepository oauthAccountRepository, UserService userService) {
        this.oauthAccountRepository = oauthAccountRepository;
        this.userService = userService;
    }

    @Transactional
    public User linkOrCreateGoogleUser(String providerSubject, String email, boolean emailVerified, String firstName, String lastName) {
        if (!emailVerified) {
            throw new IllegalArgumentException("Google email must be verified");
        }
        return oauthAccountRepository.findByProviderAndProviderSubject("google", providerSubject)
            .map(OAuthAccount::getUser)
            .orElseGet(() -> linkByEmailOrCreate(providerSubject, email, firstName, lastName));
    }

    private User linkByEmailOrCreate(String providerSubject, String email, String firstName, String lastName) {
        User user = userService.findByEmail(email).orElseGet(() -> {
            User created = new User();
            created.setUsername(uniqueUsername(email));
            created.setEmail(email);
            created.setPassword(randomPassword());
            created.setFirstName(firstName == null || firstName.isBlank() ? "QuickLift" : firstName);
            created.setLastName(lastName == null || lastName.isBlank() ? "User" : lastName);
            created.setRole(UserRole.USER);
            return userService.createUser(created, UserRole.USER);
        });

        OAuthAccount oauthAccount = new OAuthAccount();
        oauthAccount.setUser(user);
        oauthAccount.setProvider("google");
        oauthAccount.setProviderSubject(providerSubject);
        oauthAccount.setEmail(email);
        oauthAccount.setEmailVerified(true);
        oauthAccountRepository.save(oauthAccount);
        return user;
    }

    private String uniqueUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^A-Za-z0-9_]", "");
        if (base.length() < 3) {
            base = "user";
        }
        String candidate = base;
        int suffix = 1;
        while (userService.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }
        return candidate;
    }

    private String randomPassword() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
