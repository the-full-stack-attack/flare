import React, { useEffect, useState, useCallback, useContext, useRef, ref, useId } from 'react';
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
import { RainbowButton } from '../../components/ui/rainbowbutton';
import { Textarea } from '../../components/ui/textarea';
import { VelocityScroll } from '../../components/ui/scroll-based-velocity';
import  { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { InteractiveHoverButton } from '../../components/ui/interactive-hover-button';
import { UserContext } from '../contexts/UserContext';
import { Countdown } from '../components/chatroom/countdown';
import QuipLash from '../components/chatroom/QuipLash';
import MsgBox from '../components/chatroom/MsgBox';
import SOCKET_URL from '../../../config';
import TILES from '../assets/chatroom/tiles/index';
import IDLE from '../assets/chatroom/idle/index';
import WALK from '../assets/chatroom/walk/index';
import SNAP from '../assets/chatroom/snap/index';
import mapPack from '../assets/chatroom/mapPack';
import { BsSend } from 'react-icons/bs';
import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  NineSliceSprite, // failing
  Text,
  TextStyle,
  AnimatedSprite,
} from 'pixi.js';
import axios from 'axios';
import temporaryMap from '../assets/images/chatImages/temporaryAImap.png' 
import nightClubTileSet from '../assets/chatroom/tileSet';
import { ChartNoAxesColumnDecreasing } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

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
  const { user } = useContext(UserContext);
  const location = useLocation();
  const start_time = location.state;

  const [gameLoaded, setGameLoaded] = useState(false);
  // LOAD ASSETS
  // const { assets, successfulLoad } = 
  const [ arrayForUse, setArrayForUse ] = useState([
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
    {  alias: '1', src: TILES['1'], },
    {  alias: '2', src: TILES['2'], },
    {  alias: '3', src: TILES['3'], },
    {  alias: '4', src: TILES['4'], },
    {  alias: '5', src: TILES['5'], }, 
    {  alias: '6', src: TILES['6'], }, 
    {  alias: '7', src: TILES['7'], }, 
    {  alias: '8', src: TILES['8'], }, 
    {  alias: '9', src: TILES['9'], },
    {  alias: '10', src: TILES['10'], },
    {  alias: '11', src: TILES['11'], }, 
    {  alias: '12', src: TILES['12'], }, 
    {  alias: '13', src: TILES['13'], }, 
    {  alias: '14', src: TILES['14'], }, 
    {  alias: '15', src: TILES['15'], },
    {  alias: '16', src: TILES['16'], },
    {  alias: '17', src: TILES['17'], },
    {  alias: '18', src: TILES['18'], },
    {  alias: '19', src: TILES['19'], }, 
    {  alias: '20', src: TILES['20'], },
    {  alias: '21', src: TILES['21'], }, 
    {  alias: '22', src: TILES['22'], }, 
    {  alias: '23', src: TILES['23'], }, 
    {  alias: '24', src: TILES['24'], }, 
    {  alias: '25', src: TILES['25'], },
    {  alias: '26', src: TILES['26'], },
    {  alias: '27', src: TILES['27'], },
    {  alias: '28', src: TILES['28'], },
    {  alias: '29', src: TILES['29'], }, 
    {  alias: '30', src: TILES['30'], },
    {  alias: '31', src: TILES['31'], }, 
    {  alias: '32', src: TILES['32'], }, 
    {  alias: '33', src: TILES['33'], }, 
    {  alias: '34', src: TILES['34'], }, 
    {  alias: '35', src: TILES['35'], },
    {  alias: '36', src: TILES['36'], },
    {  alias: '37', src: TILES['37'], },
    {  alias: '38', src: TILES['38'], },
    {  alias: '39', src: TILES['39'], }, 
    {  alias: '40', src: TILES['40'], },
    {  alias: '41', src: TILES['41'], }, 
    {  alias: '42', src: TILES['42'], }, 
    {  alias: '43', src: TILES['43'], }, 
    {  alias: '44', src: TILES['44'], }, 
    {  alias: '45', src: TILES['45'], },
    {  alias: '46', src: TILES['46'], },
    {  alias: '47', src: TILES['47'], },
    {  alias: '48', src: TILES['48'], },
    {  alias: '49', src: TILES['49'], },
    {  alias: '50', src: TILES['50'], },
    {  alias: '51', src: TILES['51'], }, 
    {  alias: '52', src: TILES['52'], }, 
    {  alias: '53', src: TILES['53'], }, 
    {  alias: '54', src: TILES['54'], }, 
    {  alias: '55', src: TILES['55'], },
    {  alias: '56', src: TILES['56'], },
    {  alias: '57', src: TILES['57'], },
    {  alias: '58', src: TILES['58'], },
    {  alias: '59', src: TILES['59'], },  
    {  alias: '60', src: TILES['60'], },
    {  alias: '61', src: TILES['61'], }, 
    {  alias: '62', src: TILES['62'], }, 
    {  alias: '63', src: TILES['63'], }, 
    {  alias: '64', src: TILES['64'], }, 
    {  alias: '65', src: TILES['65'], },
    {  alias: '66', src: TILES['66'], },
    {  alias: '67', src: TILES['67'], },
    {  alias: '68', src: TILES['68'], },
    {  alias: '69', src: TILES['69'], }, 
    {  alias: '70', src: TILES['70'], },
    {  alias: '71', src: TILES['71'], }, 
    {  alias: '72', src: TILES['72'], }, 
    {  alias: '73', src: TILES['73'], }, 
    {  alias: '74', src: TILES['74'], }, 
    {  alias: '75', src: TILES['75'], },
    {  alias: '76', src: TILES['76'], },
    {  alias: '77', src: TILES['77'], },
    {  alias: '78', src: TILES['78'], },
    {  alias: '79', src: TILES['79'], }, 
    {  alias: '80', src: TILES['80'], },
    {  alias: '81', src: TILES['81'], }, 
    {  alias: '82', src: TILES['82'], }, 
    {  alias: '83', src: TILES['83'], }, 
    {  alias: '84', src: TILES['84'], }, 
    {  alias: '85', src: TILES['85'], },
    {  alias: '86', src: TILES['86'], },
    {  alias: '87', src: TILES['87'], },
    {  alias: '88', src: TILES['88'], },
    {  alias: '89', src: TILES['89'], }, 
    {  alias: '90', src: TILES['90'], },
    {  alias: '91', src: TILES['91'], }, 
    {  alias: '92', src: TILES['92'], }, 
    {  alias: '93', src: TILES['93'], }, 
    {  alias: '94', src: TILES['94'], }, 
    {  alias: '95', src: TILES['95'], },
    {  alias: '96', src: TILES['96'], },
    {  alias: '97', src: TILES['97'], },
    {  alias: '98', src: TILES['98'], },
    {  alias: '99', src: TILES['99'], }, 
    {  alias: '100', src: TILES['100'], },
    {  alias: '101', src: TILES['101'], }, 
    {  alias: '102', src: TILES['102'], }, 
    {  alias: '103', src: TILES['103'], }, 
    {  alias: '104', src: TILES['104'], }, 
    {  alias: '105', src: IDLE['105']},
    {  alias: '106', src: IDLE['106']},
    {  alias: '107', src: IDLE['107']},
    {  alias: '108', src: IDLE['108']},
    {  alias: '109', src: IDLE['109']},
    { alias: '110', src: WALK['110']},
    { alias: '111', src: WALK['111']},
    { alias: '112', src: WALK['112']},
    { alias: '113', src: WALK['113']},
    { alias: '114', src: WALK['114']},
    { alias: '115', src: WALK['115']},
    { alias: '116', src: SNAP['1']},
    { alias: '116', src: SNAP['2']},
    { alias: '116', src: SNAP['3']},
    { alias: '116', src: SNAP['4']},
    { alias: '116', src: SNAP['5']},

  ])
  const { assets, isSuccess }  = useAssets(arrayForUse);
  
  const [ lobby, setLobby ] = useState([user]);
  // const {
  //   assets: [texture],
  //   isSuccess,
  // } = useAssets<Texture>([temporaryMap]);
  // Collision Detection testing *relies on tilemaps, NOT READY
  const [playerY, setPlayerY] = useState(0);
  const [playerX, setPlayerX] = useState(0);
  const [playerPosition, setPlayerPosition] = useState([playerY, playerX]);
  // LOGIC

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
  const spriteRef = useRef(null);
  const [isPlayingQuiplash, setIsPlayingQuiplash] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string | null>(user.avatar_uri);
  const displayMessage = (msg: any) => {
    setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  const [textures, setTextures] = useState([]);
  const [walkTextures, setWalkTextures] = useState([]);
const [isReady, setIsReady] = useState(false);
    useEffect(() => {
    socket.on('newPlayerList', ({ PLAYER_LIST }) => {
      for(let player in PLAYER_LIST ){
        console.log(PLAYER_LIST[player])
        if(!lobby.includes(PLAYER_LIST[player].username)){
          setLobby((prevItems) => [ ...prevItems, PLAYER_LIST[player].username ])
          // setTimeout( () => {
           setArrayForUse((prevItems) => [...prevItems, { alias: PLAYER_LIST[player].username, src: PLAYER_LIST[player].avatar, }])
          // }, 5000)
        }
      }
      // setTimeout( () => {
      //      setArrayForUse((prevItems) => [...prevItems, { alias: PlayerList.user.username, src: PlayerList.user.avatar_uri, }])
      //     }, 5000)
      // console.log(PlayerList.user.username)
        })
    
    }, []);
    
  // QUIPLASH
  const toggleQuiplash = () => {
    // console.log('clicked')
    isPlayingQuiplash ? setIsPlayingQuiplash(false) : setIsPlayingQuiplash(true);
  }
  const speechBubble = useCallback((graphics: unknown) => {
    graphics?.texture(Assets.get('speech'), 0xffffff, 10, -200, 180);
    graphics?.scale.set(.75, .26);
  }, []);
  // CONTROLS
  const keyPress = ({ key }: any) => {
    // console.log(key, 'key caught')
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
  const keyUp = ({ key }: any) => {
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
            avatar: data[i].avatar,
            x: data[i].x,
            y: data[i].y,
            username: data[i].username,
            sentMessage: data[i].sentMessage,
            currentMessage: data[i].currentMessage,
            room: data[i].room,
            isWalking: data[i].isWalking,
          });
        //   console.log(allPlayerInfo, 'ok');
     
          
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
  // MESSAGING
  useEffect(() => {
    axios.get('/api/chatroom/image')
    .then((avatarURI) => {
      // console.log('received successful pic', avatarURI);
    }).catch((error) => {
      console.error('ERROR GETTING PIC', error)
    })
  }, [avatarImage])

  const typing = async () => {
    await setIsTyping(true);
  };
  //////////////////////////////////////////////////

  useEffect(() => {
    if (spriteRef.current && isReady) {
      spriteRef.current.play(); // Explicitly start animation
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const loadedTextures = [
        assets['107'], assets['108'], assets['109'], assets['110'], assets['111'], 
      ];
      const loadedWalkTextures = [
        assets['112'], assets['113'], assets['114'], assets['115'], assets['116'], 
      ]
      setTextures(loadedTextures);
      setWalkTextures(loadedWalkTextures);
      setIsReady(true); // Once textures are ready, set the state to true
    }
  }, [isSuccess, assets]); // Re-run when assets load
  
///////////////////////////////////////////
  const notTyping = async () =>{
    await setIsTyping(false);
  }
  const sendMessage = () => {
    // console.log(message);
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

  const styleMessage = new TextStyle({
    align: 'center',
    fontFamily: 'sans-serif',
    fontSize: 10,
    fontWeight: 'bold',
    fill: '#000000',
    stroke: '#eef1f5',
    letterSpacing: 2,
    wordWrap: true,
    wordWrapWidth: 80,
    
  })

  const styleUserName = new TextStyle({
    align: 'center',
    fontFamily: 'sans-serif',
    fontSize: 15 ,
    fontWeight: 'bold',
    fill: '#000000',
    stroke: '#eef1f5',
    letterSpacing: 5,
    wordWrap: true,
    wordWrapWidth: 250,
  })

  const handlePointerDown = (e) => {
    // console.log(e.target.name)
   keyPress({key: e.target.name})// Adjust the timeout as needed
  };
  
  const handlePointerUp = (e) => {
   keyUp({key: e.target.name})// Adjust the timeout as needed
   };
  return (
     <div  className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden">
      <div>
        <img src={ TILES['1'] } alt='' />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '80px',
          }} >
          <Countdown endTime={dayjs(start_time)}/>
          </div> 
          { !isPlayingQuiplash && 
        <div className="flex justify-center"> 
        <RainbowButton className="bg-gradient-to-r from-cyan-500 via-grey-100 to-blue-500 text-white mt-1" onClick={toggleQuiplash}>
          Ice-Breaker Games
          </RainbowButton>
          </div> || 
          <div className="flex justify-center"> 
          <RainbowButton className="bg-gradient-to-r from-cyan-500 via-grey-100 to-blue-500 text-white mt-1" onClick={toggleQuiplash}>
            Chat-Room Lobby
            </RainbowButton>
            </div>
          
          }
          
        
         { isPlayingQuiplash && <QuipLash startTime={start_time}/> }
          { !isPlayingQuiplash &&
          <div className="p-4">
          <div onClick={notTyping} className="card aspect-w-16 aspect-h-9 w-full h-full mx-auto bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden ">
          <div className="p-2">
          <div className="flex justify-center aspect-w-16 aspect-h-9 relative aspect-video ">
          { !isSuccess && <div className='p-15'><VelocityScroll >LOADING GAME</VelocityScroll></div> }
          { isSuccess && 
          <Application 
          resizeTo={appRef}
          width={Math.floor(640)}
          height={Math.floor(360)}
          backgroundColor={' #FFFFFF'}
          resolution={2.5}
         >
          {
            mapPack.layers.map((objLay) => (
              <pixiContainer 
              key= {crypto.randomUUID()} 
              >
            { 
            objLay.tiles.map((objTiles) => ( 
             
                <pixiSprite
                  texture={Assets.get(nightClubTileSet[Math.floor(objTiles.id / 8)][objTiles.id % 8 ])}
                  x={32 * (objTiles.x) * 1.25 }
                  y={32 * (objTiles.y) * 1.25 }
                 scale={ 1.25, 1.25}
                 key= {crypto.randomUUID()}
                />
            ))
            }
            </pixiContainer>
          ))
            }
            {allPlayers.map((player) => (
              
              <pixiContainer 
              x={player.x} 
              y={player.y} 
              key={player.id} 
              scale={ 1.24, 1.24}
              >
                {player.sentMessage && (
                  <pixiGraphics 
                  draw={speechBubble} 
                  key= {crypto.randomUUID()}
                  />
                )}
                {player.sentMessage && (
                  <pixiText
                    text={player.currentMessage}
                    anchor={0.5}
                    x={70}
                    y={-30}
                    key= {crypto.randomUUID()}
                    scale={ 1.1, 1.1}
                    style={styleMessage}
                  />
                )}
                <pixiText
                  text={player.username}
                  anchor={0.5}
                  
                  x={10}
                  y={40}
                  style={ styleUserName }
                  />
                <pixiSprite
              texture={Assets.get(player.username)}
              x={0}
              y={-13}
              scale={scaleFactor, scaleFactor}
              width={25}
              height={25}
              >

              </pixiSprite>
                {isReady && !player.isWalking &&
                 <pixiAnimatedSprite
       textures={textures}
       x={-18.6}
       y={-21}
       ref={(spriteRef) => {
         spriteRef?.play()
       }}
       initialFrame={0}
       animationSpeed={0.1}
       loop={true}
       scale={{ x: scaleFactor, y: scaleFactor }}
  
     /> }
     {isReady && player.isWalking &&
                 <pixiAnimatedSprite
       textures={walkTextures}
       x={-18.6}
       y={-21}
       ref={(spriteRef) => {
         spriteRef?.play()
       }}
       initialFrame={0}
       animationSpeed={0.1}
       loop={true}
       scale={{ x: scaleFactor, y: scaleFactor }}
  
     /> }
                  {/* <pixiContainer>
                <pixiSprite
                  textures={ Assets.get('77') }
                  x={0}
                  y={0}
                  scale={scaleFactor, scaleFactor}
                  width={25}
                  height={25}
                />
              </pixiContainer> */}
              </pixiContainer>
            ))} 
              
          </Application>
            } 
          </div>
          </div>
          </div>
          </div> }
          <div className="flex justify-center mt-2">
        <div onClick={typing}>
          <Label className="flex justify-center  text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-2xl rounded-md"> 
            Send A Chat 
            </Label>
            <div className="flex justify-center">
            <div className="relative">  
          <Textarea 
            className="justify-center items-center  border-orange-500  bg-gray-900 text-yellow-500 rounded-md w-72" 
            type="text"
            placeholder='Be kind to each other...'
            value={message}
            maxlength="150"
            onChange={(e) => setMessage(e.target.value)}
            />
             <BsSend onClick={sendMessage} className="absolute w-5 h-5 bottom-2.5 right-2.5 text-white hover:text-orange-500" />
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="absolute w-5 h-5 top-2.5 right-2.5 text-slate-600"> </svg> */}
      {/* <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z"></path>
     */}
            </div>
            </div>
            <h1 className="flex justify-center items-start mt-2 text-xs text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mr-1.5">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
      </svg>  
      <em> Message Limit: {message.length} / 150</em>
    </h1>  
            {/* <em className="text-white">Allowed Characters</em> */}
        </div>
      </div>
      { !isPlayingQuiplash &&
      <Card className='w-50 block sm:hidden bg-transparent border-transparent'>
      <div className="flex flex-col items-center">
        <Button className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full mt-2 border border-black"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp} name='w'>↑</Button>
          <div className="flex justify-center">
         <Button  className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full border border-black"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp} name='a'>←</Button>
         <Button className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full border border-black"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp} name='s'>↓</Button>
         <Button  className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full border border-black"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp} name='d'>→</Button>
        </div>
        </div>
      </Card>
      }     
       
            
      <Card className="bg-transparent border-transparent flex items-center justify-center">
      <div className="h-[300px] overflow-y-auto">
          <AnimatedList className="w-80 md:w-160 lg:w-300">
            {allMessages.map((msg) => (

              <MsgBox className="w-80 md:w-360 lg:w-565" msg={msg.message} user={msg.username} eventId={eventId} />

            ))}
          </AnimatedList>
        </div>
      </Card> 
      </div>
  );
}

export default Chatroom;
