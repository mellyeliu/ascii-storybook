import os
import subprocess
import urllib
from pathlib import Path
import math

from openai import OpenAI
from PIL import Image
import itertools
import numpy as np
# from rembg import remove
from src.text_noun_extractor import extract_interesting_bigrams, extract_nouns
import platform
import ctypes
OPENAI_API_KEY = os.getenv("OPENAI_KEY")

text = """
Every year Thanksgiving night we flocked out behind Dad as he dragged the Santa suit to the road and draped it over a kind of crucifix he'd built out of metal pole in the yard. Super Bowl week the pole was dressed in a jersey and Rod's helmet and Rod had to clear it with Dad if he wanted to take the helmet off. On the Fourth of July the pole was Uncle Sam, on Veteran’s Day a soldier, on Halloween a ghost. The pole was Dad's only concession to glee. We were allowed a single Crayola from the box at a time. One Christmas Eve he shrieked at Kimmie for wasting an apple slice. He hovered over us as we poured ketchup saying: good enough good enough good enough. Birthday parties consisted of cupcakes, no ice cream. The first time I brought a date over she said: what's with your dad and that pole? and I sat there blinking.
We left home, married, had children of our own, found the seeds of meanness blooming also within us. Dad began dressing the pole with more complexity and less discernible logic. He draped some kind of fur over it on Groundhog Day and lugged out a floodlight to ensure a shadow. When an earthquake struck Chile he lay the pole on its side and spray painted a rift in the earth. Mom died and he dressed the pole as Death and hung from the crossbar photos of Mom as a baby. We'd stop by and find odd talismans from his youth arranged around the base: army medals, theater tickets, old sweatshirts, tubes of Mom's makeup. One autumn he painted the pole bright yellow. He covered it with cotton swabs that winter for warmth and provided offspring by hammering in six crossed sticks around the yard. He ran lengths of string between the pole and the sticks, and taped to the string letters of apology, admissions of error, pleas for understanding, all written in a frantic hand on index cards. He painted a sign saying LOVE and hung it from the pole and another that said FORGIVE? and then he died in the hall with the radio on and we sold the house to a young couple who yanked out the pole and the sticks and left them by the road on garbage day.
"""


def removeBlackBackground(image_file, out_file):
    img = Image.open(image_file)
    img = img.convert("RGBA")

    datas = img.getdata()

    newData = []

    for item in datas:
        if item[0] == 0 and item[1] == 0 and item[2] == 0:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(out_file, "PNG")
    img.close()

def _get_avg_background_color(image: Image):
    # We assume that most pixels in the upper row corner will map to 
    # Dalle's "background color"
    # Get average of these colors
    
    im_crop = image.crop((0, 0, 300, 300))
    im_data = np.array(im_crop)
    avg_color = im_data.mean(axis=0)
    print(avg_color)
    return avg_color

def luminance(pixel):
    return (0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2])

def is_similar(pixel_a, pixel_b, threshold):
    return abs(luminance(pixel_a) - luminance(pixel_b)) < threshold


def tryRemoveImageBackground(image_file, out_file, thresh, resize=(256,256)):
    img = Image.open(image_file)
    img.thumbnail(resize, Image.Resampling.LANCZOS)
    img = img.convert("RGBA")

    datas = img.getdata()

    newData = []

    background_color = _get_avg_background_color(datas)

    for item in datas:
        if is_similar(np.array(item)[:-1], background_color[:-1], thresh): 
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(out_file, "PNG")
    img.close()

class DalleImageGenerator:
    def __init__(self) -> None:
        self.client = OpenAI(api_key=OPENAI_API_KEY)

    def _generate_image_with_prompt(self, text_prompt: str):
        response = self.client.images.generate(
            model="dall-e-3",
            prompt=text_prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url

    def synthesize(self, text_prompt: str, outfile: str):
        im_url = self._generate_image_with_prompt(text_prompt=text_prompt)
        urllib.request.urlretrieve(im_url, outfile)


class TextToAsciiGenerator:
    def __init__(self) -> None:
        self.image_generator = DalleImageGenerator()
        self.text_prompt = "generate a simple line drawing of {}, background is a single, solid red color. Make the subjects of the image white."
        self.architecture = "x86_64" if platform.machine() in ("i386", "AMD64", "x86_64") else "arm64"
        # self.ascii_library = ctypes.CDLL(f"src/libraries/ascii_image_converter_{self.architecture}.so")
        self.ascii_library = ctypes.CDLL("/app/src/libraries/ascii_image_generator.so")

    def synthesize_from_word(self, noun, out_folder):
        dalle_im_path = f"/tmp/dalle_im_{noun}.png"
        print(f"============={noun}=============")
        self.image_generator.synthesize(self.text_prompt.format(noun), dalle_im_path)
        no_bg_path = f"/tmp/dalle_im_no_bg_{noun}.png"
        tryRemoveImageBackground(dalle_im_path, no_bg_path, 50)
        png_im_path = f"/tmp/dalle_im_no_bg_{noun}-ascii-art.png"
        print(f"Removed background for {dalle_im_path} ")
        self.ascii_library.ConvertAscii(no_bg_path.encode('UTF-8'), b'/tmp')
        print(f"Converted ascii for {dalle_im_path} ")
        out_file = f"{out_folder}/out_{noun}.png"
        removeBlackBackground(png_im_path, out_file)
        return out_file

    def synthesize(self, text, out_folder):
        most_freq, _ = extract_nouns(text=text)

        print(f"Synthesizing images for {most_freq}")
        files = []
        Path(out_folder).mkdir(parents=True, exist_ok=True)
        for i, n in enumerate(most_freq):
            files.append(self.synthesize_from_word(n, out_folder))
        return files

    def convert_ascii(self, im_path):
        self.ascii_library.ConvertAscii(im_path.encode('UTF-8'), b'/tmp')
        print(f"Converted ascii for {im_path} ")
        im_basename = os.path.basename(im_path)
        converted_im_path = f"/tmp/{im_basename}-ascii-arg.png"
        return converted_im_path
    
if __name__ == "__main__":
    ascii_generator = TextToAsciiGenerator()
    ascii_generator.synthesize(text, "src/images")
