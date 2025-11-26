# MycoFi Earth Website - Deployment Guide

This guide covers deploying the MycoFi Earth website to your Netcup RS 8000 server using Docker and Cloudflare Tunnel.

## Architecture Overview

```
Internet → Cloudflare DNS → Cloudflare Tunnel → Netcup RS 8000 → Docker Container (Next.js)
```

- **Domain**: mycofi.earth, www.mycofi.earth
- **Server**: Netcup RS 8000 G12 Pro (159.195.32.209)
- **Container Port**: 3003 (internal: 3000)
- **Technology**: Next.js 15.5.4 with standalone output

## Prerequisites

### On Your Netcup Server

1. **Docker & Docker Compose** installed
2. **Cloudflared** (Cloudflare Tunnel daemon) installed
3. **Cloudflare Tunnel** created and configured for mycofi.earth

## Initial Setup

### 1. Clone Repository to Netcup Server

```bash
ssh netcup
cd /opt/websites  # or your preferred directory
git clone https://gitea.jeffemmett.com/jeffemmett/mycofi-earth-website.git
cd mycofi-earth-website
```

### 2. Build and Deploy with Docker Compose

```bash
# Build the Docker image
docker-compose build

# Start the container
docker-compose up -d

# Verify it's running
docker-compose ps
docker-compose logs -f
```

The website should now be accessible at `http://localhost:3003` on the Netcup server.

### 3. Set Up Cloudflare Tunnel

#### Option A: If Tunnel Already Exists

If you already have a Cloudflare Tunnel set up, update the configuration:

```bash
# Copy the config to cloudflared directory
sudo cp cloudflared-config.yml /etc/cloudflared/config.yml

# Restart cloudflared service
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
```

#### Option B: Create New Tunnel

```bash
# Install cloudflared (if not already installed)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate with Cloudflare
cloudflared tunnel login

# Create the tunnel
cloudflared tunnel create mycofi-earth-tunnel

# This creates a credentials file at:
# ~/.cloudflared/<TUNNEL-ID>.json

# Copy your credentials file to the expected location
sudo mkdir -p /root/.cloudflared
sudo cp ~/.cloudflared/<TUNNEL-ID>.json /root/.cloudflared/mycofi-earth-tunnel.json

# Copy the configuration
sudo cp cloudflared-config.yml /etc/cloudflared/config.yml

# Update the config with your actual tunnel ID
sudo nano /etc/cloudflared/config.yml

# Create DNS records (CNAME)
cloudflared tunnel route dns mycofi-earth-tunnel mycofi.earth
cloudflared tunnel route dns mycofi-earth-tunnel www.mycofi.earth

# Run as a service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
sudo systemctl status cloudflared
```

### 4. Configure DNS in Cloudflare Dashboard

Ensure these DNS records exist in your Cloudflare dashboard:

| Type  | Name | Target                          | Proxy Status |
|-------|------|---------------------------------|--------------|
| CNAME | @    | <TUNNEL-ID>.cfargotunnel.com    | Proxied      |
| CNAME | www  | <TUNNEL-ID>.cfargotunnel.com    | Proxied      |

## Updating the Website

### Method 1: Manual Update on Server

```bash
ssh netcup
cd /opt/websites/mycofi-earth-website

# Pull latest changes
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Method 2: Automated CI/CD (Future)

Set up a GitHub Action or Gitea Action to automatically deploy on push to main:

1. Trigger on push to main branch
2. SSH into Netcup server
3. Pull latest changes
4. Rebuild Docker image
5. Restart container

## Monitoring

### Check Container Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f mycofi-earth-website

# Check resource usage
docker stats mycofi-earth-website
```

### Check Cloudflare Tunnel Status

```bash
# Check service status
sudo systemctl status cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f

# Test tunnel connectivity
cloudflared tunnel info mycofi-earth-tunnel
```

### Check Website Accessibility

```bash
# From Netcup server
curl http://localhost:3003

# From internet
curl https://mycofi.earth
```

## Troubleshooting

### Container Won't Start

```bash
# Check Docker logs
docker-compose logs mycofi-earth-website

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Cloudflare Tunnel Issues

```bash
# Restart cloudflared
sudo systemctl restart cloudflared

# Check configuration
sudo cloudflared tunnel info mycofi-earth-tunnel

# Verify DNS records
nslookup mycofi.earth
```

### Port Conflicts

If port 3003 is already in use, edit `docker-compose.yml`:

```yaml
ports:
  - "3005:3000"  # Change to an available port
```

Then update `cloudflared-config.yml` to match:

```yaml
service: http://localhost:3005
```

## Performance Optimization

### Enable Caching

Next.js standalone output already includes optimizations. Additional caching can be configured in Cloudflare:

1. Go to Cloudflare Dashboard → Caching
2. Enable caching for static assets
3. Set cache TTL appropriately

### Resource Limits

To limit container resources, add to `docker-compose.yml`:

```yaml
services:
  mycofi-earth-website:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Security Considerations

1. **Firewall**: Ensure only necessary ports are open (3003 should not be publicly accessible)
2. **HTTPS**: Cloudflare Tunnel handles SSL/TLS automatically
3. **Environment Variables**: Store sensitive data in `.env` file (not committed to git)
4. **Regular Updates**: Keep Docker images and system packages updated

## Backup Strategy

```bash
# Backup script (run periodically)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/mycofi-earth"

mkdir -p $BACKUP_DIR
cd /opt/websites/mycofi-earth-website

# Backup the repository
tar -czf $BACKUP_DIR/mycofi-earth-$DATE.tar.gz .

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs rm -f
```

## Rollback Procedure

If an update causes issues:

```bash
# Stop current version
docker-compose down

# Checkout previous commit
git log --oneline  # Find previous commit hash
git checkout <previous-commit-hash>

# Rebuild and restart
docker-compose build
docker-compose up -d
```

## Support & Resources

- **Next.js Docker Docs**: https://nextjs.org/docs/deployment#docker-image
- **Cloudflare Tunnel Docs**: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Internal Docs**: See CLAUDE.md for infrastructure details

## Migration from Cloudflare Pages

This deployment replaces the previous Cloudflare Pages setup. Key changes:

1. **Static Export → Server-Side**: Changed `output: 'export'` to `output: 'standalone'`
2. **Cloudflare Pages → Docker Container**: Self-hosted on Netcup RS 8000
3. **Direct Cloudflare → Tunnel**: Traffic now routes through Cloudflare Tunnel
4. **Benefits**: More control, lower costs, integration with other services on RS 8000

## Next Steps

1. Set up automated backups
2. Configure monitoring/alerting (Prometheus + Grafana)
3. Implement CI/CD pipeline
4. Add health checks to docker-compose.yml
5. Configure log rotation for Docker logs
