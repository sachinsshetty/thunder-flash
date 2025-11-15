Deploy Application


- Server 
    - build
```bash
cd server

docker build -t dwani/thunder-server:latest -f Dockerfile .

docker push dwani/thunder-server

docker compose -f server-compose.yml up -d
```

- Client
    - Production
```bash
cd frontend

docker build --build-arg VITE_DWANI_API_BASE_URL=https://<thunder-serverip>.dwani.ai -t dwani/thunder-ux -f prod.Dockerfile .

docker push dwani/thunder-ux

docker compose -f client-prod.yml
```

  - build

```bash
cd frontend
docker build -t dwani/thunder-ux-dev -f Dockerfile .
docker compose -f client.yml up -d
```


<!-- 
docker push dwani/thunder-server:latest
-->

- Deploy VLM model
```bash
cd deploy
docker compose -f vllm-qwen.yml up -d
```