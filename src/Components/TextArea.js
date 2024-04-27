import React, { useState } from 'react';

const TextInputArea = ({ onGenerate }) => {
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
    backgroundColor: '#111111',
    border: '1px solid white',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    fontFamily: "'Courier New', Courier, monospace",
    // width: '90%',
    // marginLeft: 'auto',
    // marginRight: 'auto',
  }

  return (
    <div style={{ height: 500, width: '30%', display: 'flex', flexDirection: 'column', marginRight: 30 }}>
      <textarea
        value={inputText}
        onChange={handleChange}
        style={{ zIndex: 10, flexGrow: 1, color: 'white', padding: '10px', border: '1px solid white', background: '#111111', borderRadius: '10px', resize: 'none' }}
        rows="10"
        placeholder="Type your text here..."
      />
      <button onClick={handleClick} style={buttonStyle}>
        Generate
      </button>
    </div>
  );
};

export default TextInputArea;
