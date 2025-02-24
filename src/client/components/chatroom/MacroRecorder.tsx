import React, { useState, useEffect, useRef } from "react";
import { Button } from '../../../components/ui/button';
import { RainbowButton } from "../../../components/ui/rainbowbutton";
// Import sounds...
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

const keySounds = {
  'a': C4, 's': D4, 'd': E4, 'f': F4, 'g': G4, 'h': A4, 'j': B4,
  'w': A04, 'e': G04, 'r': D04, 'k': C5,
  'z': kick, 'x': kick, 'c': snare, 'v': crash1, '.': china,
  '=': beatbass, '-': bassloop,
};

interface KeyStroke {
  key: string;
  time: number; // Time relative to the start of the recording
  type: 'keydown' | 'keyup';
}

const MacroRecorder = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<KeyStroke[][]>([]);
  const [mute, setMute] = useState<boolean>(false);
  const [currentRecording, setCurrentRecording] = useState<KeyStroke[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const isPlaybackRef = useRef<boolean>(false);
  const loopSoundsRef = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const loopKeyStateRef = useRef<{ [key: string]: boolean }>({});

  // Play a sound for a given key
  const playSound = (key: string) => {
    if (mute || !keySounds[key.toLowerCase()]) return null;
    const audio = new Audio(keySounds[key.toLowerCase()]);
    audio.currentTime = 0;
    audio.play().catch(console.error);
    return audio;
  };

  // Stop a specific sound
  const stopSound = (key: string) => {
    const lowercaseKey = key.toLowerCase();
    if (loopSoundsRef.current[lowercaseKey]) {
      loopSoundsRef.current[lowercaseKey]?.pause();
      loopSoundsRef.current[lowercaseKey] = null;
    }
  };

  // Stop all sounds
  const stopAllAudio = () => {
    Object.values(loopSoundsRef.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    loopSoundsRef.current = {};
  };

  // Handle keydown events
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!recording || isPlaybackRef.current) return;

    const key = event.key;
    const time = startTimeRef.current ? performance.now() - startTimeRef.current : 0;

    // Handle loop sounds
    if (key === '-' || key === '=') {
      if (!loopKeyStateRef.current[key]) {
        loopKeyStateRef.current[key] = true;
        loopSoundsRef.current[key] = playSound(key);
      }
      return;
    }

    // Handle regular sounds
    playSound(key);
    currentRecordingRef.current.push({ key, time, type: 'keydown' });
  };

  // Handle keyup events
  const handleKeyUp = (event: KeyboardEvent) => {
    if (!recording || isPlaybackRef.current) return;

    const key = event.key;
    const time = startTimeRef.current ? performance.now() - startTimeRef.current : 0;

    // Handle loop sounds
    if (key === '-' || key === '=') {
      if (loopKeyStateRef.current[key]) {
        loopKeyStateRef.current[key] = false;
        stopSound(key);
      }
      return;
    }

    // Handle regular sounds
    currentRecordingRef.current.push({ key, time, type: 'keyup' });
  };

  // Start or stop recording
  const toggleRecording = () => {
    if (recording) {
      // Stop recording
      setRecordings((prev) => [...prev, currentRecordingRef.current]);
      currentRecordingRef.current = [];
      startTimeRef.current = null;
      stopAllAudio();
      loopKeyStateRef.current = {};
      setPlaying(false); // Stop playback when recording stops
    } else {
      // Start recording

      startTimeRef.current = performance.now();
      currentRecordingRef.current = [];
      if (recordings.length > 0) {
        playPreviousRecording(); // Play the current macro when recording starts
      }
    }
    setRecording((prev) => !prev);
  };

  // Play the previous recording
  const playPreviousRecording = () => {
    if (recordings.length === 0) return;

    isPlaybackRef.current = true;
    setPlaying(true);
    const previousRecording = recordings[recordings.length - 1];

    previousRecording.forEach(({ key, time, type }) => {
      setTimeout(() => {
        if (type === 'keydown') {
          playSound(key);
        }
      }, time);
    });

    // Reset playback flag after the recording finishes
    const maxTime = Math.max(...previousRecording.map((stroke) => stroke.time));
    setTimeout(() => {
      isPlaybackRef.current = false;
      setPlaying(false);
    }, maxTime + 100);
  };
  const playAllRecordings = () => {
    if (playing || recordings.length === 0) return;
  
    setPlaying(true);
    stopAllAudio();
  
    const mergedRecording = recordings.flat().sort((a, b) => a.time - b.time);
  
    mergedRecording.forEach(({ key, time, type }) => {
      setTimeout(() => {
        if (type === 'keydown') {
          console.log("Playing Key:", key, "Time:", time);
          playSound(key);
        }
      }, time);
    });
  
    const maxTime = Math.max(...mergedRecording.map((stroke) => stroke.time));
    setTimeout(() => setPlaying(false), maxTime + 100);
  };
  

  // Toggle mute state
  const toggleMute = () => {
    if (!mute) stopAllAudio();
    setMute((prev) => !prev);
  };

  // Add event listeners for keydown and keyup
  useEffect(() => {
    if (recording) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [recording]);

  return (
    <div className="grid h-56 w-24 grid-cols-1 content-normal gap-2">
      <h2>Macro Recorder</h2>
      <RainbowButton onClick={toggleRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </RainbowButton>
      <Button onClick={toggleMute}>{mute ? "Unmute" : "Mute"}</Button>
      <RainbowButton onClick={playAllRecordings} disabled={playing || recordings.length === 0}>
        Play Macro
      </RainbowButton>
      <p>{recording ? "Recording..." : "Not Recording"}</p>
      <p>{playing ? "Playing..." : "Not Playing"}</p>
      <p>{mute ? "Muted" : "Unmuted"}</p>
    </div>
  );
};

export default MacroRecorder;