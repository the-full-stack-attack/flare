import React, { useState, useEffect } from "react";
import { Button } from '../../../components/ui/button';
import G4 from '../../assets/sounds/chatroom/notes/G4.mp3';
import C4 from '../../assets/sounds/chatroom/notes/C4.mp3';
import A4 from '../../assets/sounds/chatroom/notes/A4.mp3';
import B4 from '../../assets/sounds/chatroom/notes/B4.mp3';
import D4 from '../../assets/sounds/chatroom/notes/D4.mp3';
import E4 from '../../assets/sounds/chatroom/notes/E4.mp3';
import F4 from '../../assets/sounds/chatroom/notes/G4.mp3';

interface KeyStroke {
  key: string;
  time: number; // Optional property
}

const MacroRecorder = () => {

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
    
    const [recording, setRecording] = useState<boolean>(false);
    const [macro, setMacro] = useState<Array<KeyStroke>>([]);
    const [macroCopy, setMacroCopy] = useState(macro);
    const [playing, setPlaying] = useState<boolean>(false);
    let startTime: number | null = null;
    
      // Function to play sound
      const playSound = (key: string): void => {
        if (keySounds[key]) {
          const audio = new Audio(keySounds[key]);
          audio.play();
          setActiveKey(key); // Highlight active key
          setTimeout(() => setActiveKey(null), 200); // Remove highlight after 200ms
        }
      };

  // Capture key events
  const handleKeyDown = (event: KeyboardEvent): void => {
    console.log('hey')
    if (!recording) return;

    const time = startTime ? Date.now() - startTime : 0;
    console.log(time)
    setMacro((prevMacro) => [...prevMacro, { key: event.key, time }]);
  };

  useEffect(() => {
    if (recording) {
      startTime = Date.now();
      console.log(startTime)
      setMacro((prevMacro) => [...prevMacro, { key: '', time: 0 }]);
      window.addEventListener("keydown", handleKeyDown);
      macroCopy.forEach(({ key, time }, index) => {
        setTimeout(() => {
          console.log(`Simulating key: ${key}`);
          playSound(key)
          if (index === macroCopy.length - 1) setPlaying(false);
        }, time);
      });
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      setMacroCopy(macro)
    }
    console.log(recording, 'recording')
    console.log(macro);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [recording]);

  // Replay macro
  const playMacro = () => {
    if (playing || macro.length === 0) return;

    setPlaying(true);
    macroCopy.forEach(({ key, time }, index) => {
      setTimeout(() => {
        console.log(`Simulating key: ${key}`);
        playSound(key)
        if (index === macroCopy.length - 1) setPlaying(false);
      }, time);
    });
  };

  return (
    <div>
      <h2>Macro Recorder</h2>
      <Button onClick={() => setRecording(!recording)}>
        {recording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Button onClick={playMacro} disabled={playing || macro.length === 0}>
        Play Macro
      </Button>
      <p>{recording ? "Recording..." : "Not Recording"}</p>
      <p>{playing ? " playing..." : "not playing"}</p>
    </div>
  );
};

export default MacroRecorder;