FROM debian:stretch

MAINTAINER Olivier Bitsch
WORKDIR /var/www/html
ENV PHP_VER 7.2

## Defaults values for the config
ENV BASE_URL=http://localhost:8000
ENV BASE_API_URL=http://localhost:8000/api/v1
ENV GITHUB_URL=https://github.com/login/oauth/authorize
ENV GITHUB_CLIENT_ID=
ENV GITHUB_REDIRECT_URI=http://localhost/callback

## Non interactive Debian package installation
ENV DEBIAN_FRONTEND noninteractive

RUN sed -i '/jessie-updates/d' /etc/apt/sources.list

## Let refresh first the Debian repo
RUN apt-get update \
    && apt-get -y install wget \
    gnupg \
    apt-transport-https \
    openssl \
    dos2unix

## Adding Sury (php backports) repository
RUN wget -qO- https://deb.nodesource.com/setup_10.x | bash -

## Installing dependancies
RUN apt-get update \
    && apt-get -y install \
    nodejs \
    nginx

## Copy the entire application
RUN rm /var/www/html/* && mkdir /tmp/build
COPY . /tmp/build

## Install npm dependancies
#USER www-data
RUN cd /tmp/build && npm install

## Build with Angular
RUN cd /tmp/build && node_modules/.bin/ng build --prod

## Finally keep only static files and cleanup
RUN cp -a /tmp/build/dist/github-trading/* /var/www/html && rm -rf /tmp/build

## Define the port used by Nginx and fix config for Angular
EXPOSE 80
COPY nginx.conf /etc/nginx/sites-enabled/default

## Prepare the proper init script
COPY init_entry.sh /init_entry.sh
RUN dos2unix /init_entry.sh
RUN chmod +x /init_entry.sh
ENTRYPOINT [ "/init_entry.sh" ]
