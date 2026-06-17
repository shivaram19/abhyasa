#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/var/www/abhyasa"
WEB_ROOT="/var/www/abhyasa.trayini.ai"
DOMAIN="abhyasa.trayini.ai"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

echo "Building Abhyāsa static export..."
cd "$REPO_DIR"
pnpm install
pnpm build

echo "Copying static export to web root..."
mkdir -p "$WEB_ROOT"
cp -r "$REPO_DIR/dist/"* "$WEB_ROOT/"
chown -R www-data:www-data "$WEB_ROOT"

echo "Installing Nginx config..."
cp "$REPO_DIR/deployment/nginx/${DOMAIN}" "$NGINX_CONF"
ln -sf "$NGINX_CONF" "/etc/nginx/sites-enabled/${DOMAIN}"

echo "Obtaining SSL certificate..."
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m admin@trayini.ai

echo "Reloading Nginx..."
nginx -t
systemctl reload nginx

echo "Deployment complete: https://${DOMAIN}"
