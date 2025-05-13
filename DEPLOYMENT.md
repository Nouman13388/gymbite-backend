# Deployment Guide for EC2

## Prerequisites
- EC2 instance running Ubuntu
- Node.js and npm installed
- Git installed
- PM2 installed globally

## Step 1: Server Setup

1. Connect to your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

3. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Install Git:
```bash
sudo apt-get install git
```

5. Install PM2 globally:
```bash
sudo npm install -g pm2
```

## Step 2: Application Deployment

1. Clone the repository:
```bash
git clone https://github.com/your-username/gymbite-backend.git
cd gymbite-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
nano .env
```
Add your environment variables:
```
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

4. Build the application:
```bash
npm run build
```

## Step 3: PM2 Configuration

1. Start the application:
```bash
pm2 start dist/index.js --name "gymbite-backend"
```

2. Save the process list:
```bash
pm2 save
```

3. Generate startup script:
```bash
sudo pm2 startup
```

4. Verify the application is running:
```bash
pm2 list
```

You should see output similar to:
```
┌────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name              │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ gymbite-backend   │ default     │ 1.0.0   │ fork    │ 1502     │ 0s     │ 0    │ online    │ 0%       │ 33.1mb   │ ubuntu   │ disabled │
```

## Step 4: Security Configuration

1. Configure firewall (if not already done):
```bash
sudo ufw allow 3000
sudo ufw allow 22
sudo ufw enable
```

2. Set up SSL (optional but recommended):
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

## Step 5: Monitoring and Maintenance

1. Monitor application:
```bash
pm2 monit
```

2. View logs:
```bash
pm2 logs gymbite-backend
```

3. Restart application:
```bash
pm2 restart gymbite-backend
```

4. Update application:
```bash
git pull
npm install
npm run build
pm2 restart gymbite-backend
```

## Common Issues and Solutions

1. Permission Issues:
```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/.pm2
```

2. Port Already in Use:
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

3. Memory Issues:
```bash
pm2 start ecosystem.config.js --max-memory-restart 1G
```

4. Log Rotation:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup and Recovery

1. Backup PM2 process list:
```bash
pm2 save
```

2. Backup environment variables:
```bash
cp .env .env.backup
```

3. Backup database (if applicable):
```bash
pg_dump your_database > backup.sql
```

## Health Checks

1. Check application status:
```bash
pm2 list
```

2. Check system resources:
```bash
pm2 monit
```

3. Check application logs:
```bash
pm2 logs gymbite-backend --lines 100
```

## Maintenance Commands

1. Update Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Update PM2:
```bash
sudo npm install -g pm2@latest
```

3. Clean up old logs:
```bash
pm2 flush
```

## Troubleshooting

1. Application not starting:
```bash
pm2 logs gymbite-backend --lines 100
```

2. Memory issues:
```bash
pm2 monit
```

3. Permission issues:
```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/.pm2
```

4. Database connection issues:
```bash
pm2 logs gymbite-backend --lines 100
```

## Security Best Practices

1. Keep system updated:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Use strong passwords
3. Enable firewall
4. Use SSL/TLS
5. Regular security audits
6. Monitor system logs
7. Regular backups

## Performance Optimization

1. Enable PM2 cluster mode:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "gymbite-backend",
    script: "./dist/index.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
```

2. Monitor memory usage:
```bash
pm2 monit
```

3. Set up log rotation:
```bash
pm2 install pm2-logrotate
```

## Regular Maintenance Tasks

1. Weekly:
- Check system updates
- Monitor logs
- Check disk space
- Verify backups

2. Monthly:
- Security updates
- Performance review
- Log rotation
- Database maintenance

3. Quarterly:
- Full system audit
- Performance optimization
- Security review
- Backup verification