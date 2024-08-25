#!/usr/bin/bash
docker run --detach --name mariadb -p 3306:3306 \
    --env MARIADB_ROOT_PASSWORD=123123 \
    -v /Volumes/ImageDisk/docker/mariadb:/var/lib/mysql \
    mariadb:10.6

docker run -d --name redis -p 6379:6379 \
    --volume=/Volumes/ImageDisk/docker/redis:/data \
    redis
