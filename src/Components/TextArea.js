import React, { useState, useEffect } from 'react';
import useTypewriter from 'react-typewriter-hook';

const TextInputArea = ({ onGenerate }) => {
  const prompts = ["Visualize a dream of yours...", "What's a memory you always wanted to see again?", "I wonder what a thought looks like..."];
  const [index, setIndex] = useState(0);
  let prompt = prompts[index];
  const typedText = useTypewriter(prompt);

  useEffect(() => {
    if (typedText === prompt && index < prompts.length - 1) {
      setTimeout(() => setIndex(index + 1), 1000);
    }
    else if (typedText === prompt && index === prompts.length - 1) {
      setTimeout(() => setIndex(0), 1000);
    }
  }, [typedText, index, prompt]);

  // useEffect(() => {
  //   setPlaceholder(prompts[index]);
  // }, [index]);
  const [inputText, setInputText] = useState('');

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleClick = () => {
    onGenerate(inputText);
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: 'var(--dark-color)',
    zIndex: 10,
    border: '1px solid white',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'var(--font-fam)',
    // width: '90%',
    // marginLeft: 'auto',
    // marginRight: 'auto',
  }

  return (
    <div style={{ height: 500, width: '23%', display: 'flex', flexDirection: 'column', marginRight: 30 }}>
      <textarea
        value={inputText}
        onChange={handleChange}
        style={{ zIndex: 10, flexGrow: 1, color: 'white', padding: '10px', border: '1px solid white', background: 'var(--dark-color)', borderRadius: '10px', resize: 'none' }}
        rows="10"
        placeholder={typedText}
      />
      <button onClick={handleClick} style={buttonStyle}>
        Generate
      </button>
    </div>
  );
};

export default TextInputArea;
