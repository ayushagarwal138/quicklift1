CREATE TABLE IF NOT EXISTS users (
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
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS drivers (
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
    is_available BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS trips (
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
    payment_method VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    state_code VARCHAR(255) NOT NULL,
    latitude NUMERIC(12, 8),
    longitude NUMERIC(12, 8),
    timezone VARCHAR(255),
    postal_code VARCHAR(255),
    country VARCHAR(255) DEFAULT 'India',
    country_code VARCHAR(255) DEFAULT 'IN'
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS version BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS normalized_username VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS normalized_email VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(1024);
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE users
SET normalized_username = LOWER(TRIM(username))
WHERE normalized_username IS NULL AND username IS NOT NULL;

UPDATE users
SET normalized_email = LOWER(TRIM(email))
WHERE normalized_email IS NULL AND email IS NOT NULL;

ALTER TABLE users ALTER COLUMN normalized_username SET NOT NULL;
ALTER TABLE users ALTER COLUMN normalized_email SET NOT NULL;

ALTER TABLE drivers ADD COLUMN IF NOT EXISTS version BIGINT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'OFFLINE';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS current_latitude NUMERIC(12, 8);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS current_longitude NUMERIC(12, 8);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS rating NUMERIC(4, 2) DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS total_rides INTEGER DEFAULT 0;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE trips ADD COLUMN IF NOT EXISTS version BIGINT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS started_at TIMESTAMP;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS review VARCHAR(1024);
ALTER TABLE trips ADD COLUMN IF NOT EXISTS paid BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS payment_method VARCHAR(32);

CREATE TABLE IF NOT EXISTS payments (
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
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(32) NOT NULL,
    provider_subject VARCHAR(128) NOT NULL,
    email VARCHAR(160) NOT NULL,
    email_verified BOOLEAN NOT NULL,
    linked_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_normalized_username ON users(normalized_username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_normalized_email ON users(normalized_email);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status_vehicle ON drivers(status, vehicle_type);
CREATE INDEX IF NOT EXISTS idx_trips_user_requested ON trips(user_id, requested_at);
CREATE INDEX IF NOT EXISTS idx_trips_driver_status ON trips(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_status_requested ON trips(status, requested_at);
CREATE INDEX IF NOT EXISTS idx_payments_trip_id ON payments(trip_id);
CREATE INDEX IF NOT EXISTS idx_payments_status_created ON payments(status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_idempotency_key ON payments(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_accounts_provider_subject ON oauth_accounts(provider, provider_subject);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state);
CREATE INDEX IF NOT EXISTS idx_cities_state_code ON cities(state_code);
