# from celery import Celery, Task
from flask import Flask
from flask_cors import CORS
import os 
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

def create_supabase_clent():
    SUPABASE_PROJECT_URL: str = os.getenv('SUPABASE_PROJECT_URL')
    SUPABASE_API_KEY: str = os.getenv('SUPABASE_API_KEY')
    return create_client(SUPABASE_PROJECT_URL, SUPABASE_API_KEY)

def create_app() -> Flask:
    app = Flask(__name__)
    if os.getenv('ENV') == "local":
        cors_origins =['*']
    else:
        # Regular expression that matches any subdomain of text2ascii.netlify.app
        cors_origins = r"https?://([a-zA-Z0-9]+[.])*text2ascii[.]netlify[.]app"

    CORS(app, resources={r"/*": {"origins": cors_origins}})
    return app