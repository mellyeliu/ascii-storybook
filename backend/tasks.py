from config import create_app, create_supabase_clent
from celery import shared_task 
from time import sleep
import os

from src.text_to_ascii_background_generator import TextToAsciiGenerator

flask_app = create_app()  #-Line 2
celery_app = flask_app.extensions["celery"] #-Line 3
supabase_client = create_supabase_clent()
# Setup custom clients
ascii_generator = TextToAsciiGenerator()

@shared_task(ignore_result=False)
def async_generate_ascii_images(*args):
    print(args)
    response_id = args[0]
    text = args[1]
    ascii_out_folder = f'/tmp/ascii_ims_{response_id}'
    ascii_files = ascii_generator.synthesize(text, ascii_out_folder)
    for f in ascii_files:
        supabase_storage_path = f"/{response_id}/{os.path.basename(f)}"
        uploaded_video_data = supabase_client.storage.from_('ascii-images').upload(supabase_storage_path, f, {
            "contentType": "image/png",
        })
    print(f"Successfully generated ascii fimages for {response_id}")