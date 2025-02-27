import React, { useEffect } from "react";
import flamiliarmp3 from '../../assets/sounds/chatroom/flamiliarmp3.mp3';

const BackgroundMusic = () => {
  useEffect(() => {
    const audio = new Audio(flamiliarmp3);
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset the song when unmounting
    };
  }, []);

  return <div>{''}</div>;
};

export default BackgroundMusic;