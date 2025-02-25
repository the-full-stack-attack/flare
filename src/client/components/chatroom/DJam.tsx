import React, { useState, useEffect, useRef } from "react";
import MacroRecorder from "./MacroRecorder";
import Keyboard from "./Piano";
import vinyl from '../../assets/images/vinyl.png';
import axios from "axios";
import { isErrored } from "stream";

const DJam = function ({eventId, user}) {

  useEffect(() => {
    console.log(user)
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
      console.log(mixChats, 'ALL CHATS')
    })
    .catch((error) => {
      console.error(error, 'ERROR')
    })
  }, [])

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