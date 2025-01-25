import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Application, extend, useAssets } from '@pixi/react';
import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';
import { AnimatedList } from "../../components/ui/animated-list";

// 'extend' is unique to the beta version of pixi.js
// With this beta version, everything you import from pixijs
// must be passed into extend. Then you can utilize them as components
// prefixed with pixi ex. <pixiContainer/> <pixiGraphics/>
extend({
  Container,
  Graphics,
  Sprite,
  Texture,
});

const socket = io('http://localhost:4000');

function Chatroom() {
  // useAssets is how images are loaded into Application
  useAssets([
    'https://pixijs.com/assets/bunny.png',
    {
      alias: 'bunny',
      src: 'https://pixijs.com/assets/bunny.png',
    },
  ]);

  // useCallback works for drawing circle
  const drawCallback = useCallback((graphics: unknown) => {
    // graphics.clear()
    graphics?.setFillStyle({ color: 'red' });
    graphics?.circle(100, 100, 50);
    graphics?.fill();
  }, []);

  // Temporary variables for collision detection testing
  const [playerY, setPlayerY] = useState(0);
  const [playerX, setPlayerX] = useState(0);
  const [playerPosition, setPlayerPosition] = useState([playerY, playerX]);

  // An array of every player connected to the chatroom
  const [allPlayers, setAllPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);


  useEffect(() => {
    console.log('welcome to chat')
    // Player has joined chat

    // Set the current endpoint to the 'room' for the sockets 
    // vs
    // Pass the current endpoint's path of 'chatroom_id' in as data for this socket
    socket.emit('joinChat');
    /**
     * When you join the chat, you need to be assigned a room.
     *
     *  Send a get request to 'chatroom' along with the current path endpoint as a param
     *
     *  The get request will return a chatroom map. set the state to the current room map
     *
     *  
     * 
     * */
    socket.on('message', (msg) => {
      console.log('message received: ' + msg);
      displayMessage(msg);
      // Update UI with the new message
    });
    // Update state of all players and their respective positions
    socket.on('newPositions', (data) => {
      let allPlayerInfo = [];
      for (let i = 0; i < data.length; i++) {
        allPlayerInfo.push({
          id: data[i].id,
          x: data[i].x,
          y: data[i].y,
        });
      }
      setAllPlayers(allPlayerInfo);
    });
  }, []);
  
  // When the player is typing, remove event listeners for movement
  useEffect(() => {
    console.log('isTyping changed to', isTyping);
  }, [isTyping]);
  useEffect(() => {
    const handleInputChange = (event) => {
      console.log('Input changed:', event.target.value);
    };
    if (isTyping === false) {
      document.addEventListener('keydown', keyPress);
      document.addEventListener('keyup', keyUp);
    } else {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('keyup', keyUp);
    }
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('keyup', keyUp);
    };
  }, [isTyping]);
  
  const sendMessage = () => {
    socket.emit('message', message);
    displayMessage(message);
    setMessage('');
  };
  // Changes when div containing typing is clicked
  const typing = async () => {
    await setIsTyping(!isTyping);
  };

  const displayMessage = (msg: string) => {
    setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  // Controls movement by updating the state on the server
  const keyPress = ({ key }) => {
    if (isTyping === false) {
      if (key === 'ArrowUp' || key === 'w') { 
        console.log('emitted');
        socket.emit('keyPress', { inputId: 'Up', state: true });
      } else if (key === 'ArrowDown' || key === 's') { 
        socket.emit('keyPress', { inputId: 'Down', state: true });
      } else if (key === 'ArrowLeft' || key === 'a') { 
        socket.emit('keyPress', { inputId: 'Left', state: true });
      } else if (key === 'ArrowRight' || key === 'd') { 
        socket.emit('keyPress', { inputId: 'Right', state: true });
      }
    }
  };

  const keyUp = ({ key }) => {
    console.log('aye');
    if (key === 'ArrowUp' || key === 'w') {
      // Up
      socket.emit('keyPress', { inputId: 'Up', state: false });
    } else if (key === 'ArrowDown' || key === 's') {
      // Down
      socket.emit('keyPress', { inputId: 'Down', state: false });
    } else if (key === 'ArrowLeft' || key === 'a') {
      // Left
      socket.emit('keyPress', { inputId: 'Left', state: false });
    } else if (key === 'ArrowRight' || key === 'd') {
      // Right
      socket.emit('keyPress', { inputId: 'Right', state: false });
    }
  };


  return (
    <div>
      <div>
        <Application>
          <pixiContainer x={100} y={200}>
            <pixiGraphics draw={drawCallback} />
          </pixiContainer>
          <pixiContainer x={200} y={100}>
            {allPlayers.map((player) => (
              <pixiSprite
                texture={Assets.get('https://pixijs.com/assets/bunny.png')}
                x={player.x}
                y={player.y}
                width={20}
                height={20}
                key={player.id}
              />
            ))}
          </pixiContainer>
        </Application>
      </div>
      <div onClick={typing}>
        <Label> Oi, put a message in stinky!</Label>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      <div>
            <AnimatedList>
              {allMessages.map((msg) => (
               
                <p >{msg}</p>
              ))}
            </AnimatedList>
      </div>
    </div>
  );
}

export default Chatroom;
