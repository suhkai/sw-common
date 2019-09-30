From [here][link]

# step 1, create your own root CA

```bash
openssl genrsa -des3 -out myCA.key 2048
```

create your CA to sign server request

```bash
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem
``










[link1]: https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/