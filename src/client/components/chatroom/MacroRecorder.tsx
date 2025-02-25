import React, { useState, useEffect, useRef } from "react";
import { Button } from '../../../components/ui/button';
import { RainbowButton } from "../../../components/ui/rainbowbutton";
import axios from 'axios';
import NOTES from '../../assets/sounds/chatroom/notes/index'
import china from '../../assets/sounds/chatroom/kit/china.mp3';
import crash1 from '../../assets/sounds/chatroom/kit/crash1.mp3';
import snare from '../../assets/sounds/chatroom/kit/snare.mp3';
import kick from '../../assets/sounds/chatroom/kit/kick.mp3';

import vinyl from '../../assets/images/vinyl.png';
import { set } from "date-fns";

interface KeyStroke {
  key: string;
  time: number; // Time relative to the start of the recording
  type: 'keydown' | 'keyup';
}

  const keySounds = {
    'a': NOTES['C4'], 's': NOTES['D4'], 'd': NOTES['E4'], 'f': NOTES['F4'], 'g': NOTES['G4'], 'h': NOTES['A4'], 'j': NOTES['B4'],
    'w': NOTES['A04'], 'e': NOTES['G04'], 'r': NOTES['D04'], 'k': NOTES['C5'],
    'z': kick, 'x': kick, 'c': snare, 'v': crash1, '.': china,
    '=': NOTES['beatbass'], '-': NOTES['bassloop'], 'p': NOTES['bass1'], 'o': NOTES['bass2'], 'i': NOTES['bass3'], 
    'u': NOTES['bass4'], '9': NOTES['bass5'], '8': NOTES['bass6'],
    '5': NOTES['bass8'], '3': NOTES['bass10'], '1': NOTES['bass11'], '0': NOTES['RaccoonCityMassacreBeat'],
  };

const MacroRecorder = ({eventId, user, allRecordings}) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<KeyStroke[][]>([]);
  const [mute, setMute] = useState<boolean>(false); // Mute state
  const currentRecordingRef = useRef<KeyStroke[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const isPlaybackRef = useRef<boolean>(false); // Flag to distinguish playback strokes
  const loopSoundsRef = useRef<{ [key: string]: HTMLAudioElement | null }>({}); // Track loop sounds
  const loopKeyStateRef = useRef<{ [key: string]: boolean }>({}); // Track loop key state
  const [allMacros, setAllMacros] = useState(allRecordings);

const submitMix = () => {
  console.log(recordings)
    axios.post('/api/chatroom/chats',
    { 
      body: 
      {
      eventId,
      user: user.username,
      userId: user.id,
      recording: recordings
      }
    })
    .then(() => {
      console.log('SUBMITTED!')
    })
    .catch((error) => {
      console.error(error, 'ERROR submitting')
    })
  }
  // Play a sound for a given key
  const playSound = (key: string) => {
    if (mute) return; // Do not play sound if muted

    const lowercaseKey = key.toLowerCase();
    if (keySounds[lowercaseKey]) {
      const audio = new Audio(keySounds[lowercaseKey]);
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error('Failed to play sound:', error);
      });
      return audio;
    }
    return null;
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
    if (!recording || isPlaybackRef.current) return; // Skip if not recording or during playback

    const time = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    const key = event.key;

    // Handle loop sounds
    if (key === '-' || key === '=' || key === '0') {
      if (!loopKeyStateRef.current[key]) {
        loopKeyStateRef.current[key] = true; // Mark the key as pressed
        loopSoundsRef.current[key] = playSound(key); // Start loop sound
      }
      return; // Do not record loop buttons
    }

    // Handle regular sounds
    playSound(key);
    currentRecordingRef.current.push({ key, time, type: 'keydown' });
  };

  // Handle keyup events
  const handleKeyUp = (event: KeyboardEvent) => {
    if (!recording || isPlaybackRef.current) return; // Skip if not recording or during playback

    const time = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    const key = event.key;

    // Handle loop sounds
    if (key === '-' || key === '=' || key ==='0') {
      if (loopKeyStateRef.current[key]) {
        loopKeyStateRef.current[key] = false; // Mark the key as released
        stopSound(key); // Stop loop sound
      }
      return; // Do not record loop buttons
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
      stopAllAudio(); // Stop all sounds when recording stops
      loopKeyStateRef.current = {}; // Reset loop key states
    } else {
      // Start recording
      startTimeRef.current = Date.now();
      currentRecordingRef.current = [];
      playAllRecordings(); // Play the previous recording
    }
    setRecording((prev) => !prev);
  };

  // Play the previous recording
  const playPreviousRecording = () => {
    if (recordings.length === 0) return;

    isPlaybackRef.current = true; // Set playback flag
    const previousRecording = recordings.flat();

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
    }, maxTime + 100);
  };

  // Play all recordings
  const playAllRecordings = () => {
    if (playing || recordings.length === 0) return;

    setPlaying(true);
    stopAllAudio();

    recordings.forEach((recording) => {
      recording.forEach(({ key, time, type }) => {
        setTimeout(() => {
          if (type === 'keydown') {
            playSound(key);
          }
        }, time);
      });
    });

    // Reset playing state after the longest recording ends
    const maxTime = Math.max(...recordings.flatMap((recording) => recording.map((stroke) => stroke.time)));
    setTimeout(() => setPlaying(false), maxTime + 100);
  };

  // Toggle mute state
  const toggleMute = () => {
    stopAllAudio()
    setMute((prev) => !prev);
  };
  const clearRecordings = () => {
    setRecordings([]);
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

  const switchRecording = (e) => {
    console.log(e.target.name)
    console.log(allRecordings[e.target.name])
    setRecordings(allRecordings[e.target.name].recording);
  }
  return (
    <div>
    <div>    {
     allRecordings && allRecordings.map((recording, index) => (
        <Button onClick={switchRecording} name={index}>{recording.userName || 'anon'}</Button>
      ))
    }</div>
    <div className='flex justify-center items-center'>
      <div className="size-36 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
        <img src={vinyl} alt="Loading...">
        </img>
        </div>
    <div className="grid h-56 w-24 grid-cols-1 content-normal gap-2">
      <h2>Macro Recorder</h2>
      <RainbowButton onClick={toggleRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </RainbowButton>
      <Button onClick={toggleMute}>{mute ? "Unmute" : "Mute"}</Button>
      <RainbowButton onClick={playAllRecordings} disabled={playing || recordings.length === 0}>
        Play Macro
      </RainbowButton>
      <Button onClick={submitMix}> SUBMIT! </Button>
      <Button onClick={clearRecordings}>Clear Recordings</Button>
      <p>{recording ? "Recording..." : "Not Recording"}</p>
      <p>{playing ? "Playing..." : "Not Playing"}</p>
      <p>{mute ? "Muted" : "Unmuted"}</p>
    </div>
    <div className="size-36 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
        <img src={vinyl} alt="Loading...">
        </img>
        </div>
        </div>
        </div>
  );
};

export default MacroRecorder;