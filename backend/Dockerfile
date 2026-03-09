# Stage 1: Build/install dependencies with full tooling
FROM php:8.3-fpm-alpine3.21 AS build
RUN apk upgrade --no-cache \
    && apk add --no-cache \
        git \
        curl \
        libpng-dev \
        freetype-dev \
        libjpeg-turbo-dev \
        oniguruma-dev \
        libxml2-dev \
        libzip-dev \
        zip \
        unzip

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --prefer-dist --no-interaction
COPY . .
RUN composer dump-autoload --optimize

# Stage 2: Lean runtime image
FROM php:8.3-fpm-alpine3.21 AS runner
RUN apk upgrade --no-cache \
    && apk add --no-cache \
        libpng \
        freetype \
        libjpeg-turbo \
        oniguruma \
        libzip \
        netcat-openbsd

# Copy compiled PHP extensions from build stage instead of recompiling
COPY --from=build /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=build /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

WORKDIR /var/www
COPY --from=build /var/www .

RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
