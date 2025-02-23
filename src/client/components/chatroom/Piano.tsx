import React, { useState, useEffect } from 'react';
import G4 from '../../assets/sounds/chatroom/notes/G4.mp3';
import C4 from '../../assets/sounds/chatroom/notes/C4.mp3';
import A4 from '../../assets/sounds/chatroom/notes/A4.mp3';
import B4 from '../../assets/sounds/chatroom/notes/B4.mp3';
import D4 from '../../assets/sounds/chatroom/notes/D4.mp3';
import E4 from '../../assets/sounds/chatroom/notes/E4.mp3';
import F4 from '../../assets/sounds/chatroom/notes/F4.mp3';
import A04 from '../../assets/sounds/chatroom/notes/A04.mp3';
import D04 from '../../assets/sounds/chatroom/notes/D04.mp3';
import G04 from '../../assets/sounds/chatroom/notes/G04.mp3';
import C5 from '../../assets/sounds/chatroom/notes/C5.mp3';
import china from '../../assets/sounds/chatroom/kit/china.mp3';
import crash1 from '../../assets/sounds/chatroom/kit/crash1.mp3';
import snare from '../../assets/sounds/chatroom/kit/snare.mp3';
import kick from '../../assets/sounds/chatroom/kit/kick.mp3';
import bassloop from '../../assets/sounds/chatroom/notes/bassloop.mp3';
import beatbass from '../../assets/sounds/chatroom/notes/beatbass.mp3';
import { TbArrowAutofitDown } from 'react-icons/tb';

function Keyboard() {

  const keySounds = {
    'a': C4,
    's': D4,
    'd': E4,
    'f': F4,
    'g': G4,
    'h': A4,
    'j': B4,
    'w': A04,
    'e': G04,
    'r': D04,
    'k': C5,
    'z': kick,
    'x': kick,
    'c': snare,
    'v': crash1,
    '.': china,
    '=': beatbass,
    '-': bassloop,
  };

  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Function to play sound
  const playSound = (key: string, bool: Boolean): void => {
    if (keySounds[key]) {

      const audio = new Audio(keySounds[key]);

      if(!bool){
        audio.pause();
        audio.currentTime = 0;
        return;
      }

      audio.play();
      setActiveKey(key); // Highlight active key
      setTimeout(() => setActiveKey(null), 200); // Remove highlight after 200ms
    }

  };

  // Handle key press
  const handleKeyDown = (event: KeyboardEvent, ): void => {
    playSound(event.key.toLowerCase(), true);
  };
  const handleKeyUp = (event: KeyboardEvent): void => {
    playSound(event.key.toLowerCase(), false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyUp", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyUp", handleKeyUp);
    };
  }, []);

  return (
    <div className="grid grid-cols-6 ">
      {Object.keys(keySounds).map((key) => (
        <div>
        <button
          key={key}
          onClick={() => playSound(key, true)}
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