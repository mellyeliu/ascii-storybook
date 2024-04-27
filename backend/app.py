from flask import Flask, request, jsonify
import os
import supabase
from supabase import create_client, Client
from multiprocessing import Process
from flask_cors import CORS
from src.text_to_ascii_background_generator import TextToAsciiGenerator

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app, resources={r"/*": {"origins": ["*"]}})
SUPABASE_PROJECT_URL: str = os.getenv('SUPABASE_PROJECT_URL')
SUPABASE_API_KEY: str = os.getenv('SUPABASE_API_KEY')

supabase: Client = create_client(SUPABASE_PROJECT_URL, SUPABASE_API_KEY)

ascii_generator = TextToAsciiGenerator()

def async_generate_ascii_images(*args):
    response_id = args[0]
    text = args[1]
    ascii_out_folder = f'/tmp/ascii_ims_{response_id}'
    ascii_files = ascii_generator.synthesize(text, ascii_out_folder)
    for f in ascii_files:
        supabase_storage_path = f"/{response_id}/{os.path.basename(f)}"
        uploaded_video_data = supabase.storage.from_('ascii-images').upload(supabase_storage_path, f, {
            "contentType": "image/png",
        })
    print(f"Successfully generated ascii images for {response_id}")

"""
Creates equivalent ascii_text entry in database
and generates ascii representation of the given text
"""
@app.route('/generate', methods=['POST', 'OPTIONS'])
def create_ascii():
    if request.method == 'OPTIONS':
        # This will be handled by Flask-CORS
        return {}
    data = request.json
    # TODO: Validate data before adding to table
    table_result = supabase.table("ascii_submissions").insert(data).execute()
    response_id = table_result.data[0]['id']

    p1 = Process(target=async_generate_ascii_images, args=(response_id, data['text'],))
    p1.start()
    response = jsonify(table_result.data)
    return response

if __name__ == '__main__':
   app.run(port=5000, debug=True)