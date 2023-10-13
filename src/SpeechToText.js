import React, { useState, useEffect } from 'react';

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    setTranscript(result);
  };

  recognition.onend = () => {
    setIsListening(false);
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
      recognition.stop();
    };
  }, []);

  return (
    <div>
      {isSupported ? (
        <>
          <button onClick={toggleListening}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          {isListening && <p>Listening...</p>}
          <p>Transcript: {transcript}</p>
        </>
      ) : (
        <p>Speech recognition is not supported in this browser.</p>
      )}
    </div>
  );
};

export default SpeechToText;
