import React, { useState, useEffect } from "react";
import { Button } from '../../../components/ui/button';
import { RainbowButton } from "../../../components/ui/rainbowbutton";
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

interface KeyStroke {
  key: string;
  time: number; // Optional property
  type?: string;
}

interface LoopSound {
  '-': boolean,
  '=': boolean,
}

const MacroRecorder = () => {

  const keySounds = {
    'a': C4, 's': D4, 'd': E4, 'f': F4, 'g': G4, 'h': A4, 'j': B4,
    'w': A04, 'e': G04, 'r': D04, 'k': C5,
    'z': kick, 'x': kick, 'c': snare, 'v': crash1, '.': china,
    '=': beatbass, '-': bassloop,
  };
  
    const [activeKey, setActiveKey] = useState<string | null>(null);
     const [playingSounds, setPlayingSounds] = useState<{ [key: string]: HTMLAudioElement }>({});
    const [recordingLoopSounds, setRecordingLoopSounds] = useState<LoopSound>({'-' : false, '=': false })
    const [recording, setRecording] = useState<boolean>(false);
    const [macro, setMacro] = useState<Array<KeyStroke>>([]);
    const [macroCopy, setMacroCopy] = useState(macro);
    const [playing, setPlaying] = useState<boolean>(false);
    let startTime: number | null = null;
    let pressingLoopButton = false;

    useEffect(() => {
      console.log("Updated playingSounds:", playingSounds);
    }, [playingSounds]); //
      // Function to play sound
      // const playSound = (key: string): void => {
      //   if (keySounds[key]) {
      //     const audio = new Audio(keySounds[key]);
      //     audio.play();
      //     setActiveKey(key); // Highlight active key
      //     setTimeout(() => setActiveKey(null), 200); // Remove highlight after 200ms
      //   }
      // };
        // Function to play a sound
        const playSound = (key: string) => {
          let lowercaseKey = key.toLowerCase();
          if (keySounds[lowercaseKey]) {
            const audio = new Audio(keySounds[lowercaseKey]);
            audio.currentTime = 0;
            audio.play();
            setActiveKey(key); // Highlight active key
            setTimeout(() => setActiveKey(null), 200); // Remove highlight after 200ms
        
            // Handle loop sounds like '=' and '-'
            if (lowercaseKey === "=" || lowercaseKey === "-") {
              setPlayingSounds(prev => ({
                ...prev,
                [lowercaseKey]: audio, // Add the current sound to playingSounds
              }));
            }
          }
        };
        
        const stopSound = (key: string) => {
          let lowercaseKey = key.toLowerCase();
          setPlayingSounds(prev => {
            if (prev[lowercaseKey]) {
              console.log(`Stopping sound for key: ${lowercaseKey}`);
        
              const audio = prev[lowercaseKey];
              audio.pause();
              audio.currentTime = 0;
        
              // Remove the sound from the state
              const updated = { ...prev };
              delete updated[lowercaseKey];
              return updated;
            }
            return prev;
          });
        };

  // Handle key events
 
  // Capture key events
  const handleKeyDown = (event: KeyboardEvent): void => {
    console.log('REACHED KEYDOWN')
    const time = startTime ? Date.now() - startTime : 0;
    const loopKey = event.key.toLowerCase();
    if (!recording || ((event.key === '-' || event.key === '=') && pressingLoopButton ) ) return;
    if((event.key === '-' || event.key === '=') && !pressingLoopButton){
      pressingLoopButton = true;
      setMacro((prevMacro) => [...prevMacro, { key: event.key, time, type: 'keydown' }]);
      return;
    } else {
    setMacro((prevMacro) => [...prevMacro, { key: event.key, time, type: 'keydown' }]);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const loopKey = event.key.toLowerCase();
    if((loopKey === '-' || loopKey === '=')){
      pressingLoopButton = false;
    } 
    const time = startTime ? Date.now() - startTime : 0;
    if (loopKey === '=' || loopKey === '-') {
      setMacro((prevMacro) => [...prevMacro, { key: event.key, time, type: 'keyup' }]);
    }
    stopSound(event.key)
  };

  useEffect(() => {
    if (recording) {
      startTime = Date.now();
      setMacro((prevMacro) => [...prevMacro, { key: '', time: 0 }]);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      macroCopy.forEach(({ key, time }, index) => {
        setTimeout(() => {
          console.log(`Simulating key: ${key}`);
          if (!playingSounds[key]) {
            playSound(key);
          }
          if (index === macroCopy.length - 1) setPlaying(false);
        }, time);
      });
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      setMacroCopy(macro);
    }
  }, [recording, playingSounds])

  useEffect(() => {
    if(playing === true){
    macroCopy.forEach(({ key, time, type }, index) => {
      setTimeout(() => {
        console.log(`Simulating key: ${key}`);
        console.log(type, 'simulating type')
        if(type === 'keyup'){
          console.log('sound should stop')
          stopSound(key)
          return;
        } else if ( type === 'keydown'){
          console.log('START another sound')
          playSound(key)
        }
      }, time);
      if (index === macroCopy.length - 1) setPlaying(false);
    });
  }
  }, [playing])
  // Replay macro
  const playMacro = () => {
    if (playing || macro.length === 0) return;

    setPlaying(true);
  
  };

  return (
    <div className="grid h-56 w-24 grid-cols-1 content-normal gap-4">
      <h2>Macro Recorder</h2>
      <RainbowButton onClick={() => setRecording(!recording)}>
        {recording ? "Stop Recording" : "Start Recording"}
      </RainbowButton>
      <RainbowButton onClick={playMacro} disabled={playing || macro.length === 0}>
        Play Macro
      </RainbowButton>
      <p>{recording ? "Recording..." : "Not Recording"}</p>
      <p>{playing ? " playing..." : "not playing"}</p>
    </div>
  );
};

export default MacroRecorder;