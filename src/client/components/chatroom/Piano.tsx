import React, { useState, useEffect } from 'react';
import G4 from '../../assets/sounds/chatroom/notes/G4.mp3';
import C4 from '../../assets/sounds/chatroom/notes/C4.mp3';
import A4 from '../../assets/sounds/chatroom/notes/A4.mp3';
import B4 from '../../assets/sounds/chatroom/notes/B4.mp3';
import D4 from '../../assets/sounds/chatroom/notes/D4.mp3';
import E4 from '../../assets/sounds/chatroom/notes/E4.mp3';
import F4 from '../../assets/sounds/chatroom/notes/G4.mp3';

function Keyboard() {

  const keySounds = {
    'a': C4,
    's': D4,
    'd': E4,
    'f': F4,
    'g': G4,
    'h': A4,
    'j': B4,
  };

  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Function to play sound
  const playSound = (key: string): void => {
    if (keySounds[key]) {
      const audio = new Audio(keySounds[key]);
      audio.play();
      setActiveKey(key); // Highlight active key
      setTimeout(() => setActiveKey(null), 200); // Remove highlight after 200ms
    }
  };

  // Handle key press
  const handleKeyDown = (event: KeyboardEvent): void => {
    playSound(event.key.toLowerCase());
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="grid grid-cols-8 ">
      {Object.keys(keySounds).map((key) => (
        <div>
        <button
          key={key}
          onClick={() => playSound(key)}
          className={`p-4 text-l font-bold border rounded ${
            activeKey === key ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {key.toUpperCase()}
        </button>
        </div>
      ))}
    </div>
  );
};

export default Keyboard;