import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  ref,
  useId,
} from 'react';
import io from 'socket.io-client';

import { Application, extend, useAssets } from '@pixi/react';
import '@pixi/events';
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
  Rectangle,
} from 'pixi.js';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { VelocityScroll } from '../../../components/ui/scroll-based-velocity';
import { Button } from '../../../components/ui/button';
import MagicCard from '../../../components/ui/magicCard';
import { InteractiveHoverButton } from '../../../components/ui/interactive-hover-button';
import bartender from '../../assets/images/chatImages/bartender.jpg';
import { UserContext } from '../../contexts/UserContext';
import SOCKET_URL from '../../../../config'



let socket = io(SOCKET_URL);


extend({
  Container,
  Graphics,
  Sprite,
  Texture,
  NineSliceSprite,
  Text,
  TextStyle,
  AnimatedSprite,
});

const style = new TextStyle({
  align: 'left',
  fontFamily: 'sans-serif',
  fontSize: 17,
  fontWeight: 'bold',
  fill: '#000000',
  stroke: '#eef1f5',
  letterSpacing: 2,
  wordWrap: true,
  wordWrapWidth: 150,
  breakWords: true,
});


function QuipLash({wantsToPlay}) {

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
      alias: 'background',
      src:  bartender
    },
    
  ]);

  const {
    assets: [background],
    isSuccess,
  } = useAssets<Texture>([bartender]);
  
  const [quit, setQuit] = useState(true)
  // LOGIC
  const { user } = useContext(UserContext);
  const [allPlayers, setAllPlayers] = useState([]);
  const [eventId, setEventId] = useState(document.location.pathname.slice(10));
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [gameWidth, setGameWidth] = useState(window.innerWidth);
  const [gameHeight, setGameHeight] = useState(window.innerHeight);
  const [promptGiven, setPromptGiven] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState(false);
  const [answersReceived, setAnswersReceived] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState('');
  const uniqueId = useId;
  const [quiplashPrompt, setQuiplashPrompt] = useState('');
  const [timer, setTimer] = useState('30');
  const [gameRatio, setGameRatio] = useState(window.innerWidth / window.innerHeight)
  const [showReady, setShowReadyy] = useState(true);
  const displayMessage = (msg: string) => {
    // setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  const [scaleFactor, setScaleFactor] = useState((gameRatio > 1.5) ? 0.8 : 1)
  // QUIPLASH
  const [color, setColor] = useState('#ffffff');
  const [isPlayingQuiplash, setIsPlayingQuiplash] = useState(false);
  const appRef = useRef(null);
  const style2 = new TextStyle({
    align: 'left',
    fontFamily: '\"Trebuchet MS\", Helvetica, sans-serif',
    fontSize: 30,
    fontWeight: 'bold',
    fill: color,
    stroke: '#000000',
    strokeThickness: 10,
    lineJoin: 'round',
    letterSpacing: 4,
    wordWrap: true,
    wordWrapWidth: 150,
    breakWords: true,
  });
  // EXAMPLES
  const speechBubble = useCallback((graphics: unknown, element) => {
    graphics?.texture(Assets.get('speech'), 0xffffff, 10, 0, 270);
    graphics?.scale.set(1, 0.7);
    graphics.cursor = 'pointer';
    graphics.label = 'HELLO';
  }, []);

  function onTouchstart(param, e) {
    console.log(e);
  }

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



  // SOCKET ACTIVITY & MAP LOAD
  useEffect(() => {
    console.log(user, 'quiplash user');
    socket.emit('joinQuiplash', { user, eventId });
    socket.on(
      'receivePrompt',
      ({
        response: {
          candidates: [
            {
              content: {
                parts: [{ text }],
              },
            },
          ],
        },
      }) => {
        console.log('next question has arrived!');
        console.log(text);
        setQuiplashPrompt(text);
      }
    );

    socket.on('promptGiven', (bool) => {
      setPromptGiven(bool);
    });

    socket.on('showAnswers', (answers) => {
      console.log(answers, 'the answers were received by client');
      setAnswersReceived(true);
      setPlayerAnswers(answers);
    });

    socket.on('showWinner', ({ winner, falsyBool, truthyBool }) => {
      console.log(winner);
      setAnswersReceived(falsyBool);
      setShowWinner(truthyBool);
      setWinner(winner);
      setTimeout(() => {
        setShowWinner(falsyBool);
        setShowReady(true);
      }, 5000);
    });

    socket.on('countDown', (time) => {
      console.log('countdownrunning')
      console.log(time);
      if(time >= 11 ){
        setColor('#55ff00');
      } else if(time >= 5){
        setColor('#f7f720');
      }
      if(time < 5){
        setColor('#cf060a');
      }
      setTimer((time).toString())
    })
  }, []);

  const typing = async () => {
    await setIsTyping(!isTyping);
  };

  const quitQuiplash = () => {
    socket.emit('quitQuiplash');
    setQuit(true);
    console.log('the player has quit');
  };
  const toggleQuit = () => {
    setQuit(false);
  }
  const readyForQuiplash = () => {
    socket.emit('generatePrompt');
    setShowReady(false);
  };
  const sendMessage = () => {
    console.log(message);
    socket.emit('quiplashMessage', { message, eventId, user });
    setMessage('');
  };

  const test = (e) => {
    console.log('test is passing for onclick', e);
    if(e === user.username){
      console.log('you cannot vote for yourself!');
    } else {
    socket.emit('vote', e);
    }
  };
  return (
   
    <div>
      { quit && <div className="flex justify-center" ><Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700" onClick={toggleQuit}>Play Quiplash</Button></div> } }
      {!quit && <div className="flex justify-center " > <Button className="bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-grey-700" onClick={quitQuiplash}>QUIT</Button> </div>}
      { !quit &&
    <div className="p-4">
    <div className="card aspect-w-16 aspect-h-9 w-full h-full mx-auto bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden ">
    <div className="p-2">
    <div className="flex justify-center aspect-w-16 aspect-h-9 relative aspect-video bg-transparent">
    { !isSuccess && <div className='p-15'><VelocityScroll >LOADING GAME</VelocityScroll></div> }
    { isSuccess && 
    <Application 
    resizeTo={appRef}
    width={Math.floor(640)}
    height={Math.floor(360)}
    backgroundColor={' #FFFFFF'}
    scale={0.9, 0.9}
   >
          <pixiContainer>
            {isSuccess && (
              <pixiSprite
                texture={background}
                width={Math.floor(640)}
    height={Math.floor(360)}
                x={0}
                y={0}
              />
            )}
          </pixiContainer>
          {answersReceived && 
            Object.entries(playerAnswers).map((tupleAnswer, i) => (
              <pixiContainer
                eventMode="static"
                onPointerDown={() => {
                  test(tupleAnswer[0]);
                }}
                scale={0.7, 0.7}
                x={35}
                y={30 + i * 150}
                key={ useId }
              >
                <pixiGraphics draw={speechBubble}>
                  <pixiText
                    text={`${tupleAnswer[1]} \n - ${tupleAnswer[0]}`}
                    anchor={0.5}
                    x={120}
                    y={100}
                    style={style}
                  />
                </pixiGraphics>
              </pixiContainer>
            ))}
            <pixiContainer
              x={0}
              y={0}
            >
            {timer && <pixiText
                    text={`TIME: ${timer}`}
                    anchor={0.5}
                    x={350}
                    y={330}
                    style={style2}
                  />}
                  </pixiContainer>
        </Application>
}
        </div>        
        </div>  
        </div>
        </div> }
        {promptGiven && !quit && <h6 className="text-white text-[22px]">{quiplashPrompt} </h6>}
        {promptGiven && !answersReceived && !quit && (
          <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '11px',
          }}>
            <Label className="text-white"> Enter Your Quiplash! </Label>
            <Input
              className="bg-white" 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <InteractiveHoverButton onClick={sendMessage}>
                SUBMIT QUIPLASH
              </InteractiveHoverButton>
            </div>
          </div>
        )}


 
      <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
            {!promptGiven && !quit && (<div >
      <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700" onClick={readyForQuiplash}>READY FOR NEXT QUIPLASH!</Button>
      </div>
    )}
    </div>
    
    {showWinner && <h1 className="text-white">{winner}</h1>}
  
    </div>
  );
}

export default QuipLash;
