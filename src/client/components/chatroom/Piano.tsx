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
import bass1 from '../../assets/sounds/chatroom/notes/bass1.mp3';
import bass2 from '../../assets/sounds/chatroom/notes/bass2.mp3';
import bass3 from '../../assets/sounds/chatroom/notes/bass3.mp3';
import bass4 from '../../assets/sounds/chatroom/notes/bass4.mp3';
import bass5 from '../../assets/sounds/chatroom/notes/bass5.mp3';
import bass6 from '../../assets/sounds/chatroom/notes/bass6.mp3';
import bass7 from '../../assets/sounds/chatroom/notes/bass7.mp3';
import bass8 from '../../assets/sounds/chatroom/notes/bass8.mp3';
import bass10 from '../../assets/sounds/chatroom/notes/bass10.mp3';
import bass11 from '../../assets/sounds/chatroom/notes/bass11.mp3';

function Keyboard() {
  const keySounds = {
    'a': C4, 's': D4, 'd': E4, 'f': F4, 'g': G4, 'h': A4, 'j': B4,
    'w': A04, 'e': G04, 'r': D04, 'k': C5,
    'z': kick, 'x': kick, 'c': snare, 'v': crash1, '.': china,
    '=': beatbass, '-': bassloop, 'p': bass1, 'o': bass2, 'i': bass3, 
    'u':bass4, '9': bass5, '8': bass6,
    '5': bass8, '3':bass10, '1':bass11
  };

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playingSounds, setPlayingSounds] = useState<{ [key: string]: HTMLAudioElement }>({});

  // Function to play a sound
  const playSound = (key: string) => {
    console.log('piano event listener to play')
    if (keySounds[key]) {
      const audio = new Audio(keySounds[key]);
      audio.currentTime = 0;
      audio.play();
      setActiveKey(key);
      setTimeout(() => setActiveKey(null), 200);

      // Store looping sounds
      if (key === '=' || key === '-') {
        setPlayingSounds((prev) => ({ ...prev, [key]: audio }));
      }
    }
  };

  // Function to stop looping sounds
  const stopSound = (key: string) => {
    if (playingSounds[key]) {
      playingSounds[key].pause();
      playingSounds[key].currentTime = 0;
      setPlayingSounds((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  // Handle key events
  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (!playingSounds[key]) {
      playSound(key);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key === '=' || key === '-') {
      stopSound(key);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [playingSounds]);

  return (
    <div className="grid grid-cols-6 gap-2">
      {Object.keys(keySounds).map((key) => (
        <button
          key={key}
          onClick={() => playSound(key)}
          className={`p-4 text-lg font-bold border rounded ${
            activeKey === key ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {key.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default Keyboard;