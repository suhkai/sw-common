APIKEY=$(echo  "YTA2Y2Y5ODU5OWU3MTgxMjJiZmIzY2I3YmQxMDc5ZGE="|base64 --decode)
curl -s --user "api:key-${APIKEY}" \
    https://api.mailgun.net/v3/mail.jacob-bogers.com/messages \
    -F from='Excited User <dont-reply@mail.jacob-bogers.com>' \
    -F to='jacobus.bogers@gmail.com' \
    -F cc='baz@example.com' \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomness!' \
    --form-string html='<html>HTML version of the body</html>' \
    -F attachment=@files/f20.png \
    -F attachment=@files/pics8.jpg

