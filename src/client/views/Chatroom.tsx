import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Application, extend, useAssets } from '@pixi/react';
import { Container, Graphics, Sprite, Texture, Assets } from 'pixi.js';

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

  const [playerY, setPlayerY] = useState(0);
  const [playerX, setPlayerX] = useState(0);
  const [playerPosition, setPlayerPosition] = useState([playerY, playerX]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [message, setMessage] = useState('');
  // const app = useApp();
  useEffect(() => {
     socket.emit('joinChat');
  }, []);

  useEffect(() => {
    socket.on('message', (msg) => {
      console.log('message received: ' + msg);
      // Update UI with the new message
    });
  }, []);

  useEffect(() => {
    socket.on('newPositions', (data) => {
      let allPlayerInfo = []
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

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  const keyPress = (e) => {
    if(e.keyCode === 38 ){ // up
      socket.emit('keyPress', {inputId: 'up', state: true })
    }
  if(e.keyCode === 40 ){ // down
    socket.emit('keyPress', {inputId: 'down', state: true })
  }
  if(e.keyCode === 37 ){ // left
    socket.emit('keyPress', {inputId: 'left', state: true })
  }
  if(e.keyCode === 39 ){ // right
    socket.emit('keyPress', {inputId: 'right', state: true })
  } 
  }

  const keyUp = (e) => {
    if(e.keyCode === 38 ){ // up
      socket.emit('keyPress', {inputId: 'up', state: false })
    }
  if(e.keyCode === 40 ){ // down
    socket.emit('keyPress', {inputId: 'down', state: false })
  }
  if(e.keyCode === 37 ){ // left
    socket.emit('keyPress', {inputId: 'left', state: false })
  }
  if(e.keyCode === 39 ){ // right
    socket.emit('keyPress', {inputId: 'right', state: false })
  } 
  }

  return (
    <div>
      <div onKeyDown={keyPress} onKeyUp={keyUp}>
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
          )) }
            {/* <pixiSprite
       
        ></pixiSprite> */}
          </pixiContainer>
        </Application>
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
