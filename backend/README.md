# Installation
```
brew tap redis-stack/redis-stack
brew install redis-stack

pip install -r requirements.txt
```
# Running app
```
# Terminal 1
redis-server
# Terminal 2
celery -A tasks worker --loglevel INFO
# Terminal 2
flask run
```

# Testing endpoint
