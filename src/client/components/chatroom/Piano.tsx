import React, { useState, useEffect } from 'react';
import NOTES from '../../assets/sounds/chatroom/notes/index'
import china from '../../assets/sounds/chatroom/kit/china.mp3';
import crash1 from '../../assets/sounds/chatroom/kit/crash1.mp3';
import snare from '../../assets/sounds/chatroom/kit/snare.mp3';
import kick from '../../assets/sounds/chatroom/kit/kick.mp3';

function Keyboard() {
  const keySounds = {
    'a': NOTES['C4'], 's': NOTES['D4'], 'd': NOTES['E4'], 'f': NOTES['F4'], 'g': NOTES['G4'], 'h': NOTES['A4'], 'j': NOTES['B4'],
    'w': NOTES['A04'], 'e': NOTES['G04'], 'r': NOTES['D04'], 'k': NOTES['C5'],
    'z': kick, 'x': kick, 'c': snare, 'v': crash1, '.': china,
    '=': NOTES['beatbass'], '-': NOTES['bassloop'], 'p': NOTES['bass1'], 'o': NOTES['bass2'], 'i': NOTES['bass3'], 
    'u': NOTES['bass4'], '9': NOTES['bass5'], '8': NOTES['bass6'],
    '5': NOTES['bass8'], '3': NOTES['bass10'], '1': NOTES['bass11'], '0': NOTES['RaccoonCityMassacreBeat'],
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
      if (key === '=' || key === '-' || key === '0') {
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
    if (key === '=' || key === '-' || key === '0') {
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