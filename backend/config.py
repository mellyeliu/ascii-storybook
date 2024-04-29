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

# def celery_init_app(app: Flask) -> Celery:
#     class FlaskTask(Task):
#         def __call__(self, *args: object, **kwargs: object) -> object:
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery_app = Celery(app.name, task_cls=FlaskTask)
#     print(app.config)
#     celery_app.config_from_object(app.config["CELERY"])
#     celery_app.set_default()
#     app.extensions["celery"] = celery_app
#     return celery_app

def create_app() -> Flask:
    app = Flask(__name__)
    # app.config.from_mapping(
    #     CELERY=dict(
    #         broker_url=os.environ.get('CELERY_BROKER_URL'),
    #         result_backend=os.environ.get('CELERY_RESULT_BACKEND'),
    #         OPENAI_KEY=os.environ.get('OPENAI_KEY'),
    #         SUPABASE_API_KEY=os.environ.get('SUPABASE_API_KEY'),
    #         SUPABASE_PROJECT_URL=os.environ.get('SUPABASE_PROJECT_URL'),
    #         task_ignore_result=True,
    #     ),
    # )
    CORS(app, resources={r"/*": {"origins": ["*text2ascii.netlify.app/", "*serif.app/*"]}})
    # CORS(app, resources={r"/*": {"origins": ["*"]}})
    # app.config.from_prefixed_env()
    # celery_init_app(app)
    return app