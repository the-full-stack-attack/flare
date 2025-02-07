import React, { useEffect, useState, useCallback, useContext, useRef, ref } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Application, extend, useAssets } from '@pixi/react';
import dayjs from 'dayjs';
import { Viewport } from 'pixi-viewport';
import { BackgroundGlow } from '../../components/ui/background-glow';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AnimatedList } from '../../components/ui/animated-list';
import { Button } from '../../components/ui/button';
import  { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { InteractiveHoverButton } from '../../components/ui/interactive-hover-button';
import { UserContext } from '../contexts/UserContext';
import { Countdown } from '../components/chatroom/countdown';
import QuipLash from '../components/chatroom/QuipLash';
import MsgBox from '../components/chatroom/MsgBox';
import SOCKET_URL from '../../../config';
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
import axios from 'axios';
import temporaryMap from '../assets/images/chatImages/temporaryAImap.png' 
import {
  testJumper,
  spritesheet,
} from '../assets/chatroom/spritesheets/sprites';

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

let socket = io(SOCKET_URL);
// if (process.env.REACT_APP_DEVELOPMENT_SOCKETS === 'true') {
//   socket = io('http://localhost:4000');
// } else {
//   socket = io('https://slayer.events'); // NO COOKIES
  // socket = io("DEPLOYED SITE GOES HERE", { // WITH COOKIES
  //   withCredentials: true,
  //   extraHeaders: {
  //     "my-custom-header": "abcd" // IF WE NEED HEADERS
  //   }
  // });
// };
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
    {
      alias: 'temporaryMap',
      src: temporaryMap,
    },
  ]);
  // const {
  //   assets: [texture],
  //   isSuccess,
  // } = useAssets<Texture>([temporaryMap]);
  // Collision Detection testing *relies on tilemaps, NOT READY
  const [playerY, setPlayerY] = useState(0);
  const [playerX, setPlayerX] = useState(0);
  const [playerPosition, setPlayerPosition] = useState([playerY, playerX]);
  // LOGIC
  const { user } = useContext(UserContext);
  const appRef = useRef(null);
  const [gameRatio, setGameRatio] = useState(window.innerWidth / window.innerHeight)
  const [scaleFactor, setScaleFactor] = useState((gameRatio > 1.5) ? 0.8 : 1)
  const [allPlayers, setAllPlayers] = useState([]);
  const [eventId, setEventId] = useState(document.location.pathname.slice(10));
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [gameWidth, setGameWidth] = useState(window.innerWidth);
  const [gameHeight, setGameHeight] = useState(window.innerHeight);
  const displayMessage = (msg: any) => {
    setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  // QUIPLASH
  const [isPlayingQuiplash, setIsPlayingQuiplash] = useState(false);
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
  const speechBubble = useCallback((graphics: unknown) => {
    graphics?.texture(Assets.get('speech'), 0xffffff, 10, -200, 180);
    graphics?.scale.set(1.5, .56);
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
      socket.emit('keyPress', { inputId: 'Up', state: false });
    } else if (key === 'ArrowDown' || key === 's') {
      socket.emit('keyPress', { inputId: 'Down', state: false });
    } else if (key === 'ArrowLeft' || key === 'a') {
      socket.emit('keyPress', { inputId: 'Left', state: false });
    } else if (key === 'ArrowRight' || key === 'd') {
      socket.emit('keyPress', { inputId: 'Right', state: false });
    }
  };
  let variable = 'temporaryMap'
  // SOCKET ACTIVITY & MAP LOAD
  useEffect(() => {
    axios.get(`api/chatroom/${eventId}`).catch((err) => console.error(err));
    socket.emit('joinChat', { user, eventId });
    socket.on('message', (msg) => {
    displayMessage(msg);
    });
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
    displayMessage({message: message, username: user?.username });
    setMessage('');
  };
  // WINDOW SIZING
  const handleResize = () => {
    setGameRatio(window.innerWidth / window.innerHeight)
    setGameWidth(window.innerWidth);
    setGameHeight(window.innerHeight);
    setScaleFactor((gameRatio > 1.3) ? 0.75 : 1)
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
     <div  className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden">
    
    {/* <div
      
      className="flex justify-center items-center"
      // style={{
        //   display: 'flex',
        //   justifyContent: 'center',
        //   marginTop: '20px',
        // }}
        >
        <div> */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '80px',
          }} >
          <Countdown endTime={dayjs(start_time)}/>
          </div> 
          {/* <div class="demoWrapper"> */}
          {/* <div class="py-60 static justify-items-center border border-orange-600"> 
          <div class="aspect-w-16 aspect-h-9  justify-items-center">
          <Card className="aspect-w-16 aspect-h-9 justify-items-center border border-orange-600 overflow-hidden" ref={appRef}> */}
          <div class="p-4">
          <div class="card  aspect-w-16 aspect-h-9 w-full h-full mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden ">
          <div class="p-2">
          <div class="flex justify-center aspect-w-16 aspect-h-9 relative aspect-video ">
          <Application 
          resizeTo={appRef}
          width={Math.floor(640)}
          height={Math.floor(360)}
          backgroundColor={' #FFFFFF'}
         >
             <pixiContainer  
            >

                <pixiSprite
                  texture={Assets.get(variable)}
                  x={0}
                  y={0}
                 
                />
 
            </pixiContainer>
            {allPlayers.map((player) => (
              <pixiContainer 
              x={player.x} 
              y={player.y} 
              key={player.id} 
              scale={scaleFactor, scaleFactor}
              >
                {player.sentMessage && (
                  <pixiGraphics 
                  draw={speechBubble} 
                  
                />
                )}
                {player.sentMessage && (
                  <pixiText
                    text={player.currentMessage}
                    anchor={0.5}
                    x={70}
                    y={-50}
                    scale={scaleFactor * .5, scaleFactor}
                    style={new TextStyle({
                      align: 'center',
                      fontFamily: 'sans-serif',
                      fontSize: 15 * 1 / scaleFactor,
                      fontWeight: 'bold',
                      fill: '#000000',
                      stroke: '#eef1f5',
                      letterSpacing: 5,
                      wordWrap: true,
                      wordWrapWidth: 200 * 1 / scaleFactor,
                    })}
                  />
                )}
                <pixiSprite
                  texture={Assets.get('bunny')}
                  x={0}
                  y={0}
                  scale={scaleFactor, scaleFactor}
                  width={22}
                  height={22}
                  key={player.id}
                />
                <pixiText
                  text={player.username}
                  anchor={0.5}
                  scale={scaleFactor, scaleFactor}
                  x={10}
                  y={40}
                  style={  
                    new TextStyle({
                    align: 'center',
                    fontFamily: 'sans-serif',
                    fontSize: 15 * scaleFactor,
                    fontWeight: 'bold',
                    fill: '#000000',
                    stroke: '#eef1f5',
                    letterSpacing: 5,
                    wordWrap: true,
                    wordWrapWidth: 250 * scaleFactor,
                  }) }
                />
              </pixiContainer>
            ))} 
          </Application>
          </div>
          </div>
          </div>
          </div>
           {/* </Card> 
          </div>
            </div>  */}
       {/* </div>
      </div>*/} 
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}>
        <div onClick={typing}>
          <Label class="text-white text-2xl rounded-md"> Send A Chat </Label>
          <Input
            class="bg-white rounded-md" 
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
          <div
          class="rounded-md"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',}}
            >
            <Button onClick={toggleQuiplash}>Play Quiplash</Button>
            </div>
        </div>
      </div>
            {
              isPlayingQuiplash && <QuipLash startTime={start_time}/>
            }
      <Card class="bg-transparent flex items-center justify-center">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '250px'
        }}>
          <AnimatedList class="w-80 md:w-160 lg:w-300">
            {allMessages.map((msg) => (
              <MsgBox class="w-80 md:w-360 lg:w-2550" msg={msg.message} user={msg.username} />
            ))}
          </AnimatedList>
      </div>
      </Card> 
      </div>
  );
}

export default Chatroom;
