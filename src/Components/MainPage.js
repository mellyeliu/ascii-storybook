import React, { useState } from 'react';
import TextInputArea from './TextArea';
import OutputCard from './OutputCard';

const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Uses the full height of the viewport
  width: '100%', // Uses the full width of the viewport
  margin: 0,
  padding: 0,
  boxSizing: 'border-box' // Includes padding and border in the element's total width and height
};

const styles = { display: 'flex', padding: '0px 0px 100px', height: '600px', width: '100%', color: 'white', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignItems: 'center' }
const titleStyle = {
    height: 100,
    marginTop: '5%',
    // position: 'absolute',
    // bottom: 0,
  }

const SplitScreenComponent = () => {
  const [outputText, setOutputText] = useState('');

  const handleGenerate = (inputText) => {
    setOutputText(`${inputText}`);
    // Here you would process the inputText to generate the actual output
  };

  return (
    <div style={appStyle}>
        <img style={titleStyle} src="/title.png" />
    <div style={styles}>
      <TextInputArea onGenerate={handleGenerate} />
      <OutputCard text={outputText} />
    </div>
    </div>
  );
};

export default SplitScreenComponent;
