package com.quicklift.backend.dto;

import java.lang.reflect.Field;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;

class DtoSafetyTest {
    @Test
    void userSummaryResponseExcludesSensitiveFields() {
        Set<String> fieldNames = fieldNames(UserSummaryResponse.class);
        assertFalse(fieldNames.contains("password"));
        assertFalse(fieldNames.contains("normalizedEmail"));
        assertFalse(fieldNames.contains("normalizedUsername"));
        assertFalse(fieldNames.contains("version"));
    }

    @Test
    void tripResponseAndDriverResponseExcludeSensitiveNestedIdentifiers() {
        Set<String> tripFields = fieldNames(TripResponse.class);
        Set<String> driverFields = fieldNames(DriverResponse.class);
        assertFalse(tripFields.contains("password"));
        assertFalse(tripFields.contains("normalizedEmail"));
        assertFalse(driverFields.contains("licenseNumber"));
        assertFalse(driverFields.contains("version"));
    }

    private Set<String> fieldNames(Class<?> clazz) {
        return Set.of(clazz.getDeclaredFields()).stream()
            .map(Field::getName)
            .collect(Collectors.toSet());
    }
}
