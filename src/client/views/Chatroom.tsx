import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import {
  Application,
  extend,
} from '@pixi/react'

import {
  Container,
  Graphics,
} from 'pixi.js'

// extend({
//   Container,
//   Graphics,
// })

const socket = io('http://localhost:4000');

function Chatroom() {

  const [message, setMessage] = useState('');
  // const app = useApp();
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });
  }, []);

  useEffect(() => {
    socket.on('message', (msg) => {
        console.log('message received: ' + msg);
        // Update UI with the new message
    });
}, []);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <div>
      </div>
      <Label> Oi, put a message in stinky!</Label>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
}

export default Chatroom;
