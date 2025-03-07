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
import { BsSend } from 'react-icons/bs';
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
import SOCKET_URL from '../../../../config';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import FlamiliarTutorial from './FlamiliarTutorial';
import BackgroundMusic from './Backgroundmusic';
import clocktick from '../../assets/sounds/chatroom/clocktick.mp3';
import laugh from '../../assets/sounds/chatroom/laugh.mp3';
import votelaugh from '../../assets/sounds/chatroom/votelaugh.mp3';
import winnermusic from '../../assets/sounds/chatroom/winnermusic.mp3';
import menuselect from '../../assets/sounds/chatroom/menuselect.mp3';
import menuswitch from '../../assets/sounds/chatroom/menuswitch.mp3';
import speechbubble from '../../assets/images/speechbubble.png';

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

function Flamiliar({ wantsToPlay, toggleFlamiliar }) {
  const [sizeFactor, setSizeFactor] = useState(1);
  const style = new TextStyle({
    align: 'left',
    fontFamily: 'sans-serif',
    fontSize: 17 * sizeFactor * sizeFactor,
    fontWeight: 'bold',
    fill: '#000000',
    stroke: '#eef1f5',
    letterSpacing: 2 * sizeFactor * sizeFactor,
    wordWrap: true,
    wordWrapWidth: 180 * sizeFactor * sizeFactor,
    breakWords: true,
  });

  useAssets([
    {
      alias: 'bunny',
      src: 'https://pixijs.com/assets/bunny.png',
    },
    {
      alias: 'speech',
      src: speechbubble,
    },
    {
      alias: 'background',
      src: bartender,
    },
  ]);

  const {
    assets: [background],
    isSuccess,
  } = useAssets<Texture>([bartender]);

  const [quit, setQuit] = useState(true);
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
  const [flamiliarPrompt, setFlamiliarPrompt] = useState('');
  const [timer, setTimer] = useState('30');
  const [showButton, setShowButton] = useState(timer === '30' ? true : false);
  const [gameRatio, setGameRatio] = useState(
    window.innerWidth / window.innerHeight
  );
  const [showReady, setShowReady] = useState(true);
  const displayMessage = (msg: string) => {
    // setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  const [scaleFactor, setScaleFactor] = useState(gameRatio > 1.5 ? 0.8 : 1);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  // Flamiliar
  const [color, setColor] = useState('#ffffff');
  const [isPlayingFlamiliar, setIsPlayingFlamiliar] = useState(false);
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
    wordWrapWidth: 170,
    breakWords: true,
  });
  // EXAMPLES

  // WINDOW SIZING
  const handleResize = () => {
    setGameRatio(window.innerWidth / window.innerHeight);
    setGameWidth(window.innerWidth);
    setGameHeight(window.innerHeight);
    setScaleFactor(gameRatio > 1.3 ? 0.75 : 1);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    audioRefs.current = {
      clocktick: new Audio(clocktick),
      laugh: new Audio(laugh),
      votelaugh: new Audio(votelaugh),
      winnermusic: new Audio(winnermusic),
      menuselect: new Audio(menuselect),
      menuswitch: new Audio(menuswitch),
    };
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // SOCKET ACTIVITY & MAP LOAD
  useEffect(() => {
    socket.emit('joinFlamiliar', { user, eventId });
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
        setFlamiliarPrompt(text);
        const audio = audioRefs.current.menuswitch;
        audio.currentTime = 0;
        audio
          .play()
          .catch((error) => console.error('Failed to play sound:', error));
      }
    );

    socket.on('promptGiven', (bool) => {
      setPromptGiven(bool);
    });

    socket.on('showAnswers', (answers) => {
      const audio = audioRefs.current.votelaugh;
      audio.currentTime = 0;
      audio
        .play()
        .catch((error) => console.error('Failed to play sound:', error));
      setAnswersReceived(true);
      setPlayerAnswers(answers);
    });

    socket.on('showWinner', ({ winner, falsyBool, truthyBool }) => {
      const audio = audioRefs.current.winnermusic;
      audio.currentTime = 0;
      audio
        .play()
        .catch((error) => console.error('Failed to play sound:', error));
      if (winner[0] === '') {
        winner[0] = 'No Winner :c';
        winner[1] = '';
      }
      setAnswersReceived(falsyBool);
      setShowWinner(truthyBool);
      setWinner(winner);
      setTimeout(() => {
        setShowWinner(falsyBool);
        setShowReady(true);
      }, 5000);
    });

    socket.on('countDown', (time) => {
      if (time >= 11) {
        setColor('#55ff00');
      } else if (time >= 5) {
        setColor('#f7f720');
      }
      if (time < 5) {
        const audio = audioRefs.current.clocktick;
        audio.currentTime = 0;
        audio
          .play()
          .catch((error) => console.error('Failed to play sound:', error));
        setColor('#cf060a');
      }
      setTimer(time.toString());
    });

    return () => {
      // Remove listeners on unmount if necessary
      socket.off('promptGiven')
      socket.off('receivePrompt');
      socket.off('showAnswers');
      socket.off('showWinner');
      socket.off('countDown');
    };
  }, []);

  const typing = async () => {
    await setIsTyping(!isTyping);
  };

  const quitFlamiliar = () => {
    socket.emit('quitFlamiliar');
    setQuit(true);
    toggleFlamiliar();
  };
  const toggleQuit = () => {
    setQuit(false);
  };
  const readyForFlamiliar = () => {
    socket.emit('generatePrompt');
    setShowReady(false);
  };
  const sendMessage = () => {
    const audio = audioRefs.current.menuswitch;
    audio.currentTime = 0;
    audio
      .play()
      .catch((error) => console.error('Failed to play sound:', error));
    socket.emit('FlamiliarMessage', {
      message: message,
      eventId: eventId,
      user,
    });
    setMessage('');
  };

  const test = (e) => {
    if (e === user.username) {
      let audio = new Audio(laugh);
      audio.play();
    } else {
      let audio = new Audio(menuselect);
      audio.play();
      socket.emit('vote', e);
    }
  };

  const enlargePrompt = () => {
    let audio = new Audio(menuselect);

    if (sizeFactor === 1) {
      setSizeFactor(1.3);
      audio.play();
    } else {
      setSizeFactor(1);
      audio.play();
    }
  };
  return (
    <div>
      {quit && (
   <FlamiliarTutorial toggleQuit={toggleQuit}/>
      )}
      {!quit && (
        <div className="flex justify-center ">
          {' '}
          <Button
            className="bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-grey-700 mt-2"
            onClick={quitFlamiliar}
          >
            QUIT
          </Button>{' '}
        </div>
      )}
      {!quit && (
        <div className="p-4">
          <div className="card aspect-w-16 aspect-h-9 w-full h-full mx-auto bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden ">
            <div className="p-2">
              {!isSuccess && (
                <div className="p-15">
                  <VelocityScroll>LOADING GAME</VelocityScroll>
                </div>
              )}
              {isSuccess && (
                <div className="flex justify-center aspect-w-16 aspect-h-9 relative aspect-video bg-transparent">
                  <Application
                    resizeTo={appRef}
                    width={Math.floor(640)}
                    height={Math.floor(360)}
                    backgroundColor={' #FFFFFF'}
                    scale={(0.9, 0.9)}
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
                      {promptGiven && !answersReceived && !quit && (
                        <pixiContainer
                          eventMode="static"
                          onPointerDown={() => {
                            enlargePrompt();
                          }}
                          scale={(0.7, 0.7)}
                          x={350}
                          y={30}
                        >
                          <pixiSprite
                            texture={Assets.get('speech')}
                            height={210 * (sizeFactor * sizeFactor)}
                            width={220 * (sizeFactor * sizeFactor)}
                            x={20}
                            y={-15}
                          ></pixiSprite>
                          <pixiText
                            text={flamiliarPrompt}
                            anchor={0.5}
                            x={120 * sizeFactor * sizeFactor}
                            y={80 * sizeFactor * sizeFactor}
                            style={style}
                          />
                        </pixiContainer>
                      )}
                    </pixiContainer>
                    {answersReceived &&
                      Object.entries(playerAnswers).map((tupleAnswer, i) => (
                        <pixiContainer
                          eventMode="static"
                          onPointerDown={() => {
                            test(tupleAnswer[0]);
                          }}
                          scale={(0.7, 0.7)}
                          x={35}
                          y={30 + i * 150}
                          key={useId}
                        >
                          <pixiSprite
                            texture={Assets.get('speech')}
                            height={180}
                            width={200}
                          ></pixiSprite>
                          <pixiText
                            text={`${tupleAnswer[1]} \n - ${tupleAnswer[0]}`}
                            anchor={0.5}
                            x={100}
                            y={60}
                            style={style}
                          />
                        </pixiContainer>
                      ))}
                    <pixiContainer x={0} y={0}>
                      {timer && (
                        <pixiText
                          text={`TIME: ${timer}`}
                          anchor={0.5}
                          x={350}
                          y={330}
                          style={style2}
                        />
                      )}
                    </pixiContainer>
                  </Application>
                  <BackgroundMusic />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {promptGiven && !answersReceived && !quit && (
        <div className="flex justify-center">
          <div className="justify-center items-center">
            <Label className="text-white"> Enter A Fun Response! </Label>
          </div>
          <div className="relative">
            <Input
              className="bg-white"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <BsSend
              onClick={sendMessage}
              className="absolute w-5 h-5 bottom-1.5 right-2.5 text-black hover:text-orange-500"
            />
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
        {(!promptGiven && !quit && showReady && timer === '30' && (
          <div>
            <Button
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700"
              onClick={readyForFlamiliar}
            >
              GET FLAMILIAR!
            </Button>
          </div>
        )) ||
          (!quit && <h6 className="text-white">Game In Progress...</h6>)}
      </div>
      {showWinner && (
        <VelocityScroll className="text-white">{winner}</VelocityScroll>
      )}
    </div>
  );
}

export default Flamiliar;
