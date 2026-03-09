#!/bin/sh
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
until nc -z "${DB_HOST}" "${DB_PORT}"; do
  sleep 2
done
echo "MySQL is up."

# Create minimal .env if missing (production passes config via Docker env vars)
if [ ! -f /var/www/.env ]; then
  printf "APP_KEY=%s\n" "${APP_KEY:-}" > /var/www/.env
fi

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
  echo "Generating application key..."
  php artisan key:generate --force
  echo ">>> COPY THIS TO YOUR SERVER .env: $(grep APP_KEY /var/www/.env)"
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear & cache config for production
if [ "$APP_ENV" = "production" ]; then
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
fi

exec "$@"
