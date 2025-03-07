import React, { useState, useEffect, useRef, useContext } from "react";
import MacroRecorder from "./MacroRecorder";
import Keyboard from "./Piano";
import vinyl from '../../assets/images/vinyl.png';
import axios from "axios";
import { isErrored } from "stream";
import { Button } from "@/components/ui/button";
import { UserContext } from '../../contexts/UserContext';
import { ChatroomContext } from "@/client/contexts/ChatroomContext";

type DJamProps = {
    toggleDJ: () => void,
}


const DJam = function () {

  const [allRecordings, setAllRecordings] = useState<Array[]>([]) 
  const { user } = useContext(UserContext);
  const eventId = useContext(ChatroomContext);
 

  useEffect(() => {
    console.log(eventId, 'event id')
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
      <MacroRecorder allRecordings={allRecordings} user={user}></MacroRecorder>
      <Keyboard></Keyboard>
      </div>
  )
}

export default DJam;