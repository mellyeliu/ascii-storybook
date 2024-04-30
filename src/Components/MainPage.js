import React, { useState, useEffect, useRef} from 'react';
import TextInputArea from './TextArea';
import OutputCard from './OutputCard';
import { createClient } from "@supabase/supabase-js";
import {isDev} from '../helper';
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

const asciiArt = `
  :::::::::::/ ::::::::::/ :::    ::: :::::::::::             :::             :::      ::::::::   :::::::: ::::::::::: :::::::::::
     :+:/     :+:/        :+:    :+:     :+:                  :+:          :+: :+:   :+:    :+: :+:    :+:    :+:         :+:
    +:+/     +:+/         +:+  +:+      +:+                   +:+        +:+   +:+  +:+        +:+           +:+         +:+
   +#+/     +#++:++#/     +#++:+       +#+    +#++:++#++:++   +#+      +#++:++#++: +#++:++#++ +#+           +#+         +#+
  +#+/     +#+/         +#+  +#+      +#+                   +#+       +#+     +#+        +#+ +#+           +#+         +#+
 #+#/     #+#/        #+#    #+#     #+#                  #+#        #+#     #+# #+#    #+# #+#    #+#    #+#         #+#
###.     ##########/ ###    ###     ###                 ###         ###     ###  ########   ######## ########### ###########
`;

const ascii2 = `
#       #
#                                  #            #                                                     ###     ###
##                                 ##           ##                                                      #       #
##                                 ##           ##
########    /##     /##    ###     ########     ########    /###          /###       /###       /###    ###     ###
########    / ###   / ###  #### /  ########     ########    / ###  /      / ###  /   / #### /   / ###  /  ###     ###
##      /   ###     ### /###/      ##           ##      /   ###/      /   ###/   ##  ###/   /   ###/    ##      ##
##     ##    ###     ##/  ##       ##           ##     ##    ##      ##    ##   ####       ##           ##      ##
##     ########       /##          ##           ##     ##    ##      ##    ##     ###      ##           ##      ##
##     #######       / ###         ##           ##     ##    ##      ##    ##       ###    ##           ##      ##
##     ##           /   ###        ##           ##     ##    ##      ##    ##         ###  ##           ##      ##
##     ####    /   /     ###       ##           ##     ##    ##      ##    /#    /###  ##  ###     /    ##      ##
   ##     ######/   /       ### /    ##           ##      ######        ####/ ##  / #### /    ######/     ### /   ### /
  ##      #####   /         ##/      ##           ##      ####          ###   ##    ###/      #####       ##/     ##/
`

const ascii3 = `

`

const styles = { display: 'flex', padding: '0px 0px 100px', height: '600px', width: '100%', color: 'white', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignItems: 'center' }

const titleStyle = {
    // height: 90,
    marginTop: '3%',
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    fontSize: 7,
    color: 'var(--title-color)',
    textShadow: '2px 2px #8f8f8f, -2px -2px #eee',
    // position: 'absolute',
    // bottom: 0,
  }

const SUPABASE_URL = "https://uvramivzkpfyjktzwchk.supabase.co"
const supabase = createClient(SUPABASE_URL, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cmFtaXZ6a3BmeWprdHp3Y2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxODU2MjEsImV4cCI6MjAyOTc2MTYyMX0.C_HlHzDo803JsOj5PbPnnN5uPSsv_Yrwhiyp1AS_EE4");


const SplitScreenComponent = () => {
  const [outputText, setOutputText] = useState('');
  const [responseId, setResponseId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedImageUrls, setGeneratedImageUrls] = useState([]);
  const checkIntervalRef = useRef();

  useEffect(() => {
    // Clear interval on component dismount
    return () => clearInterval(checkIntervalRef.current);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.storage.from('ascii-images').list(responseId);
        if (data.length) {
          let imageUrls = data.map((d) => `https://uvramivzkpfyjktzwchk.supabase.co/storage/v1/object/public/ascii-images/${responseId}/${d.name}`);
          if (data.length == 3) {
            setIsRunning(false);
          } else {
            // Images may still be uploading; duplicate first URL so that we don't show gap in generation
            const firstUrl = imageUrls[0]
            for (let i = data.length; i < 3; i++) {
              imageUrls.push(firstUrl);
            }
          }
          
          setGeneratedImageUrls(imageUrls);
          setLoading(false);

          console.log("Set image urls", imageUrls)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (isRunning) {
      checkIntervalRef.current = setInterval(
        fetchData,
        5000
      );
    } else {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }, [isRunning]);

  const handleGenerate = (inputText) => {
    setLoading(true);
    setOutputText(`${inputText}`);
    const endpoint = isDev ? "http://127.0.0.1:5000/generate" : "https://serif-ascii-client-5c4f8b7f3575.herokuapp.com/generate"

    fetch(endpoint, {
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
        setResponseId(data[0].id);
        setIsRunning(true);
      }
    })
  };

  return (
    <div style={appStyle}>
        {/* <img style={titleStyle} src={"/title2.png"} /> */}
        <div style={titleStyle}>
          {ascii2}
        </div>

    <div style={styles}>
      <TextInputArea onGenerate={handleGenerate} />
      <OutputCard text={outputText} imageURLs={generatedImageUrls} loading={loading}/>
    </div>
    </div>
  );
};

export default SplitScreenComponent;
