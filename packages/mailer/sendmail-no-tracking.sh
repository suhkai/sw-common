APIKEY=$(echo  "YTA2Y2Y5ODU5OWU3MTgxMjJiZmIzY2I3YmQxMDc5ZGE="|base64 --decode)
curl -s --user "api:key-${APIKEY}" \
    https://api.mailgun.net/v3/mail.jacob-bogers.com/messages \
    -F from='Javascript Meetup Group Berlin <dont-reply@mail.jacob-bogers.com>' \
    -F to=jacobus.bogers@gmail.com \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomeness!' \
    -F o:tracking=False \
    -F o:deliverytime='Fri, 14 Oct 2011 23:10:10 -0000'

#
# {
#  "id": "<20191120121551.1.3B6B5DD4791D55DB@mail.jacob-bogers.com>",
#   "message": "Queued. Thank you."
# }