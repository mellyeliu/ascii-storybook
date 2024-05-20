import React, { useState, useEffect } from 'react';
import './Output.css';
import { GlitchedImage } from 'react-image-glitch'
import {MutatingDots} from 'react-loader-spinner';
import SentenceToggler from './SentenceToggler';


const OutputCard = ({ text, imageURLs, loading }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const placeHolderImages = [ '/butterfly.png', '/fairy.png', '/globe.png']
  const loadingText = ["Extracting key nouns from text...", "Feeding your words to DALL-E...", "Generating ASCII from images..."]

  if (imageURLs.length === 0) {
    imageURLs = placeHolderImages;
  }

  useEffect(() => {
    const updateImage = () => {
      setCurrentImage(currentImage => (currentImage + 1) % 3);
    };

    const intervalId = setInterval(updateImage, 4000);  // Changes every 3000 milliseconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={'box mobileS'} style={
            { textAlign: 'left', position: 'relative', fontFamily: 'var(--font-fam)', width: '25%', padding: '10px', border: 'var(--border)', borderRadius: '10px', backgroundColor: 'var(--dark-color)', overflow: 'auto', height: 480, maxHeight: 480 }}>
          {!loading ? (
            <div>
              {text ? <SentenceToggler text={text} sentenceCount={1}/>: null}
              {imageURLs.map((image, index) => {
                return (
                <div style={{display: (index === currentImage) ? 'block' : 'none', height: 300, marginTop: 30}}>
                  <GlitchedImage style={{maxHeight: 400}} image={image} />
                </div>
              )})}
              {(imageURLs === placeHolderImages) ? (<div className="loader-container2">The possibilities are endless...</div>) : null}
            </div>
          ) : (
            <div className="loader-container" style={{display: 'flex', margin: 'auto'}}>
              <MutatingDots color="var(--font-color)" secondaryColor="var(--font-color)"/>
              {
                loadingText.map((text, index) => {
                  return (
                    <p style={{marginTop: 50, display: (index === currentImage) ? 'block' : 'none'}}>{text}</p>
                  )
                })
              }

            </div>

          )}
    </div>


  );
};

export default OutputCard;
