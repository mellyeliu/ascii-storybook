import React, { useState, useEffect } from 'react';

function SentenceToggler({ text, sentenceCount = 2 }) {
  // Split the input text into sentences.
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  console.log(sentences);

  // State to hold the current index
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up a timer to advance the current index every 3 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => ((prevIndex + sentenceCount) % (sentences.length !== 0 ? sentences.length : 1 )));
    }, 4000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(timer);
  }, [sentences.length]);

  // Compute the sentences to display
  const displayText = sentences.slice(currentIndex, currentIndex + sentenceCount).join(' ');
  console.log(displayText);
  console.log(currentIndex);

  return (
    <div style={{zIndex: 100000, textAlign: 'center', marginTop: 20, height: 50 }}>
      {displayText}
    </div>
  );
}

export default SentenceToggler;
