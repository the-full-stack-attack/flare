import React, { useState, useEffect, useRef } from "react";
import MacroRecorder from "./MacroRecorder";
import Keyboard from "./Piano";
import vinyl from '../../assets/images/vinyl.png';

const DJam = function () {

  return (
    <div>
      <div className='flex justify-center items-center'>
      <div className="size-36 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
        <img src={vinyl} alt="Loading...">
        </img>
        </div>
      <MacroRecorder></MacroRecorder>
        <div className="size-36 mt-6 bg-transparent animate-[spin_10s_linear_infinite]">
        <img src={vinyl} alt="Loading...">
        </img>
        </div>
        </div>
      <Keyboard></Keyboard>
      </div>
  )
}

export default DJam;