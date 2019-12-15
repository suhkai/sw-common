# Overview nodemailer api

## Some considerations

Some first decisions when implementing the mail, 

1. Local chapters will have the number of members in the order of magnitude 100s, with these low numbers we can send messages to 
members individually, this allowes us to have sent operation (an individual message ID connected to the fact an individual user sent message)
2. Because of above there is no bulk send
3. this MVP will not support attachments, hmtl, amp
4. the first stransports supported will be SMTP (default this is configured for ethermail)
5. No pooled SMTP i sneeded, a chapter wont have that much members to justify sending mail in parallel
6. MVP will not support Auth2 (maybe after MVP)
7. options.authMethods specify all methods available 'PLAIN','LOGIN','XOUATH2'
8. no fileaccess via node mailer, (load data from net or fs first into memory)
9. MVP will not implement ICalendar calendar events emails
10. Alternative markup is tabled for after MVP
11. creating email mailing list is not for this MVP.
12. build in transport will not be part of this MVP, (aws-ses, sendmail command line, stream is more for mock tests)
13. DKSIM signing will not be part of this MVP


Configuration is stored in the database

table config_smtp {
    port: number,
    host: string,
    auth_type: string (in this case only support 'login') enum ('OAuth2', )
    auth_user: string
    auth_pass: normal,
    secure: boolean,
    // tls no tls object
    tls_servername: string
    tls_ignoreTLS: boolean
    tls_requireTLS:boolean
    tls_rejectUnauthorized: boolean // do not fail on invalid certificates
    //
    name: string
    localAddress: string
    connectionTimeout: number
    greetingTimeout: number
    socketTimeout: number
    disableFileAccess // fixed: true
    disableUrlAccess // fixed: true
}

email
 - from: string (is an array with 1 element ([name, address])) 'Ноде Майлер <foobar@example.com>'
 - to (is user specific) (is an array with 1 element), example 'foobar@example.com, "Ноде Майлер" <bar@example.com>, "Name, User" <baz@example.com>',
 - cc not applicable
 - bccc not applicable
 - subject: string
 - text: string  // plaintext
 - html: hmtl version of the message
 - sender: string
 - replyTo: string
 - inReplyTo: string
 - watchHTML: string
 - amp: string


mail_sent_to_user {
  user_id
  email_id
  message_id
  status: string (or error message)
  created: the time this entry was created
}  

# Not part of MVP

 email_list
 - id
 - name: (for human memory)
 - list_archive
 - list_help
 - list_id
 - list_owner
 - list_post
 - list_subscribe
 - list_unsubscribe
 - list_unsubscribe_post
 


