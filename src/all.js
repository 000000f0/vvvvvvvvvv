import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

const TalkComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [audioUrl, setAudioUrl] = useState('');

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = async (event) => {
    const result = event.results[0][0].transcript;
    try {
      setIsListening(false);
      const serverEndpoint = 'https://deva.ark4.xyz/api'; // Updated endpoint URL

      const requestData = {
        user_input: result,
      };

      const response = await axios.post(
        serverEndpoint,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const apiResponseText = response.data.response;

      AWS.config.update({
        accessKeyId: 'AKIAR22DSRP6A3INZCOZ',
        secretAccessKey: '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',
        region: 'eu-west-1',
      });

      const polly = new AWS.Polly();
      const pollyResponse = await polly.synthesizeSpeech({
        Text: apiResponseText,
        OutputFormat: 'mp3',
        VoiceId: 'Matthew',
      }).promise();

      const blob = new Blob([pollyResponse.AudioStream], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
    }

    return () => {
      if (isListening) {
        recognition.stop();
      }
    };
  }, [isListening]);

  return (
    <div>
      <button onClick={() => {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
        }
      }}>
        {isListening ? '⏹︎' : '⏺︎'}
      </button>

      {!isSupported && <p>Speech recognition is not supported in this browser.</p>}

      {audioUrl && (
        <div>
          <audio key={audioUrl} controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TalkComponent;
