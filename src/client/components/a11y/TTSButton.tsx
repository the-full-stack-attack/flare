import React, { useState, useEffect } from 'react';
import { FaMicrophone } from "react-icons/fa";

type TTSButtonProps = {
  text: string;
};

function TTSButton({ text }: TTSButtonProps) {
  const [isTalking, setIsTalking] = useState<boolean>(false);
  const [stillTalking, setStillTalking] = useState<boolean>(false);

  const readText = () => {
    if (isTalking && !stillTalking) {
      setStillTalking(true);

      const synth = window.speechSynthesis;
      const sayThis = new SpeechSynthesisUtterance(text);

      synth.speak(sayThis);
      sayThis.onend = () => {
        setIsTalking(false);
        setStillTalking(false);
      };
    }
  };

  const handleButtonClick = () => {
    setIsTalking(!isTalking);
  };

  useEffect(() => {
    readText();
  }, [isTalking])

  return (
    <button onClick={handleButtonClick}>
      <FaMicrophone />
    </button>
  );
}

export default TTSButton;
