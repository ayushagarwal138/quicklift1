# QuickLift Production Runbook

## Environments
- Use separate Render services and databases for staging and production.
- Use Netlify deploy previews for frontend validation, with their origins added to `CORS_ALLOWED_ORIGINS`.
- Run backend with `SPRING_PROFILES_ACTIVE=prod`.

## Required Backend Environment Variables
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER=org.postgresql.Driver`, `JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect`
- `JWT_SECRET`: at least 32 bytes of high-entropy secret material.
- `JWT_ACCESS_EXPIRATION_SECONDS=900`
- `JWT_REFRESH_EXPIRATION_DAYS=30`
- `CORS_ALLOWED_ORIGINS`: comma-separated exact frontend origins.
- `FRONTEND_SUCCESS_URL`, `FRONTEND_ERROR_URL`
- Optional Google OAuth: `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID`, `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET`
- Optional bootstrap admin: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`

## Required Frontend Environment Variables
- `VITE_API_BASE_URL`: Render backend origin, for example `https://quicklift.onrender.com`
- `VITE_WS_BASE_URL`: Render WebSocket endpoint, for example `https://quicklift.onrender.com/ws`

## Migrations
- Flyway runs on backend startup in production.
- Keep migrations forward-compatible. Rollback by redeploying the prior backend image and shipping a corrective forward migration if schema changes need repair.
- Do not use `ddl-auto=update` outside local development.

## Health And Monitoring
- Configure Render health checks against `/actuator/health/readiness`.
- Monitor `/actuator/metrics`, application logs, failed login spikes, `429` rate limits, API `5xx`, database connection usage, and migration failures.

## Backups And Recovery
- Enable daily managed PostgreSQL backups and point-in-time recovery if available.
- Before launch, perform one restore drill into staging and verify login, booking, driver accept, payment, and admin dashboard flows.

## Deployment
- Run backend tests and frontend lint/build locally before pushing release changes.
- Deploy to staging first, run smoke tests, then promote to production.
- Keep production secrets only in Render and Netlify environment stores.
