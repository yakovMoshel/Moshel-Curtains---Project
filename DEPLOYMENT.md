# Deployment (AWS EC2)

This app is deployed as a single, persistent Node.js process on EC2 — **not** on
Amplify. Reasoning: Moshel Curtains is one unified Next.js app (pages + the
`/api/visualize` route run in the same process, unlike the AI-Workout split of
a React client + separate Express server). Hosting a Next.js app on Amplify
runs its server-rendered routes through AWS Lambda behind the scenes, which
has request payload-size limits — that directly conflicts with the 10MB image
upload the AI visualization feature already relies on
(`src/components/configurator/ai-visualization/fileValidation.ts`). EC2 avoids
that entirely.

Live example: `https://moshelhavilonot.co.il`, on Amazon Linux 2023
(`t3.micro`). All commands below assume that OS/version — package manager is
`dnf`, not `apt`.

## 1. Instance basics

- Node.js **20.x** (matches local dev — check with `node --version`)
- `git`

```bash
sudo dnf update -y
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs git
node --version   # confirm v20.x
git --version
```

### Swap (needed on a 1GB instance)

`npm run build` can exceed 1GB RAM on a `t2.micro`/`t3.micro`. Add a 2GB
swapfile so the build doesn't get OOM-killed:

```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
free -h   # confirm a Swap: line with ~2.0Gi
```

## 2. Clone + configure

```bash
cd ~
git clone https://github.com/yakovMoshel/Moshel-Curtains---Project.git
cd Moshel-Curtains---Project
npm install
```

Create `.env.local` on the server (never commit this — see `.env.example` for
the full field list):

```bash
nano .env.local
```

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

(The `NEXT_PUBLIC_EMAILJS_*` vars are only needed once the contact form is
wired up — see the note on Nodemailer/SES below. The app builds and runs fine
without them; the contact form just shows its existing error state.)

## 3. Build + run under PM2

```bash
npm run build
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # prints a command — copy/paste and run EXACTLY what it prints
pm2 save      # run again after `pm2 startup` to be safe
```

Check it's alive:

```bash
pm2 status
pm2 logs moshel-curtains
curl -I http://localhost:3000   # should be 200 OK, X-Powered-By: Next.js
```

## 4. Nginx reverse proxy

```bash
sudo dnf install -y nginx
sudo nano /etc/nginx/conf.d/moshelcurtains.conf
```

```nginx
server {
    listen 80;
    listen [::]:80;   # do NOT omit this — see gotcha below
    server_name YOUR_SERVER_IP your-domain.co.il www.your-domain.co.il;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 12M;  # headroom above the 10MB upload cap
    }
}
```

**Gotcha we actually hit:** Amazon Linux 2023's default `nginx.conf` ships a
catch-all server block listening on both `listen 80;` **and**
`listen [::]:80;` (IPv4 + IPv6). If our block only listens on `listen 80;`
(IPv4 only), any request arriving over IPv6 — e.g. `curl http://localhost`
resolving to `::1` — has no matching block on that socket and silently falls
through to Nginx's default "Welcome to nginx!" page instead of a 404 or
error, which is confusing to debug. Always include `listen [::]:80;` too.

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

**Security group:** only `80` and `443` open publicly. Keep `3000` internal
(Nginx talks to it over localhost). Restrict `22` (SSH) to your own IP.

## 5. Domain + HTTPS

Point an **A record** (and one for `www`) at the instance's IP in your
registrar's DNS panel. If it's a `.co.il` domain, note that registration
itself needs manual approval from the Israeli registry (ISOC-IL) — this can
take up to a few days _before_ the domain resolves at all, separate from
normal DNS propagation. Check with:

```bash
nslookup your-domain.co.il 8.8.8.8
```

Once it resolves, install Certbot. **Amazon Linux 2023 has no `dnf`/`apt`
package for Certbot** — install it via a Python virtual environment:

```bash
sudo dnf install -y python3 python3-pip augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```

Issue the certificate (pass `--email`/`--agree-tos`/`--no-eff-email` as flags
rather than answering the interactive prompts — typing an email at the
interactive prompt can pick up stray characters from terminal/keyboard-layout
quirks and fail validation in confusing ways):

```bash
sudo certbot --nginx -d your-domain.co.il -d www.your-domain.co.il \
  --email you@example.com --agree-tos --no-eff-email
```

This also auto-configures the HTTP → HTTPS redirect in the Nginx config.

### Auto-renewal

Amazon Linux 2023 doesn't ship `cron`/`/etc/cron.d` by default, and the
pip-installed Certbot doesn't register a systemd timer the way the
snap/package-manager install does elsewhere. Create one manually:

```bash
sudo tee /etc/systemd/system/certbot-renew.service > /dev/null << 'EOF'
[Unit]
Description=Certbot Renewal

[Service]
Type=oneshot
ExecStart=/opt/certbot/bin/certbot renew --quiet --deploy-hook "systemctl reload nginx"
EOF

sudo tee /etc/systemd/system/certbot-renew.timer > /dev/null << 'EOF'
[Unit]
Description=Run certbot renew twice daily

[Timer]
OnCalendar=*-*-* 00,12:00:00
RandomizedDelaySec=3600
Persistent=true

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now certbot-renew.timer
sudo systemctl list-timers | grep certbot   # confirm it's scheduled
```

Verify the renewal process itself works (doesn't actually renew unless
close to expiry):

```bash
sudo /opt/certbot/bin/certbot renew --dry-run
```

## 6. Deploying updates

```bash
git pull
npm install
npm run build
pm2 reload moshel-curtains   # zero-downtime reload, not a hard restart
```

## 7. Known limitation — in-memory rate limiter

The AI-visualization rate limiter (5 requests/hour/IP) keeps its state in
memory. It resets on every `pm2 reload`/restart and does not survive an
instance replacement. Acceptable at current scale; flagged here so a reset
limit after a deploy isn't mistaken for a bug. If traffic grows and this needs
to survive restarts or work across multiple instances, it would need to move
to a shared store (e.g. Redis) — see the comment in
`src/app/api/visualize/rateLimiter.ts`.

Also note: `getClientIp` in `src/app/api/visualize/route.ts` reads the
`x-forwarded-for` header to identify callers for rate limiting. Since traffic
goes through Nginx, the `proxy_set_header X-Forwarded-For` line in the config
above is required — without it every request appears to come from the same
address (localhost, from Nginx's perspective).

## 8. Not yet done — contact form email

The contact form currently uses an unconfigured EmailJS integration
(`NEXT_PUBLIC_EMAILJS_*` env vars, never set up). Planned replacement:
server-side Nodemailer + Amazon SES, using the EC2 instance's IAM role for
credentials (`ses:SendEmail` permission) instead of embedding AWS keys in
`.env.local`. SES starts in "sandbox" mode (can only send to/from verified
addresses) — fine for a contact form that always sends to one fixed business
address. Tracked as a separate follow-up, not yet implemented.
