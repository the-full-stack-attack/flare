import React, { useState, useEffect, useRef } from "react";
import { Button } from '../../../components/ui/button';
import { RainbowButton } from "../../../components/ui/rainbowbutton";
import axios from 'axios';
import NOTES from '../../assets/sounds/chatroom/notes/index'
import china from '../../assets/sounds/chatroom/kit/china.mp3';
import crash1 from '../../assets/sounds/chatroom/kit/crash1.mp3';
import snare from '../../assets/sounds/chatroom/kit/snare.mp3';
import kick from '../../assets/sounds/chatroom/kit/kick.mp3';
import { Card, CardTitle, CardContent } from "@/components/ui/card";
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
  const [showRecs, setShowRecs] = useState<boolean>(false);
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

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Preload all sounds once
    const preloadedAudio: { [key: string]: HTMLAudioElement } = {};
    Object.keys(keySounds).forEach((key) => {
      preloadedAudio[key] = new Audio(keySounds[key]);
    });
    audioRefs.current = preloadedAudio;
  
    // Cleanup function to release memory
    return () => {
      Object.values(preloadedAudio).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);
  
  const playSound = (key: string): HTMLAudioElement | null => {
    if (mute) return null; // Do not play sound if muted
  
    const lowercaseKey = key.toLowerCase();
    const audio = audioRefs.current[lowercaseKey];
  
    if (audio) {
      audio.currentTime = 0; // Restart sound
      audio
        .play()
        .catch((error) => console.error('Failed to play sound:', error));
  
      return audio;
    }
  
    return null;
  };
  
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

  const toggleShowRecs = (e) => {
    setShowRecs(!showRecs);
  }
  return (
    <div>
   {!showRecs ? <div className="flex justify-center p-3">
    <RainbowButton onClick={toggleShowRecs}>Show Submitted Recordings!</RainbowButton>
    </div> :
    <Card className="max-h-[200px] w-full overflow-hidden border border-gray-300 shadow-lg bg-slate-900">
        <CardTitle>Submitted Recordings</CardTitle>
      <CardContent className="max-h-[200px] overflow-y-auto p-2">
        <div className="grid grid-cols-3 gap-2">
       {
     allRecordings && allRecordings.map((recording, index) => (
        <Button className="bg-fuchsia-300 hover:bg-fuchsia-500" onClick={switchRecording} name={index}>{recording.userName || 'anon'}</Button>
      ))
    }</div>
    </CardContent>
    <RainbowButton onClick={toggleShowRecs}>Close</RainbowButton>
  </Card>
}

    <Card className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-white">
    <p className="hidden lg:flex justify-center font-bold text-gray-400 text-7xl"><em>MACRO RECORDER 2000</em></p>
    <div className='flex justify-center items-center'>
      <div className="hidden md:flex size-60 p-4 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
        <img src={vinyl} alt="Loading...">
        </img>
        </div>
        <Card className="w-64 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 border-orange-700">
    <div className="grid h-60 w-50 p-4 grid-cols-2 content-normal gap-2">
     <div  className="col-span-2 "> <p className="font-bold text-gray-900"><em>Macro Recorder 2000</em></p></div>
      <Button  className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200"  onClick={toggleRecording}>
        {recording ? "Stop" : "Record"}
      </Button>
      <div>
        {recording ? <Card className="bg-red-950 font-bold text-red-300 flex justify-center items-center border-red-500">REC</Card> : <Card className="bg-black font-bold text-white flex justify-center items-center ">REC</Card>  }
        </div>
      <Button  className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200"  onClick={playAllRecordings} disabled={playing || recordings.length === 0}>
        Play Macro
      </Button>
      <div>
      {playing ? <Card className="bg-green-950 font-bold text-green-500 flex justify-center items-center border-green-700">PLAYING</Card> : <Card className="bg-black font-bold text-white flex justify-center items-center ">PLAYING</Card>  }
      </div>
      <Button  className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200" onClick={toggleMute}>{mute ? "Unmute" : "Mute"}</Button>
      <div>
      {mute ? <Card className="bg-yellow-950 font-bold text-yellow-500 flex justify-center items-center border-yellow-700">ON</Card> : <Card className="bg-black font-bold text-white flex justify-center items-center ">OFF</Card>  }
      </div>
      <RainbowButton className="text-gray-200"onClick={submitMix}> SUBMIT! </RainbowButton>
      
      <Button className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200" onClick={clearRecordings}>Clear Macros</Button>
      
   
    </div>
    </Card>
    <div className="hidden md:flex size-60 p-4 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
        <img src={vinyl} alt="Loading...">
        </img>
        </div>
        </div>
        </Card>
        </div>
  );
};

export default MacroRecorder;