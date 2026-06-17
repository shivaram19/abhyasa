# Deploy Abhyāsa to `abhyasa.trayini.ai`

This folder contains everything needed to deploy the landing page as a subdomain of `trayini.ai` using Nginx.

## Recommended approach: static export

The app is configured to export a static site (`output: export`, `distDir: dist` in `next.config.ts`). Nginx serves plain HTML/CSS/JS files—no Node.js process is required in production.

### Prerequisites on the `trayini.ai` server

- Nginx installed
- `certbot` + python3-certbot-nginx installed
- DNS `A` record for `abhyasa.trayini.ai` pointing to the server public IP (`20.125.62.241`)
- `pnpm` and Node.js available

### One-time setup

```bash
# 1. Clone the repo
sudo mkdir -p /var/www/abhyasa
sudo git clone https://github.com/shivaram19/abhyasa.git /var/www/abhyasa
sudo chown -R $USER:$USER /var/www/abhyasa

# 2. Build the static export
cd /var/www/abhyasa
pnpm install
pnpm build

# 3. Copy the static export to the web root
sudo mkdir -p /var/www/abhyasa.trayini.ai
sudo cp -r dist/* /var/www/abhyasa.trayini.ai/
sudo chown -R www-data:www-data /var/www/abhyasa.trayini.ai

# 4. Install the Nginx config
sudo cp deployment/nginx/abhyasa.trayini.ai /etc/nginx/sites-available/abhyasa.trayini.ai
sudo ln -sf /etc/nginx/sites-available/abhyasa.trayini.ai /etc/nginx/sites-enabled/abhyasa.trayini.ai

# 5. Obtain SSL certificate (requires the DNS A record to already resolve)
sudo certbot --nginx -d abhyasa.trayini.ai

# 6. Reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

Or run the helper script (as root):

```bash
sudo bash /var/www/abhyasa/deployment/scripts/deploy-static.sh
```

### Subsequent updates

```bash
cd /var/www/abhyasa
git pull
pnpm install
pnpm build
sudo cp -r dist/* /var/www/abhyasa.trayini.ai/
sudo chown -R www-data:www-data /var/www/abhyasa.trayini.ai
sudo nginx -t && sudo systemctl reload nginx
```

## Alternative approach: reverse proxy to Next.js server

If you prefer server-side rendering or need Next.js features that require a running server:

1. Use `deployment/nginx/abhyasa.trayini.ai.reverse-proxy` instead of the static config.
2. Copy `deployment/systemd/abhyasa.service` to `/etc/systemd/system/`.
3. Run:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now abhyasa
   ```
4. The service runs `pnpm start` on port `3030`; Nginx proxies to it.

## Files

| File | Purpose |
|------|---------|
| `nginx/abhyasa.trayini.ai` | Static-export Nginx server block |
| `nginx/abhyasa.trayini.ai.reverse-proxy` | Reverse-proxy Nginx server block |
| `scripts/deploy-static.sh` | One-command static deployment script |
| `systemd/abhyasa.service` | systemd unit for the reverse-proxy approach |
