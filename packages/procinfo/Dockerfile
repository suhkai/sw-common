FROM alpine
# Accept uid and gid from build args
ARG HOMEDIR=/var/app
# 65534 is "nobody"
ARG UID=0
ARG GID=0
# Create app directory
RUN mkdir -p $HOMEDIR/conf && chown $UID:$GID -R $HOMEDIR 
WORKDIR $HOMEDIR
RUN apk add --no-cache --virtual .gyp python make g++ git openssh-client
RUN apk add --no-cache --update --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/main/  nodejs npm
RUN apk add --no-cache gcompat
RUN apk add --no-cache bash
RUN apk add --no-cache curl
#COPY node package.json .npmrc index.js $HOMEDIR/
#COPY conf $HOMEDIR/conf
#RUN npm install 
# zip node_modules
#ENV PATH="$HOMEDIR:${PATH}"
# Run app
EXPOSE 8080
USER $UID:$GID
CMD ["bash"]
#CMD ["npm", "start"]