BASE="https://api.mailgun.net/v3"
DOMAIN=${BASE}/mail.jacob-bogers.com
curl -s -D - --user 'api:key-b0e9cbf005f98d0f2b0649f8b292045a' "${DOMAIN}/log"