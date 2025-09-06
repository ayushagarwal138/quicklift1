CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    version BIGINT,
    username VARCHAR(50) NOT NULL,
    normalized_username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    normalized_email VARCHAR(100) NOT NULL,
    password VARCHAR(120) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture_url VARCHAR(1024),
    role VARCHAR(32) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_normalized_username UNIQUE (normalized_username),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_normalized_email UNIQUE (normalized_email),
    CONSTRAINT ck_users_role CHECK (role IN ('USER', 'DRIVER', 'ADMIN'))
);

CREATE TABLE drivers (
    id BIGSERIAL PRIMARY KEY,
    version BIGINT,
    user_id BIGINT NOT NULL,
    license_number VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(32) NOT NULL,
    vehicle_model VARCHAR(255) NOT NULL,
    vehicle_color VARCHAR(255) NOT NULL,
    license_plate VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OFFLINE',
    current_latitude NUMERIC(12, 8),
    current_longitude NUMERIC(12, 8),
    rating NUMERIC(4, 2) DEFAULT 0,
    total_rides INTEGER DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_drivers_user UNIQUE (user_id),
    CONSTRAINT uk_drivers_license_number UNIQUE (license_number),
    CONSTRAINT uk_drivers_license_plate UNIQUE (license_plate),
    CONSTRAINT ck_drivers_status CHECK (status IN ('ONLINE', 'OFFLINE', 'BUSY', 'ON_TRIP')),
    CONSTRAINT ck_drivers_vehicle_type CHECK (vehicle_type IN ('SEDAN', 'SUV', 'LUXURY', 'MOTORCYCLE', 'VAN')),
    CONSTRAINT ck_drivers_latitude CHECK (current_latitude IS NULL OR current_latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_drivers_longitude CHECK (current_longitude IS NULL OR current_longitude BETWEEN -180 AND 180)
);

CREATE TABLE trips (
    id BIGSERIAL PRIMARY KEY,
    version BIGINT,
    user_id BIGINT NOT NULL,
    driver_id BIGINT,
    pickup_location VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    pickup_latitude NUMERIC(12, 8),
    pickup_longitude NUMERIC(12, 8),
    destination_latitude NUMERIC(12, 8),
    destination_longitude NUMERIC(12, 8),
    status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED',
    requested_vehicle_type VARCHAR(32) NOT NULL,
    fare NUMERIC(12, 2),
    notes VARCHAR(500),
    requested_at TIMESTAMP,
    accepted_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    rating NUMERIC(3, 2),
    review VARCHAR(1024),
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    payment_method VARCHAR(32),
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_trips_driver FOREIGN KEY (driver_id) REFERENCES drivers(id),
    CONSTRAINT ck_trips_status CHECK (status IN ('REQUESTED', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT ck_trips_vehicle_type CHECK (requested_vehicle_type IN ('SEDAN', 'SUV', 'LUXURY', 'MOTORCYCLE', 'VAN')),
    CONSTRAINT ck_trips_pickup_latitude CHECK (pickup_latitude IS NULL OR pickup_latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_trips_pickup_longitude CHECK (pickup_longitude IS NULL OR pickup_longitude BETWEEN -180 AND 180),
    CONSTRAINT ck_trips_destination_latitude CHECK (destination_latitude IS NULL OR destination_latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_trips_destination_longitude CHECK (destination_longitude IS NULL OR destination_longitude BETWEEN -180 AND 180)
);

CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    version BIGINT,
    trip_id BIGINT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    method VARCHAR(32) NOT NULL,
    provider VARCHAR(32) NOT NULL DEFAULT 'SIMULATED',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    provider_reference VARCHAR(128),
    idempotency_key VARCHAR(128),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_payments_trip FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT uk_payments_idempotency_key UNIQUE (idempotency_key),
    CONSTRAINT ck_payments_status CHECK (status IN ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED'))
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_refresh_tokens_token_hash UNIQUE (token_hash)
);

CREATE TABLE oauth_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(32) NOT NULL,
    provider_subject VARCHAR(128) NOT NULL,
    email VARCHAR(160) NOT NULL,
    email_verified BOOLEAN NOT NULL,
    linked_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_oauth_accounts_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_oauth_accounts_provider_subject UNIQUE (provider, provider_subject)
);

CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    state_code VARCHAR(255) NOT NULL,
    latitude NUMERIC(12, 8),
    longitude NUMERIC(12, 8),
    timezone VARCHAR(255),
    postal_code VARCHAR(255),
    country VARCHAR(255) DEFAULT 'India',
    country_code VARCHAR(255) DEFAULT 'IN',
    CONSTRAINT ck_cities_latitude CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_cities_longitude CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_status_vehicle ON drivers(status, vehicle_type);
CREATE INDEX idx_trips_user_requested ON trips(user_id, requested_at);
CREATE INDEX idx_trips_driver_status ON trips(driver_id, status);
CREATE INDEX idx_trips_status_requested ON trips(status, requested_at);
CREATE INDEX idx_payments_trip_id ON payments(trip_id);
CREATE INDEX idx_payments_status_created ON payments(status, created_at);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider_subject ON oauth_accounts(provider, provider_subject);
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_state ON cities(state);
CREATE INDEX idx_cities_state_code ON cities(state_code);
