import string
from collections import Counter

import nltk
from nltk import FreqDist, pos_tag
from nltk.corpus import reuters, stopwords, words
from nltk.tokenize import word_tokenize
from nltk.util import bigrams

def extract_nouns(text):
    words = word_tokenize(text)
    pos_tags = pos_tag(words)

    nouns = [word for word, tag in pos_tags if tag in ("NN", "NNS", "NNP", "NNPS")]

    if not nouns:
        return [], []

    text_freq = Counter(nouns)

    # reuters corpus and count word frequencies
    reuters_words = [
        word.lower() for fileid in reuters.fileids() for word in reuters.words(fileid)
    ]
    reuters_freq = Counter(reuters_words)

    noun_rarity = {
        noun: 1 / reuters_freq[noun.lower()]
        for noun in nouns
        if reuters_freq[noun.lower()] > 0
    }

    sorted_unique_nouns = sorted(noun_rarity.items(), key=lambda x: x[1], reverse=True)

    # 3 least common nouns
    least_common_nouns = [
        noun for noun, _ in sorted_unique_nouns[: min(3, len(sorted_unique_nouns))]
    ]

    # three most frequent nouns
    most_frequent_nouns = [
        noun for noun, _ in text_freq.most_common(min(3, len(text_freq)))
    ]

    return most_frequent_nouns, least_common_nouns


def extract_interesting_bigrams(text):
    tokens = word_tokenize(text)
    # POS tagging
    tagged_tokens = pos_tag(tokens)

    # Filter out stopwords and punctuation, and collect nouns
    stop_words = set(stopwords.words("english"))
    stop_words.add("dream")

    valid_words = set(words.words())
    filtered_tokens = [
        word.lower()
        for word, tag in tagged_tokens
        if word.lower() not in stop_words and word in valid_words
    ]
    nouns = [word for word, tag in tagged_tokens if tag.startswith("NN")]

    # Frequency distribution of nouns
    noun_freq = FreqDist(nouns)

    # Collect the top frequent nouns
    top_nouns = [
        noun for noun, freq in noun_freq.most_common(3)
    ]  # Adjust the number as needed

    # Generate bigrams from filtered tokens
    generated_bigrams = list(bigrams(filtered_tokens))

    # Filter bigrams where the second word is a top frequent noun
    filtered_bigrams = [
        bigram for bigram in generated_bigrams if bigram[1] in top_nouns
    ]

    return filtered_bigrams[0] if filtered_bigrams else []


if __name__ == "__main__":
    text = """
    Right before waking up I remember standing in the kitchen of that house and my mother and my grandmother were there, that is my mother and her mother and my mother asked; "what would you like to do, go for a walk or go using your wheelchair?"

    And I was somewhat anxious about going at all, I really didn't want to leave the house, but I thought to myself that it would be easier to use the wheelchair, but I needed the exercise so "I guess I'll walk" I said to my mom, "I guess I'll walk." And

    I was looking in the refrigerator while I was waiting for my grandmother to be ready to go, because my grandmother was also going to go on the walk with me. I was looking in it and seeing the different foods, and the light, the way it came on in our fridge
    when I was younger and I could still see. And people were talking, I don't remember who exactly, but they were discussing a recipe which sounded especially unappealing to me, something about some low fat chicken parts or something and my mom was talking about replacing that with beef and how it didn't work very well.
    """

    text2 = """
    I was in my grandfather's house. (He has been dead for six years.) I was lying down on a bed in a living room. It was an old studio, with which I was not familiar.
    I got up wondering which I should do: go back to sleep or study for a literature exam. My grandfather was cooking something.
    I noticed that two of my cousins also were there. One of them asked me if I wanted to have dinner with them.
    I said that since I had an exam the next day, I had to go home and study. They gave me a ride. It was dark outside.
    When we came closer to a tennis court, we noticed that there were many people both inside and outside the tennis court.
    We stopped the car and I went to see what was going on. I saw David Bowie talking to someone on a bench outside the tennis court.
    I entered the tennis court. It looked like a concert hall in the open air and was crowded with people.
    I found a friend of mine from high school and asked him what was about to happen. He said that David Byrne was expected to give a concert. Since he was not my favorite musician, I left the tennis court. On my way back to the car, I saw David Byrne singing and dancing a weird dance. I thought that the lighting was beautiful.
    """

    text3 = """
    I had a dream about marriage noodle. They came in a blue can that was the shape of the Quaker Oats box. These noodles were kind of like soup only without much liquid in them. The expiration date on the noodles was for 60 years from now. I remember trying to figure out how they could last that long, and if they would last that long if they were opened, or would they only last that long if they were not opened.
    """

    most_frequent_nouns, least_common_nouns = extract_nouns(text)
    print("Three most frequent nouns:", most_frequent_nouns)
    print("Four least common nouns:", least_common_nouns)

    most_frequent_nouns, least_common_nouns = extract_nouns(text2)
    print("Three most frequent nouns:", most_frequent_nouns)
    print("Four least common nouns:", least_common_nouns)

    most_frequent_nouns, least_common_nouns = extract_nouns(text3)
    print("Three most frequent nouns:", most_frequent_nouns)
    print("Four least common nouns:", least_common_nouns)

    """
    - extract out nouns (person, 2 objects) -> put into dalle (in the style of clipart) -> ascii tool
    - sentiment analysis of whole story

    """
