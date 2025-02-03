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
  Spritesheet, // failing
  AnimatedSprite,
  Rectangle,
} from 'pixi.js';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import MagicCard from '../../../components/ui/magicCard';
import { InteractiveHoverButton } from '../../../components/ui/interactive-hover-button';
import bartender from '../../assets/images/bartender.jpg';
import { UserContext } from '../../contexts/UserContext';




  const socket = io("http://localhost:4000", { // WITH COOKIES
    withCredentials: true,
   });


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


function QuipLash() {

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
    assets: [background],
    isSuccess,
  } = useAssets<Texture>([bartender]);
  
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
  const displayMessage = (msg: string) => {
    // setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  
  // QUIPLASH
  const [color, setColor] = useState('#ffffff');
  const [isPlayingQuiplash, setIsPlayingQuiplash] = useState(false);
 
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
    console.log('the player has quit');
  };

  const readyForQuiplash = () => {
    socket.emit('generatePrompt');
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
    <div
      style={{
        display: 'inline-block',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      <div style={{ width: { gameWidth }, height: { gameHeight } }}>
        <Application>
          <pixiContainer>
            {isSuccess && (
              <pixiSprite
                texture={background}
                x={0}
                y={0}
                width={800}
                height={600}
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
                x={50}
                y={150 + i * 150}
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
              x={300}
              y={100}
            >
            {timer && <pixiText
                    text={`TIME: ${timer}`}
                    anchor={0.5}
                    x={130}
                    y={450}
                    style={style2}
                  />}
                  </pixiContainer>
        </Application>
        {promptGiven && <h6 class="text-white text-[22px]">{quiplashPrompt} </h6>}
        {promptGiven && !answersReceived && (
          <div>
            <Label class="text-white"> Enter Your Quiplash! </Label>
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
              }}
            >
              <InteractiveHoverButton onClick={sendMessage}>
                SUBMIT QUIPLASH
              </InteractiveHoverButton>
            </div>
          </div>
        )}
      </div>
      <div
              style={{
                display: 'inline-block',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
            {!promptGiven && (<div>
      <Button onClick={readyForQuiplash}>READY FOR NEXT QUIPLASH!</Button>
      </div>
    )}
    </div>
    {showWinner && <h1 class="text-white">{winner}</h1>}
    <Button onClick={quitQuiplash}>QUIT</Button>

    </div>
  );
}

export default QuipLash;
