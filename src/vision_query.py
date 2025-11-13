from openai import OpenAI

# Initialize with custom base_url (e.g., for a proxy or Azure endpoint)
client = OpenAI(
    api_key="your-api-key-here",
    base_url="https://your-custom-endpoint.com/v1"  # Add trailing slash if required by your endpoint
)

# Now use it for text or image processing as before
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain quantum computing."}]
)
print(response.choices[0].message.content)


from openai import OpenAI
import base64  # For encoding local images if needed

# Initialize with custom base_url
client = OpenAI(
    api_key="your-api-key-here",
    base_url="https://your-custom-endpoint.com/v1"  # e.g., for proxy or Azure
)

# Function to encode a local image to base64 (optional; you can also use a URL)
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Image analysis example (text query + image)
# Option 1: Using an image URL
response = client.chat.completions.create(
    model="gpt-4o",  # Or "gpt-4-vision-preview" for legacy
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe the key elements in this image and suggest a caption."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/your-image.jpg",  # Public URL to the image
                    },
                },
            ],
        }
    ],
    max_tokens=300,
)

print(response.choices[0].message.content)

# Option 2: Using a local image file (base64-encoded)
# base64_image = encode_image("path/to/your/local/image.jpg")
# Then replace the "url" above with: "url": f"data:image/jpeg;base64,{base64_image}"