 create a curl command to use the openai format for text and image query.

### Text Query Example

Use this curl command for a simple text-based query. Replace `$URL` with the base endpoint URL (e.g., `https://qwen.dwani.ai/v1/chat/completions`), `$MODEL_NAME` with your model (e.g., `gemma3`), `$API_KEY` with your actual API key, and adjust the prompt as needed.

```
curl $URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "gemma3",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing in simple terms."
      }
    ],
    "max_tokens": 150,
    "temperature": 0.7
  }'
```

### Image Query Example (Multimodal/Vision)

Use this curl command for a text + image query. Replace `$URL` with the base endpoint URL (e.g., `https://<qwen-based-model>.dwani.ai/v1/chat/completions`), `$MODEL_NAME` with your model (e.g., `gemma3`), `$API_KEY` with your actual API key, and replace `BASE64_ENCODED_IMAGE` with the base64-encoded string of your image (e.g., from `base64 -i image.jpg`). You can use a URL instead of base64 if the API supports it.

```
curl $URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "model": "gemma3",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Describe what you see in this image."
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/jpeg;base64,BASE64_ENCODED_IMAGE"
            }
          }
        ]
      }
    ],
    "max_tokens": 150,
    "temperature": 0.7
  }'
```

These commands follow the standard OpenAI-compatible `/v1/chat/completions` endpoint format. Ensure your `$URL` includes the full path (e.g., `/v1/chat/completions`). Check your API docs for any provider-specific details like rate limits or additional parameters. If authentication differs (e.g., custom header), update the `-H` flags accordingly.