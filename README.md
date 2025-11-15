# Thunder Flash

- CIHBw-4	Bomb-Lense	 - [challenge](challenge.md)

- System Diagram 
    - ![system-diagram](docs/thunder-v1.jpg "system-diagram")

- Entity Relationshop Model - [document](docs/database-er-design.md)
    
- Tasks
    - [Stage 1](docs/tasks-v1.md) : 1pm Nov 13 - 1pm Nov 14

- Idea - [v1-doc](docs/ideas-v1.md)

--

- Server 
    - build
```bash
cd src

docker build -t dwani/thunder-server:latest -f server.Dockerfile .
```

- Client
    - build
```bash
cd ux_flash
docker build -t dwani/thunder-ux-dev -f prod.Dockerfile .

```
cd src
docker build -t dwani/thunder-ux-dev -f Dockerfile .
docker compose -f client.yml up -d



docker compose -f server-compose.yml up -d

<!-- 
docker push dwani/thunder-server:latest
-->
- Deploy VLM model
cd deploy
docker compose -f vllm-qwen.yml up -d


