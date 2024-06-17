#!/bin/bash

set -e
docker buildx build -t music-player -f Dockerfile .

set +e
docker stop MusicPlayer
docker rm MusicPlayer
docker run --name MusicPlayer -d -t --restart unless-stopped -p 8080:8080 music-player