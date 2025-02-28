import React, { useState, useEffect, useRef } from "react";
import MacroRecorder from "./MacroRecorder";
import Keyboard from "./Piano";
import vinyl from '../../assets/images/vinyl.png';
import axios from "axios";
import { isErrored } from "stream";
import { Button } from "@/components/ui/button";
const DJam = function ({eventId, user, toggleDJ}) {

  const [allRecordings, setAllRecordings] = useState<Array[]>([]) 

  useEffect(() => {

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
      arrayOfAllChats.forEach((chat) => {
        let recording = chat.macro
        let userName = chat.username 
        setAllRecordings((prev) => [...prev, { userName, recording } ])
      })
    })
    .catch((error) => {
      console.error(error, 'ERROR')
    })
  }, [])

  return (
    <div>

      <MacroRecorder allRecordings={allRecordings} eventId={eventId} user={user} toggleDJ={toggleDJ}></MacroRecorder>
      <Keyboard></Keyboard>
      </div>
  )
}

export default DJam;