import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '../../../components/ui/button';
import { RainbowButton } from '../../../components/ui/rainbowbutton';
import axios from 'axios';
import NOTES from '../../assets/sounds/chatroom/notes/index';
import china from '../../assets/sounds/chatroom/kit/china.mp3';
import crash1 from '../../assets/sounds/chatroom/kit/crash1.mp3';
import snare from '../../assets/sounds/chatroom/kit/snare.mp3';
import kick from '../../assets/sounds/chatroom/kit/kick.mp3';
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import vinyl from '../../assets/images/vinyl.png';
import { set } from 'date-fns';
import { ChatroomContext, ToggleDJContext } from '@/client/contexts/ChatroomContext';
import { UserContext } from '../../contexts/UserContext';
interface KeyStroke {
  key: string;
  time: number; // Time relative to the start of the recording
  type: 'keydown' | 'keyup';
}


const MacroRecorder = () => {
  let keySounds = {
    a: NOTES['C4'],
    s: NOTES['D4'],
    d: NOTES['E4'],
    f: NOTES['F4'],
    g: NOTES['G4'],
    h: NOTES['A4'],
    j: NOTES['B4'],
    w: NOTES['A04'],
    e: NOTES['G04'],
    r: NOTES['D04'],
    k: NOTES['C5'],
    z: kick,
    x: kick,
    c: snare,
    v: crash1,
    '.': china,
    '=': NOTES['beatbass'],
    '-': NOTES['bassloop'],
    p: NOTES['bass1'],
    o: NOTES['bass2'],
    i: NOTES['bass3'],
    u: NOTES['bass4'],
    '9': NOTES['bass5'],
    '8': NOTES['bass6'],
    '5': NOTES['bass8'],
    '3': NOTES['bass10'],
    '1': NOTES['bass11'],
    '0': NOTES['RaccoonCityMassacreBeat'],
  };
  const { user } = useContext(UserContext);
  const eventId = useContext(ChatroomContext);
  const toggleDJ = useContext(ToggleDJContext);
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
  const [allRecordings, setAllRecordings] = useState<Array[]>([]) 
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  
  const bgColors = {
    1: 'bg-gradient-to-r from-gray-950 via-gray-700 to-gray-950',
    2: 'bg-gradient-to-r from-slate-950 via-fuchsia-950 to-slate-950',
    3: 'bg-gradient-to-r from-red-950 via-red-800 to-red-950',
    4: 'bg-gradient-to-r from-yellow-700 via yellow-500 to-orange-500',
  }
  const txtColors = {
    1: 'text-white text-7xl text-opacity-25',
    2:  'text-violet-800 text-7xl text-opacity-50',
    3:  'text-gray-950  text-7xl text-opacity-50',
    4:  'text-white  text-7xl',
  }
  const [count, setCount] = useState<Number>(1)
  const [macroBgColor, setMacroBgColor] = useState(bgColors[count]);
  const [macroTxtColor, setMacroTxtColor] = useState(txtColors[count]);
 

  const grabAllRecordings = () => {
    axios.get('/api/chatroom/chats',
      { 
        params: 
        {
        eventId,
        user: user.username,
        userId: user.id,
        }
      })
      .then((mixChats) => {
        let arrayOfAllChats = mixChats.data;
       
          setAllRecordings(arrayOfAllChats.map((chat) => {
            let recording = chat.macro
            let userName = chat.username 
            return { userName, recording };
        })
      )})
      .catch((error) => {
        console.error(error, 'ERROR')
      })
  }
  useEffect(() => {
    grabAllRecordings();
   
  }, [])

  useEffect(() => {
    console.log(eventId)
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

  const toggleColor = () => {
if(count >= 4){
  setCount(1);
  return;
}
setCount(count + 1);
  }

  useEffect(() => {
    setMacroBgColor(bgColors[String(count)]);
    setMacroTxtColor(txtColors[String(count)]);
}, [count]  )


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
    console.log(recordings);
    axios
      .post('/api/chatroom/chats', {
        body: {
          eventId,
          user: user.username,
          userId: user.id,
          recording: recordings,
        },
      })
      .then(() => {
        console.log('SUBMITTED!');
        grabAllRecordings();
      })
      .catch((error) => {
        console.error(error, 'ERROR submitting');
      });
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
    if (key === '-' || key === '=' || key === '0') {
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
    const maxTime = Math.max(
      ...recordings.flatMap((recording) =>
        recording.map((stroke) => stroke.time)
      )
    );
    setTimeout(() => setPlaying(false), maxTime + 100);
  };

  // Toggle mute state
  const toggleMute = () => {
    stopAllAudio();
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
      keySounds = null;
    };
  }, [recording]);

  const switchRecording = (e) => {
    console.log(e.target.name);
    console.log(allRecordings[e.target.name]);
    setRecordings(allRecordings[e.target.name].recording);
  };

  const toggleShowRecs = (e) => {
    setShowRecs(!showRecs);
  };
  return (
    <div>
      {!showRecs ? (
        <div className="grid grid-cols-3 justify-center p-3">
          <RainbowButton className={''}onClick={toggleDJ}>QUIT GAME</RainbowButton>
          <RainbowButton className='col-span-1 ml-4' onClick={toggleShowRecs}>
            Submitted Mixes
          </RainbowButton>
          <RainbowButton className={'ml-4'}onClick={toggleColor}>Change Colors</RainbowButton>
        </div>
      ) : (
        <Card className="max-h-[200px] w-full overflow-hidden border border-gray-300 shadow-lg bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-orange-800 mt-2 mb-2">
          <CardTitle className="flex justify-center text-white text-opacity-25 mt-2">Submitted Recordings</CardTitle>
          <CardContent className="max-h-[200px] overflow-y-auto p-2">
            <div className="grid grid-cols-3 gap-2">
            <Card className=" bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 col-span-3 grid grid-cols-4 gap-3 border-orange-800">
            <CardTitle className="col-span-4 flex justify-center mt-2 ml-2 text-white text-opacity-75">
              <p>Clicking on a recording will load that users track into your Macro-Recorder! You can remix it and submit it as your own!</p>
              </CardTitle>
              {allRecordings &&
                allRecordings.map((recording, index) => (
                  <Button
                  
                    className="col-span-1 h-8 text-lg px-4 py-4 mb-4 text-white mt-2 ml-2 mr-2 bg-gray-950  hover:bg-orange-500 text-white"
                    onClick={switchRecording}
                    name={index}
                  >
                    {recording.userName || 'anon'}
                  </Button>
                ))}
            </Card>
            </div>
          </CardContent>
          <div className='grid grid-cols-3'>
          <Button className={'w-20 h-8 text-xs px-4 py-4 mb-4 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white mt-2 ml-2 mr-2 '}onClick={toggleDJ}>QUIT GAME</Button>
          <Button className={'w-20 h-8 text-xs px-4 py-4 mb-4 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white mt-2 ml-2 mr-2 '}onClick={toggleShowRecs}>Hide</Button>
          </div>
        </Card>
      )}

      <Card className={`${macroBgColor} border-orange-700 text-white`}>
        <p className={`hidden lg:flex justify-center font-bold ${macroTxtColor}`}>
          <em>MACRO RECORDER 2000</em>
        </p>
        <div className="flex justify-center items-center">
          <div className="hidden md:flex size-60 p-4 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
            <img src={vinyl} alt="Loading..."></img>
          </div>
          <Card className="w-64 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 border-orange-700">
            <div className="grid h-60 w-50 p-4 grid-cols-2 content-normal gap-2">
              <div className="col-span-2 ">
                {' '}
                <p className="font-bold text-gray-900">
                  <em>Macro Recorder 2000</em>
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200"
                onClick={toggleRecording}
              >
                {recording ? 'Stop' : 'Record'}
              </Button>
              <div>
                {recording ? (
                  <Card className="bg-red-950 font-bold text-red-300 flex justify-center items-center border-red-500">
                    REC
                  </Card>
                ) : (
                  <Card className="bg-black font-bold text-white flex justify-center items-center ">
                    REC
                  </Card>
                )}
              </div>
              <Button
                className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200"
                onClick={playAllRecordings}
                disabled={playing || recordings.length === 0}
              >
                Play Macro
              </Button>
              <div>
                {playing ? (
                  <Card className="bg-green-950 font-bold text-green-500 flex justify-center items-center border-green-700">
                    PLAYING
                  </Card>
                ) : (
                  <Card className="bg-black font-bold text-white flex justify-center items-center ">
                    PLAYING
                  </Card>
                )}
              </div>
              <Button
                className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200"
                onClick={toggleMute}
              >
                {mute ? 'Unmute' : 'Mute'}
              </Button>
              <div>
                {mute ? (
                  <Card className="bg-yellow-950 font-bold text-yellow-500 flex justify-center items-center border-yellow-700">
                    ON
                  </Card>
                ) : (
                  <Card className="bg-black font-bold text-white flex justify-center items-center ">
                    OFF
                  </Card>
                )}
              </div>
              <RainbowButton className="text-gray-200" onClick={submitMix}>
                {' '}
                SUBMIT!{' '}
              </RainbowButton>

              <Button
                className="bg-gradient-to-r from-gray-950 via-gray-700 to-gray-900 border-orange-700 text-gray-200"
                onClick={clearRecordings}
              >
                Clear Macros
              </Button>
            </div>
          </Card>
          <div className="hidden md:flex size-60 p-4 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
            <img src={vinyl} alt="Loading..."></img>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MacroRecorder;