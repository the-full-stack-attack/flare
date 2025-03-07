import React, { useState, useEffect, useRef, useContext } from "react";
import MacroRecorder from "./MacroRecorder";
import Keyboard from "./Piano";

const DJam = function () {



  return (
    <div>
      <MacroRecorder></MacroRecorder>
      <Keyboard></Keyboard>
      </div>
  )
}

export default DJam;