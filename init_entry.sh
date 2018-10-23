#!/bin/bash

pushd /var/www/html

env_file=assets/environments/environment.json
mv assets/environments/environment.dist.json assets/environments/environment.json
## Replace all variable in config file
sed -i "s|\"baseUrl.*|\"baseUrl\": \"${BASE_URL}\",|g" ${env_file}
sed -i "s|\"baseAPIUrl.*|\"baseAPIUrl\": \"${BASE_API_URL}\",|g" ${env_file}
sed -i "s|\"URL.*|\"URL\": \"${GITHUB_URL}\",|g" ${env_file}
sed -i "s|\"CLIENT_ID.*|\"CLIENT_ID\": \"${GITHUB_CLIENT_ID}\",|g" ${env_file}
sed -i "s|\"REDIRECT_URI.*|\"REDIRECT_URI\": \"${GITHUB_REDIRECT_URI}\",|g" ${env_file}

## Now the Apache service
nginx -g "daemon off;"
