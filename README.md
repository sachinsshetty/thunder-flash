# Thunder Flash

- CIHBw-4	Bomb-Lense	 - [challenge](challenge.md)

- System Diagram 
    - ![system-diagram](docs/thunder-v1.jpg "system-diagram")

- Tasks
    - [Stage 1](docs/tasks-v1.md) : 1pm Nov 13 - 1pm Nov 14

- Idea - [v1-doc](docs/ideas-v1.md)

--

docker build -t dwani/thunder-server:latest -f server.Dockerfile .


docker compose -f server-compose.yml up -d

<!-- 
docker push dwani/thunder-server:latest
-->