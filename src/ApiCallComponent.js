import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

function ChatComponent() {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [polly, setPolly] = useState(null); // Polly instance
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize AWS Polly
  useEffect(() => {
    AWS.config.update({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      region: 'eu-west-1',
    });

    setPolly(new AWS.Polly());
  }, []);

  const handleClickBubble = async (text) => {
    if (polly) {
      try {
        // Define the parameters for Polly
        const params = {
          Text: text, // Text to convert to speech
          OutputFormat: 'mp3', // Output format (e.g., mp3)
          VoiceId: 'Matthew', // Voice ID (e.g., Joanna)
        };

        // Use Polly to synthesize speech
        polly.synthesizeSpeech(params, (err, data) => {
          if (err) {
            console.error('Polly Error:', err);
            return;
          }

          // Create a URL for the audio data
          const audioUrl = URL.createObjectURL(
            new Blob([data.AudioStream], { type: 'audio/mpeg' })
          );

          // Create an audio element
          const newAudio = new Audio(audioUrl);

          newAudio.addEventListener('ended', () => {
            setIsPlaying(false);
          });

          setAudio(newAudio);
          setIsPlaying(true);
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handlePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/api/chatgpt',
        {
          name: 'Eva',
          prompt: inputMessage,
          userId: 'user_2VgCI4SWPiAgpPIBgCwGBFIRo1P',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      // Update the chat history with the user's input and bot's response
      setChatHistory([
        ...chatHistory,
        { user: 'User', text: inputMessage },
        { user: 'Bot', text: response.data },
      ]);

      // Clear the input field
      setInputMessage('');

      // Generate speech for the bot's response
      handleClickBubble(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="message-container">
        {/* Map through chat history and display messages */}
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.user.toLowerCase()}`}>
            {/* Display the message text */}
            <table>
              <tbody>
                <tr>
                  <td>{message.text}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="chat-input">
        {/* Input field for the user to type a message */}
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        {/* Button to submit the message */}
        <button onClick={handleSubmit}>Send</button>
      </div>

      <div className="audio-controls">
        {audio && (
          <>
            <button onClick={handlePlayPause}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatComponent;
