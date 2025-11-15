# Thunder Flash

- CIHBw-4	Bomb-Lense	 - [challenge](challenge.md)

- [App Video Demo]() - 

- System Diagram 
    - ![system-diagram](docs/thunder-v1.jpg "system-diagram")

- Entity Relationshop Model - [document](docs/database-er-design.md)
    
- Tasks
    - [Stage 1](docs/tasks-v1.md) : 1pm Nov 13 - 1pm Nov 14
    - [Stage 2](docs/tasks-day2.md) : 1pm Nov 14 - 1pm Nov 15
    - [Stage 3](docs/tasks-day-3.md) : 1pm Nov 15 - 9am Nov 16

- Idea - [v1-doc](docs/ideas-v1.md)

--

- Server 
    - build
```bash
cd src

docker build -t dwani/thunder-server:latest -f Dockerfile .

docker push dwani/thunder-server
docker compose -f server-compose.yml up -d

```

- Client
    - Production
        - docker build --build-arg VITE_DWANI_API_BASE_URL=https://<thunder-serverip>.dwani.ai -t dwani/thunder-ux -f prod.Dockerfile .

        - docker push dwani/thunder-ux

        - docker compose -f client-prod.yml

    - build
```bash
cd ux_flash
docker build -t dwani/thunder-ux-dev -f Dockerfile .
docker compose -f client.yml up -d

```


<!-- 
docker push dwani/thunder-server:latest
-->
- Deploy VLM model
cd deploy
docker compose -f vllm-qwen.yml up -d

