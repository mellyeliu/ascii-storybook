import React, { useState, useEffect } from 'react';
import useTypewriter from 'react-typewriter-hook';

const TextInputArea = ({ onGenerate }) => {
  const prompts = ["Visualize a dream of yours...", "What's a memory you always wanted to see again?", "I wonder what a thought looks like..."];
  const [index, setIndex] = useState(0);
  let prompt = prompts[index];
  const typedText = useTypewriter(prompt);

  useEffect(() => {
    if (typedText === prompt && index < prompts.length - 1) {
      setTimeout(() => setIndex(index + 1), 5000);
    }
    else if (typedText === prompt && index === prompts.length - 1) {
      setTimeout(() => setIndex(0), 5000);
    }
  }, [typedText, index, prompt]);

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
    border: 'var(--border)',
    borderRadius: '10px',
    color: 'var(--font-color)',
    cursor: 'pointer',
    fontFamily: 'var(--font-fam)',
    fontSize: 'var(--font-size)',
    position: 'absolute',
    top: "83%",
    width: '80%',
    marginLeft: '10%'
  }

  return (
    <div style={{ position: 'relative', height: 500, width: '25%', display: 'flex', flexDirection: 'column', marginRight: 30 }}>
      <textarea
        value={inputText}
        className="box"
        onChange={handleChange}
        style={{ fontSize: 12, color:  'var(--font-color)', zIndex: 10, flexGrow: 1, padding: '10px', border: 'var(--border)', background: 'var(--dark-color)', borderRadius: '10px', resize: 'none' }}
        rows="10"
        placeholder={typedText}
      />
      <button className="box" onClick={handleClick} style={buttonStyle}>
        Generate
      </button>
    </div>
  );
};

export default TextInputArea;
