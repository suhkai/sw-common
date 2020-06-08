FROM alpine
# Accept uid and gid from build args
ARG HOMEDIR=/var/app
# 65534 is "nobody"
#ARG UID=65534
#ARG GID=65534
# 0 is "root"
ARG UID=0
ARG GID=0
# Create app directory
RUN mkdir -p $HOMEDIR && chown $UID:$GID -R $HOMEDIR 
WORKDIR $HOMEDIR
RUN apk add --no-cache --virtual .gyp python make g++ git openssh-client
RUN apk add --no-cache --update --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/main/  nodejs npm
RUN apk add --no-cache gcompat
RUN apk add --no-cache bash
# zip node_modules
# Run app
EXPOSE 6020
USER 0:0
CMD ["bash"]