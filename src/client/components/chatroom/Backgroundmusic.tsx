import React, { useEffect, useRef } from "react";
import flamiliarmp3 from '../../assets/sounds/chatroom/flamiliarmp3.mp3';


const BackgroundMusic = React.memo(() => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(flamiliarmp3);
    audio.loop = true; // Ensures continuous playback
    audioRef.current = audio;
    
    const playAudio = () => {
      audio.play().catch((error) => console.error("Audio play error:", error));
        audio.volume = 0.3; //
    };

    playAudio();
        

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return null;
});

export default BackgroundMusic;