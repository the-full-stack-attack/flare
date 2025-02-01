import React, { useEffect, useState, useCallback, useContext, useRef, ref } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Application, extend, useAssets } from '@pixi/react';
import dayjs from 'dayjs';
import { Viewport } from 'pixi-viewport';
import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  NineSliceSprite, // failing
  Text,
  TextStyle,
  Spritesheet, // failing
  AnimatedSprite,
} from 'pixi.js';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AnimatedList } from '../../components/ui/animated-list';
import { Button } from '../../components/ui/button';
import MagicCard from '../../components/ui/magicCard';
import { InteractiveHoverButton } from '../../components/ui/interactive-hover-button';
import MsgBox from '../components/chatroom/MsgBox';
import axios from 'axios';
import temporaryMap from '../assets/images/temporaryAImap.png' // test circle
import { UserContext } from '../contexts/UserContext';
import QuipLash from '../components/chatroom/QuipLash';
import { Countdown } from '../components/chatroom/countdown';
import {
  testJumper,
  spritesheet,
} from '../assets/chatroom/spritesheets/sprites';
// 'extend' is unique to the beta version of pixi.js
// With this beta version, everything you import from pixijs
// must be passed into extend. Then you can utilize them as components
// prefixed with pixi ex. <pixiContainer/> <pixiGraphics/>

extend({
  Container,
  Graphics,
  Sprite,
  Texture,
  NineSliceSprite,
  Text,
  TextStyle,
  AnimatedSprite,
  Texture, // not worth it w/ useAssets...?
  Viewport,
});

const socket = io('http://localhost:4000');

const style = new TextStyle({
  align: 'center',
  fontFamily: 'sans-serif',
  fontSize: 15,
  fontWeight: 'bold',
  fill: '#000000',
  stroke: '#eef1f5',
  letterSpacing: 5,
  wordWrap: true,
  wordWrapWidth: 350,
});

