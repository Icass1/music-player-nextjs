docker buildx build -t music-player -f Dockerfile .
docker stop MusicPlayer
docker rm MusicPlayer
docker run --name MusicPlayer -d -t -p 8080:8080 music-player