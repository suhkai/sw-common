curl -s --user 'api:key-b0e9cbf005f98d0f2b0649f8b292045a' \
    https://api.mailgun.net/v3/mail.jacob-bogers.com/messages \
    -F from='Excited User <dont-reply@mail.jacob-bogers.com>' \
    -F to='jacobus.bogers@gmail.com' \
    -F cc='baz@example.com' \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomness!' \
    --form-string html='<html>HTML version of the body</html>' \
    -F attachment=@files/f20.png \
    -F attachment=@files/pics8.jpg

