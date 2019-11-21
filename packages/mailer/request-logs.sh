BASE="https://api.mailgun.net/v3"
DOMAIN=${BASE}/mail.jacob-bogers.com
APIKEY=$(echo  "YTA2Y2Y5ODU5OWU3MTgxMjJiZmIzY2I3YmQxMDc5ZGE="|base64 --decode)
curl -s -D - --user "api:key-${APIKEY}" "${DOMAIN}/log"
