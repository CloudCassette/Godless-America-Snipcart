# 🏠 Homelab Server Deployment Guide

## Quick Deployment (Recommended)

1. **Clone the repository on your server:**
   ```bash
   git clone https://github.com/CloudCassette/Godless-America-Snipcart.git
   cd Godless-America-Snipcart
   ```

2. **Run the automated deployment script:**
   ```bash
   ./deploy.sh
   ```

3. **Configure your environment:**
   - Edit `.env.local` with your Snipcart API keys
   - Update `NEXT_PUBLIC_SITE_URL` with your server's IP
   - Set a secure admin password

4. **Access your store:**
   - Local: http://localhost:3000
   - Network: http://YOUR_SERVER_IP:3000

## Manual Deployment

If you prefer manual control:

### Prerequisites
```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Log out and back in
```

### Step-by-Step

1. **Configure environment:**
   ```bash
   cp .env.production .env.local
   nano .env.local  # Edit with your settings
   ```

2. **Get Snipcart API keys:**
   - Go to https://app.snipcart.com
   - Create account → API Keys
   - Copy Public and Secret keys to `.env.local`

3. **Deploy with Docker:**
   ```bash
   # Build and start
   docker-compose -f docker-compose.prod.yml up -d --build
   
   # Run migrations
   docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
   
   # Seed database
   docker-compose -f docker-compose.prod.yml exec app npm run db:seed
   ```

## Production Optimizations

### 1. Domain Setup
Update your `.env.local`:
```env
NEXT_PUBLIC_SITE_URL="https://yourstore.com"
```

### 2. SSL/HTTPS Setup
```bash
# Enable Nginx proxy
docker-compose -f docker-compose.prod.yml --profile nginx up -d

# Add SSL certificates to ./nginx/ssl/
```

### 3. Backup Setup
```bash
# Database backup script
docker exec ecommerce_db pg_dump -U ecommerce_user ecommerce_db > backup-$(date +%Y%m%d).sql

# Automate with cron
echo "0 2 * * * cd /path/to/project && docker exec ecommerce_db pg_dump -U ecommerce_user ecommerce_db > backup-\$(date +%Y%m%d).sql" | crontab -
```

### 4. Monitoring
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check container health
docker-compose -f docker-compose.prod.yml ps
```

## Firewall Configuration

```bash
# Open required ports (Ubuntu/Debian with ufw)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # Application (if not using reverse proxy)
sudo ufw enable
```

## Updating Your Store

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run any new migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check what's using port 3000
   sudo netstat -tulpn | grep :3000
   
   # Change port in docker-compose.prod.yml if needed
   ```

2. **Database connection issues:**
   ```bash
   # Check database logs
   docker-compose -f docker-compose.prod.yml logs db
   
   # Verify database is accessible
   docker-compose -f docker-compose.prod.yml exec db psql -U ecommerce_user -d ecommerce_db -c "SELECT 1;"
   ```

3. **Build failures:**
   ```bash
   # Clean build
   docker system prune -a
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable firewall
- [ ] Set up SSL certificates
- [ ] Regular backups configured
- [ ] Snipcart API keys secured
- [ ] Database password changed from default

## Performance Tips

1. **Enable Redis caching** (already included)
2. **Use CDN for static assets**
3. **Optimize images** before uploading
4. **Monitor resource usage** with `docker stats`
5. **Set up log rotation**

## Support

- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Database backup: `./scripts/backup-db.sh`
- Health check: `curl http://localhost:3000/`
