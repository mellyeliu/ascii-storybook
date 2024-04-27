import React from 'react';
import './Output.css';
import { GlitchedImage } from 'react-image-glitch'


const OutputCard = ({ text }) => {
  return (
    <div style={
        { textAlign: 'left', position: 'relative', fontSize: 14, fontFamily: "'Courier New', Courier, monospace", width: '25%', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#111111', overflow: 'hidden', height: 440, maxHeight: 440 }}>
      {text || "Your generated content will appear here..."}
      <div style={{height: 400, marginTop: 30}}>
      <GlitchedImage style={{maxHeight: 400}} image="/girl.png" />
      </div>
      {/* <img src="/bunny.png" alt="Drifting Left" /> */}
      {/* <img src="/bunny.png" className="image drift-right" alt="Drifting Right" />
      <img src="/bunny.png" className="image drift-up" alt="Drifting Up" /> */}
    </div>
  );
};

export default OutputCard;
