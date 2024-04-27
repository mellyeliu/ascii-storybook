import React, { useState, useEffect} from 'react';
import TextInputArea from './TextArea';
import OutputCard from './OutputCard';
import { createClient } from "@supabase/supabase-js";
// import Loader from 'react-loader-spinner';

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

const SUPABASE_URL = "https://uvramivzkpfyjktzwchk.supabase.co"
const supabase = createClient(SUPABASE_URL, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cmFtaXZ6a3BmeWprdHp3Y2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxODU2MjEsImV4cCI6MjAyOTc2MTYyMX0.C_HlHzDo803JsOj5PbPnnN5uPSsv_Yrwhiyp1AS_EE4");


const SplitScreenComponent = () => {
  const [outputText, setOutputText] = useState('');
  const [responseId, setResponseId] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedImageUrls, setGeneratedImageUrls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.storage.from('ascii-images').list(responseId);
        if (data.length) {
          clearInterval(intervalId);
          const imageUrls = data.map((d) => `https://uvramivzkpfyjktzwchk.supabase.co/storage/v1/object/public/ascii-images/${responseId}/${d.name}`);
          setGeneratedImageUrls(imageUrls);

          console.log("Set image urls", imageUrls);
          setLoading(false);
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (responseId !== null) {
      const intervalId = setInterval(fetchData, 5000);
      setIntervalId(intervalId);
    }
  }, [responseId]);

  const handleGenerate = (inputText) => {
    setLoading(true);
    setOutputText(`${inputText}`);

    fetch("http://127.0.0.1:5000/generate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            text: inputText,
        })
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.length) {
        setResponseId(data[0].id)
      }
    })
  };

  return (
    <div style={appStyle}>
        <img style={titleStyle} src="/title.png" />
    <div style={styles}>
      <TextInputArea onGenerate={handleGenerate} />
      <OutputCard text={outputText} imageURLs={generatedImageUrls} loading={loading}/>
    </div>
    </div>
  );
};

export default SplitScreenComponent;
