import React from 'react';
import { FaMicrophone } from "react-icons/fa";

type TTSButtonProps = {
  text: string;
}

function TTSButton({ text }: TTSButtonProps) {
  return (
    <button>
      <FaMicrophone />
    </button>
  );
}

export default TTSButton;