function Chatroom() {
  const location = useLocation();
  const start_time = location.state;
  // LOAD ASSETS
  useAssets([
    {
      alias: 'bunny',
      src: 'https://pixijs.com/assets/bunny.png',
    },
    {
      alias: 'speech',
      src: 'https://pixijs.io/pixi-react/img/speech-bubble.png',
    },
  ]);

  const {
    assets: [texture],
    isSuccess,
  } = useAssets<Texture>([temporaryMap]);

  // Collision Detection testing *relies on tilemaps, NOT READY
  const [playerY, setPlayerY] = useState(0);
  const [playerX, setPlayerX] = useState(0);
  const [playerPosition, setPlayerPosition] = useState([playerY, playerX]);

  // LOGIC
  const { user } = useContext(UserContext);
  const [allPlayers, setAllPlayers] = useState([]);
  const [eventId, setEventId] = useState(document.location.pathname.slice(10));
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [gameWidth, setGameWidth] = useState(window.innerWidth);
  const [gameHeight, setGameHeight] = useState(window.innerHeight);
  const displayMessage = (msg: string) => {
    setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  // QUIPLASH
  const [isPlayingQuiplash, setIsPlayingQuiplash] = useState(false);
  // useEffect(() => {

  // }, [isPlayingQuipLash])
  const toggleQuiplash = () => {
    console.log('clicked')
    isPlayingQuiplash ? setIsPlayingQuiplash(false) : setIsPlayingQuiplash(true);
  }
  // TESTING //
  let anim = useRef(false);

  useEffect(() => {

    (async () => {
      try {
        anim.current = new AnimatedSprite(spritesheet.animations.enemy); // failing
        await anim.current.parse();
      } catch (err) {
        console.error('No parse of spritesheet', err);
      }
    })();
  }, [anim]);
  // TESTING //

  // EXAMPLES
  const speechBubble = useCallback((graphics: unknown) => {
    graphics?.texture(Assets.get('speech'), 0xffffff, 10, -200, 180);
    graphics?.scale.set(1.5, 0.5);
  }, []);

  // CONTROLS
  const keyPress = ({ key }: Element) => {
    if (isTyping === false) {
      if (key === 'ArrowUp' || key === 'w') {
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

  const keyUp = ({ key }: Element) => {
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

  // WINDOW SIZING
  useEffect(() => {
    const handleResize = () => {
      setGameWidth(window.innerWidth);
      setGameHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SOCKET ACTIVITY & MAP LOAD
  useEffect(() => {
    axios.get(`api/chatroom/${eventId}`).catch((err) => console.error(err));
    socket.emit('joinChat', { user, eventId });
    /**
     *  When client joins the chat, be assigned a room.
     *
     *  Send a get request to 'chatroom' along with the current path endpoint as a param
     *
     *  The get request will return a chatroom map. set the state to the current room map
     *
     * 
     *
     * */
    socket.on('message', (msg) => {
      displayMessage(msg);
      // Update UI with the new message
    });
    // Update state of all players and their respective positions
    socket.on('newPositions', (data) => {
      let allPlayerInfo = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].room === eventId) {
          allPlayerInfo.push({
            id: data[i].id,
            x: data[i].x,
            y: data[i].y,
            username: data[i].username,
            sentMessage: data[i].sentMessage,
            currentMessage: data[i].currentMessage,
            room: data[i].room,
          });
        }
      }
      setAllPlayers(allPlayerInfo);
    });
  }, []);

  // EVENT LISTENERS FOR TYPING
  useEffect(() => {
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

  const typing = async () => {
    await setIsTyping(!isTyping);
  };

  const sendMessage = () => {
    console.log(message);
    socket.emit('message', { message, eventId });
    displayMessage(message);
    setMessage('');
  };

  // test circle
  const drawCircle = (graphics: unknown) => {
    graphics?.clear();
    graphics?.circle(100, 100, 50);
    graphics?.fill('red');
  };

  return (
    <div className='bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <div style={{ width: { gameWidth }, height: { gameHeight } }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '80px',
        }} ><Countdown endTime={dayjs(start_time)}/></div>
             {/* <Viewport 
        app={app} // Pass the Pixi.js application instance to the Viewport
        width={800} 
        height={600}
        drag={true}
        pinchToZoom={true}
        wheel={true}
      > */}
          <Application>
            <pixiContainer x={100} y={200}>
              <pixiGraphics draw={drawCircle} />
            </pixiContainer>
            <pixiContainer>
              {isSuccess && (
                <pixiSprite
                  texture={texture}
                  x={0}
                  y={0}
                  width={800}
                  height={700}
                />
              )}
            </pixiContainer>
            {allPlayers.map((player) => (
              <pixiContainer x={player.x} y={player.y} key={player.id}>
                {player.sentMessage && <pixiGraphics draw={speechBubble} />}
                {player.sentMessage && (
                  <pixiText
                    text={player.currentMessage}
                    anchor={0.5}
                    x={70}
                    y={-50}
                    style={style}
                  />
                )}
                <pixiSprite
                  texture={Assets.get('bunny')}
                  x={0}
                  y={0}
                  width={22}
                  height={22}
                  key={player.id}
                />
                <pixiText
                  text={player.username}
                  anchor={0.5}
                  x={0}
                  y={50}
                  style={style}
                />

              </pixiContainer>
            ))}
            {/* <pixiAnimatedSprite

              anchor={0.5}
              textures={anim}
              isPlaying={true}
              initialFrame={0}
              animationSpeed={0.1666}
              x={35}
              y={50}
              loop={true}
            /> */}
          </Application>
          {/* </Viewport> */}
          <Button onClick={toggleQuiplash}>Play Quiplash</Button>
          {
            isPlayingQuiplash && <QuipLash startTime={start_time}/>
          }
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}>
        <div onClick={typing}>
          <Label class="text-white"> Send A Chat To the Chatroom! ayyye!</Label>
          <Input
            class="bg-white" 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}>
            <InteractiveHoverButton onClick={sendMessage}>
              Send
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}>
        <MagicCard>

          <AnimatedList>
            {allMessages.map((msg) => (
              <MsgBox msg={msg} user={user} />
            ))}
          </AnimatedList>
        </MagicCard>
      </div>

    </div>
  );
}

export default Chatroom;
