# Installation & Running App
You should have Docker installed
```
docker compose up
```

# Example POST
```
curl --request POST 'http://127.0.0.1:5001/generate' --header \
'Content-Type: application/json' --data \
'{"text": "Sometimes I want to be a bird"}'
```