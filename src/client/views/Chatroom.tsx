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

  useEffect(() => {
    socket.on('newPositions', (data) => {
      for(let i = 0; i < data.length; i++){
      setPlayerX(data[i].x);
      setPlayerY(data[i].y);

    }
    });
  }, []);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <div>
        <Application>
          <pixiContainer x={100} y={200}>
            <pixiGraphics draw={drawCallback} />
          </pixiContainer>
          <pixiContainer x={200} y={100}>
            <pixiSprite
              texture={Assets.get('https://pixijs.com/assets/bunny.png')}
              x={playerX}
              y={playerY}
              width={20}
              height={20}
            />

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
