# Serif Imagine

<img width="1491" alt="image" src="https://github.com/mellyeliu/ascii-client/assets/64865235/91f49add-162b-4b16-a5b9-8183eab10493">

Serif Imagine is a tool to generate an ascii storybook video from a passage of text. 

## Setup
To set up the client, install the node requirements and start the localhost.

`npm i`

`npm run start`

To set up the server, navigate to /backend and download the requirements. From there, you can start the server.

`cd backend`

`pip install requirements.py`

`flask run`

## Word Extraction
When entering a query into the client, you will see the text outputted to the console. 
￼

We use NLTK to parse out all nouns from the text. We then filter out common stopwords and noise and return the three most frequent nouns to capture the overarching topic of a piece.

￼<img width="471" alt="image" src="https://github.com/mellyeliu/ascii-client/assets/64865235/c5603cfb-b95a-47b5-98ba-c270bbd5d1c9">

We are working on refining this extraction with a couple of other experimental approaches: 
1. Extracting the least common nouns when compared to a large dataset of words to capture unique objects or concepts to the story.
2. Extracting bigrams of adjective-noun pairings and groupings of nouns to generate imagery more unique to the story itself. 

Both of these approaches are in development but can be tested by modifying the `synthesize` function within `backend/src/text_to_ascii_background_generator.py` to use the second output of `extract nouns` or `extract_interesting_bigrams`.

## Image Generation
We feed the output of the noun extraction directly to DALL-E. From there, we strip the background of the image and convert the image to ascii text output via an image-to-ascii processor. 

<img width="468" alt="image" src="https://github.com/mellyeliu/ascii-client/assets/64865235/ee432dee-f504-4a2d-8bbd-05305d427822">
￼

These images are sent back to the client and rendered in a storybook-like format. Right now the image generation process takes around ~20-30s. We are exploring affordable alternatives like Stable Diffusion to reduce the load time. 
 
