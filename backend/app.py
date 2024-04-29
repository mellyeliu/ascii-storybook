from flask import request, jsonify
from config import create_supabase_clent, create_app
from src.text_noun_extractor import extract_nouns
from pathlib import Path
from src.text_to_ascii_background_generator import TextToAsciiGenerator
from multiprocessing import Process
import os
supabase_client = create_supabase_clent()
ascii_generator = TextToAsciiGenerator()
flask_app = create_app()
"""
Creates equivalent ascii_text entry in database
and generates ascii representation of the given text
"""

def async_synthesize_and_upload_image(*args):
    noun = args[0]
    out_folder = args[1]
    request_id = args[2]
    local_file = ascii_generator.synthesize_from_word(noun, out_folder)

    supabase_storage_path = f"/{request_id}/{os.path.basename(local_file)}"
    uploaded_video_data = supabase_client.storage.from_('ascii-images').upload(supabase_storage_path, local_file, {
        "contentType": "image/png",
    })
    print(f"Successfully uploaded image for {noun} to {supabase_storage_path}!")

def generate_ascii_images(request_id, text):
    most_freq, least_freq = extract_nouns(text)
    ascii_out_folder = f'/tmp/ascii_ims_{request_id}'
    Path(ascii_out_folder).mkdir(parents=True, exist_ok=True)
    processes = []
    for n in most_freq:
        processes.append(Process(target=async_synthesize_and_upload_image, args=(n,ascii_out_folder, request_id)))
    
    for p in processes:
        p.start()


@flask_app.route('/generate', methods=['POST', 'OPTIONS'])
def create_ascii():
    if request.method == 'OPTIONS':
        # This will be handled by Flask-CORS
        return {}
    data = request.json
    # TODO: Validate data before adding to table
    table_result = supabase_client.table("ascii_submissions").insert(data).execute()
    response_id = table_result.data[0]['id']
    print(data)
    generate_ascii_images(response_id, data['text'])
    response = jsonify(table_result.data)
    return response

if __name__ == '__main__':
   flask_app.run(port=5000, debug=True)