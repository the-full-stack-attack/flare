import React from "react";
import MacroRecorder from "./MacroRecorder";
import Keyboard from "./Piano";

const DJam = function () {

console.log('DJAM rendered')

  return (
    <div>
      <MacroRecorder></MacroRecorder>
      <Keyboard></Keyboard>
      </div>
  )
}

export default DJam;