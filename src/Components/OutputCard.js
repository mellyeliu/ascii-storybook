import React, { useState, useEffect } from 'react';
import './Output.css';
import { GlitchedImage } from 'react-image-glitch'
import {MutatingDots} from 'react-loader-spinner';


const OutputCard = ({ text, imageURLs, loading }) => {
  console.log(imageURLs);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const updateImage = () => {
      setCurrentImage(currentImage => (currentImage + 1) % 3);
    };

    const intervalId = setInterval(updateImage, 3000);  // Changes every 3000 milliseconds

    return () => clearInterval(intervalId);
  }, []);
  console.log(imageURLs);
  return (

    <div style={
            { textAlign: 'left', position: 'relative', fontSize: 12, fontFamily: 'var(--font-fam)', width: '25%', padding: '10px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: 'var(--dark-color)', overflow: 'auto', height: 480, maxHeight: 480 }}>

          {!loading ? (
            <div>
              {/* <div>{text || "Your generated content will appear here..."}</div> */}
              {imageURLs.map((image, index) => {
                return (
                <div style={{display: (index === currentImage) ? 'block' : 'none', height: 300, marginTop: 30}}>
                  <GlitchedImage style={{maxHeight: 400}} image={image} />
                </div>
              )})}
            </div>
          ) : (
            <div className="loader-container" style={{display: 'flex', margin: 'auto'}}>
              <MutatingDots color="white" secondaryColor="white"/>
              <p>Loading...</p>
            </div>

          )}
    </div>


  );
};

export default OutputCard;
