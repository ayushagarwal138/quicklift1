CREATE TABLE IF NOT EXISTS trip_messages (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    sender_user_id BIGINT NOT NULL,
    message VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_trip_messages_trip FOREIGN KEY (trip_id) REFERENCES trips(id),
    CONSTRAINT fk_trip_messages_sender_user FOREIGN KEY (sender_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_trip_messages_trip_created ON trip_messages(trip_id, created_at);
CREATE INDEX IF NOT EXISTS idx_trip_messages_sender ON trip_messages(sender_user_id);

ALTER TABLE drivers DROP CONSTRAINT IF EXISTS fk_drivers_user;
ALTER TABLE drivers ADD CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE trips DROP CONSTRAINT IF EXISTS fk_trips_user;
ALTER TABLE trips ADD CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE trips DROP CONSTRAINT IF EXISTS fk_trips_driver;
ALTER TABLE trips ADD CONSTRAINT fk_trips_driver FOREIGN KEY (driver_id) REFERENCES drivers(id);

ALTER TABLE payments DROP CONSTRAINT IF EXISTS fk_payments_trip;
ALTER TABLE payments ADD CONSTRAINT fk_payments_trip FOREIGN KEY (trip_id) REFERENCES trips(id);

ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS fk_refresh_tokens_user;
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE oauth_accounts DROP CONSTRAINT IF EXISTS fk_oauth_accounts_user;
ALTER TABLE oauth_accounts ADD CONSTRAINT fk_oauth_accounts_user FOREIGN KEY (user_id) REFERENCES users(id);
