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
import SOCKET_URL from '../../../../config'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import Tutorial_1 from '../../assets/images/Tutorial_1.png'
import Tutorial_2 from '../../assets/images/Tutorial_2.png'
import Tutorial_3 from '../../assets/images/Tutorial_3.png'
import BackgroundMusic from './Backgroundmusic';
import clocktick from '../../assets/sounds/chatroom/clocktick.mp3';
import laugh from '../../assets/sounds/chatroom/laugh.mp3';
import votelaugh from '../../assets/sounds/chatroom/votelaugh.mp3';
import winnermusic from '../../assets/sounds/chatroom/winnermusic.mp3';
import menuselect from '../../assets/sounds/chatroom/menuselect.mp3';
import menuswitch from '../../assets/sounds/chatroom/menuswitch.mp3';



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



function QuipLash({wantsToPlay}) {
  const [sizeFactor, setSizeFactor] = useState(1);
  const style = new TextStyle({
    align: 'left',
    fontFamily: 'sans-serif',
    fontSize: 17 * sizeFactor,
    fontWeight: 'bold',
    fill: '#000000',
    stroke: '#eef1f5',
    letterSpacing: 2 * sizeFactor,
    wordWrap: true,
    wordWrapWidth: 150,
    breakWords: true,
  });

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
  const [showReady, setShowReady] = useState(true);
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
    // if(sizeFactor )
    graphics?.texture(Assets.get('speech'), 0xffffff, 10, 0, 270);
    graphics?.scale.set(1 * sizeFactor, 0.7 * sizeFactor);
    graphics.cursor = 'pointer';
    graphics.label = 'HELLO';
  }, [sizeFactor]);

  function onTouchstart(param, e) {
    // console.log(e);
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
    // console.log(user, 'quiplash user');
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
        // console.log('next question has arrived!');
        // console.log(text);
        setQuiplashPrompt(text);
        let audio = new Audio(menuswitch);
        audio.play();
      }
    );


    socket.on('promptGiven', (bool) => {
      setPromptGiven(bool);
   
    });

    socket.on('showAnswers', (answers) => {
      // console.log(answers, 'the answers were received by client');
       const audio = new Audio(votelaugh);
          audio.play();
      setAnswersReceived(true);
      setPlayerAnswers(answers);
    });

    socket.on('showWinner', ({ winner, falsyBool, truthyBool }) => {
      // console.log(winner);
      let audio = new Audio(winnermusic);
      audio.play();
      if(winner[0] === ''){
        winner[0] = 'No Winner :c'
        winner[1] = ''

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
      // console.log('countdownrunning')
      console.log(time);
      if(time >= 11 ){
        setColor('#55ff00');
      } else if(time >= 5){
        setColor('#f7f720');
      }
      if(time < 5){
        let audio = new Audio(clocktick);
        audio.play();
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
    // console.log(message);
    let audio = new Audio(menuswitch);
        audio.play();
    socket.emit('quiplashMessage', { message, eventId, user });
    
    setMessage('');
  };

  const test = (e) => {
    // console.log('test is passing for onclick', e);
    if(e === user.username){
      // console.log('you cannot vote for yourself!');
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
    
    if(sizeFactor === 1){
    setSizeFactor(1.3);
    audio.play();
    } else {
      setSizeFactor(1);
      audio.play();
    }
  }
  return (
   
    <div>
      { quit && 
      <div>
      <div className="flex justify-center items-center mt-2" >
        <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700" onClick={toggleQuit}>
          Get Flamiliar!
          </Button>
          </div>
          <div className="flex flex-col gap-2 items-center">
          <h1 className="text-white font-bold">TUTORIAL</h1>
          <div>
          <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md">
  <CarouselContent>
    <CarouselItem className="">
    <Card className="bg-slate-950 md:h-full">
      <CardTitle className="flex justify-center text-orange-500 font-bold text-4xl p-4">Step 1</CardTitle>
      <CardContent className="flex justify-center"><img  className="flex justify-center" src={Tutorial_1}></img></CardContent>
        <CardDescription className="flex justify-center font-semibold text-orange-500 text-3xl p-6">When Ready, Click "Get Flamiliar!"</CardDescription>
        <CardFooter className="text-xs font-light text-gray-200 flex justify-center"><em>Clicking 'get flamiliar' at the bottom of the screen prompts the A.I. to generate a prompt based on our alagorithm!</em></CardFooter>
    </Card>
    </CarouselItem>
    <CarouselItem className="">
    <Card className="bg-slate-950 md:h-full">
      <CardTitle className="flex justify-center text-orange-500 font-bold text-4xl p-4">Step 2</CardTitle>
      <CardContent  className="flex justify-center"><img  src={Tutorial_2}></img></CardContent>
        <CardDescription className="flex justify-center font-semibold text-orange-500 text-3xl p-6">Be Funny!</CardDescription>
        <CardFooter className="text-xs font-light text-gray-200 flex justify-center"><em>The A.I. bartender will give you an unfinished sentence. Find a way to complete the sentence... oh, and be funny!</em></CardFooter>
    </Card>
    </CarouselItem>
    <CarouselItem className="">
    <Card className="bg-slate-950 md:h-full">
      <CardTitle className="flex justify-center text-orange-500 font-bold text-4xl p-4">Step 3</CardTitle>
      <CardContent className="flex justify-center"><img  className="flex justify-center" src={Tutorial_3}></img></CardContent>
        <CardDescription className="flex justify-center font-semibold text-orange-500 text-3xl p-6">Vote!</CardDescription>
        <CardFooter className="text-xs font-light text-gray-200 flex justify-center"><em>Vote for the player who has the funniest response... You can only vote ONCE! P.S. You CANNOT vote for yourself you Narcissist!!</em></CardFooter>
    </Card>
    </CarouselItem>

    <CarouselItem className="">
    <Card className="bg-slate-950 h-full flex flex-col justify-center">
        <CardDescription className="flex justify-center font-semibold text-orange-500 items-center p-6">With the power invested in me, I now pronounce you READY to GET FLAMILIAR!</CardDescription>
        <CardFooter className="text-xs font-light text-gray-200 flex justify-center"><em>Click Get Flamiliar to start the game</em></CardFooter>
        <div className="flex justify-center items-center mt-2" >
        <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700" onClick={toggleQuit}>
          Get Flamiliar!
          </Button>
          </div>
    </Card>
    </CarouselItem>
    </CarouselContent>
      <CarouselPrevious className="bg-yellow-500"/>
      <CarouselNext className="bg-yellow-500"/>
    </Carousel>
</div>
          </div>
          </div> } 
      {!quit && <div className="flex justify-center " > <Button className="bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-grey-700" onClick={quitQuiplash}>QUIT</Button> </div>}
      { !quit &&
    <div className="p-4">
    <div className="card aspect-w-16 aspect-h-9 w-full h-full mx-auto bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden ">
    <div className="p-2">
    { !isSuccess && <div className='p-15'><VelocityScroll >LOADING GAME</VelocityScroll></div> }
    { isSuccess && 
    <div className="flex justify-center aspect-w-16 aspect-h-9 relative aspect-video bg-transparent">
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
             {promptGiven && !answersReceived && !quit && (
                 <pixiContainer
                 eventMode="static"
                onPointerDown={() => {
                  enlargePrompt();
                }}
                scale={0.7, 0.7}
                x={350}
                y={30}
              
              >
                <pixiGraphics draw={speechBubble}>
                  <pixiText
                    text={quiplashPrompt}
                    anchor={0.5}
                    x={120}
                    y={100}
                    style={style}
                  />
                </pixiGraphics>
              </pixiContainer>)
                  }
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
        <BackgroundMusic/>
        </div>        
          }
        </div>  
        </div>
        </div> }
        
        {promptGiven && !answersReceived && !quit && (
          <div
          className="flex justify-center">
              <div
                className="justify-center items-center"
              >
            <Label className="text-white"> Enter A Fun Response! </Label>
              </div>
            <div className="relative">
            <Input
              className="bg-white" 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
             <BsSend onClick={sendMessage} className="absolute w-5 h-5 bottom-1.5 right-2.5 text-black hover:text-orange-500" />
             
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
            {!promptGiven && !quit && showReady && (<div >
      <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700" onClick={readyForQuiplash}>GET FLAMILIAR!</Button>
      </div>
    )}
    </div>
    
    {showWinner && <VelocityScroll className="text-white">{winner}</VelocityScroll>}
  
    </div>
  );
}

export default QuipLash;
