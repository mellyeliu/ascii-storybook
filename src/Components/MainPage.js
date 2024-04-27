import React, { useState } from 'react';
import TextInputArea from './TextArea';
import OutputCard from './OutputCard';

const styles = { display: 'flex', padding: '0px 50px 100px', height: '600px', color: 'white', margin: 'auto', justifyContent: 'center', alignItems: 'center' }
const titleStyle = {
    height: 75,
    marginTop: '85px',
    // position: 'absolute',
    // bottom: 0,
  }

const title = `
_________  _______      ___    ___ _________                     ___         ________  ________  ________  ___  ___
|\___   ___\\  ___ \    |\  \  /  /|\___   ___\                  |\  \       |\   __  \|\   ____\|\   ____\|\  \|\  \
\|___ \  \_\ \   __/|   \ \  \/  / ||___ \  \_|      ____________\ \  \      \ \  \|\  \ \  \___|\ \  \___|\ \  \ \  \
     \ \  \ \ \  \_|/__  \ \    / /     \ \  \      |\____________\ \  \      \ \   __  \ \_____  \ \  \    \ \  \ \  \
      \ \  \ \ \  \_|\ \  /     \/       \ \  \     \|____________|\/  /|      \ \  \ \  \|____|\  \ \  \____\ \  \ \  \
       \ \__\ \ \_______\/  /\   \        \ \__\                   /  //        \ \__\ \__\____\_\  \ \_______\ \__\ \__\
        \|__|  \|_______/__/ /\ __\        \|__|                  /_ //          \|__|\|__|\_________\|_______|\|__|\|__|
                        |__|/ \|__|                              |__|/                    \|_________|
`

const SplitScreenComponent = () => {
  const [outputText, setOutputText] = useState('');

  const handleGenerate = (inputText) => {
    setOutputText(`${inputText}`);
    // Here you would process the inputText to generate the actual output
  };

  return (
    <div>
        <img style={titleStyle} src="/title.png"/>
    <div style={styles}>
      <TextInputArea onGenerate={handleGenerate} />
      <OutputCard text={outputText} />
    </div>
    </div>
  );
};

export default SplitScreenComponent;
