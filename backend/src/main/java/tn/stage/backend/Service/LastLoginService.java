package tn.stage.backend.Service;

import org.springframework.stereotype.Service;
import tn.stage.backend.Repositories.UserRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LastLoginService {

    private static final Duration UPDATE_INTERVAL = Duration.ofMinutes(5);

    private final UserRepository userRepository;
    private final ConcurrentHashMap<String, LocalDateTime> lastRecorded = new ConcurrentHashMap<>();

    public LastLoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Always record — used on explicit sign-in (password, Google, signup). */
    public void recordLogin(String email) {
        LocalDateTime now = LocalDateTime.now();
        lastRecorded.put(email, now);
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setLastLoginAt(now);
            userRepository.save(user);
        });
    }

    /** Throttled — used when an existing JWT session hits the API. */
    public void recordLoginIfDue(String email) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime previous = lastRecorded.get(email);
        if (previous != null && previous.plus(UPDATE_INTERVAL).isAfter(now)) {
            return;
        }

        userRepository.findByEmail(email).ifPresent(user -> {
            LocalDateTime stored = user.getLastLoginAt();
            if (stored != null && stored.plus(UPDATE_INTERVAL).isAfter(now)) {
                lastRecorded.put(email, stored);
                return;
            }
            user.setLastLoginAt(now);
            userRepository.save(user);
            lastRecorded.put(email, now);
        });
    }
}
