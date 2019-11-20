curl -v -s --user 'api:key-b0e9cbf005f98d0f2b0649f8b292045a' \
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