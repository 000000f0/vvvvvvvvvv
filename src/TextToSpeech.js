import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';

const TextToSpeech = ({ text }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Function to synthesize speech from text using AWS Polly
    const synthesizeSpeech = async () => {
      try {
        // Initialize AWS Polly client
        AWS.config.update({
          accessKeyId: 'AKIAR22DSRP6A3INZCOZ',
          secretAccessKey: 'MnTUbMkLlEqSFcBEylwgcxvOP4chUm91It1/qrGx',
          region: 'eu-west-1', // Change to your desired region
        });

        const polly = new AWS.Polly();

        // Synthesize speech
        const response = await polly.synthesizeSpeech({
          Text: text,
          OutputFormat: 'mp3',
          VoiceId: 'Matthew', // Change to your preferred voice
        }).promise();

        // Create a Blob object from the audio stream
        const blob = new Blob([response.AudioStream], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);

        // Set the audio URL to play it in the <audio> element
        setAudioUrl(url);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the synthesizeSpeech function when the component mounts or when the text prop changes
    synthesizeSpeech();
  }, [text]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    const audio = document.getElementById('audio-element');
    if (audio) {
      if (!isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div>
      <button onClick={toggleAudio} style={{ padding: '0.2rem 0.4rem' }}>
        { '►'}
      </button>
      {audioUrl && (
        <audio
          id="audio-element"
          style={{ display: 'none' }} // Hide the big audio player
          controls
        >
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
