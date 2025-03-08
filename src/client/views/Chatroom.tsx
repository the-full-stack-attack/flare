import React, {
  useEffect,
  useState,
  useContext,
  lazy,
  Suspense,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Label } from '../../components/ui/label';
import { AnimatedList } from '../../components/ui/animated-list';
import { Button } from '../../components/ui/button';
import { RainbowButton } from '../../components/ui/rainbowbutton';
import { Textarea } from '../../components/ui/textarea';
import { Card } from '../../components/ui/card';
import { UserContext } from '../contexts/UserContext';
import { Countdown } from '../components/chatroom/countdown';
const Flamiliar = lazy(() => import('../components/chatroom/Flamiliar'));
const MsgBox = lazy(() => import('../components/chatroom/MsgBox'));
const DJam = lazy(() => import('../components/chatroom/DJam'));
const Menu = lazy(() => import('../components/chatroom/Menu'));
const MainChat = lazy(() => import('../components/chatroom/MainChat'));
import loading from '../assets/chatroom/loading.gif';
import { FaShip } from 'react-icons/fa';
import axios from 'axios';

import { ChatroomContext, ToggleDJContext } from '../contexts/ChatroomContext';
import { SocketContext } from '../contexts/SocketContext';

function Chatroom() {
  console.log('chatroom rendered');
  const socket = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const start_time = location.state;

  const [avatarTextures, setAvatarTextures] = useState<
    { alias: any; src: any }[]
  >([]);
  const [lobby, setLobby] = useState([user]);
  // LOGIC

  const [eventId, setEventId] = useState(document.location.pathname.slice(10));
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  const [isPlayingFlamiliar, setIsPlayingFlamiliar] = useState(false);
  const [isPlayingDJ, setIsPlayingDJ] = useState(false);
  const [isPlayingGames, setIsPlayingGames] = useState(false);
  const displayMessage = (msg: any) => {
    setAllMessages((prevMessages) => [...prevMessages, msg]);
  };
  const [onKeyboard, setOnKeyboard] = useState<boolean>(false);
  // Flamiliar
  const toggleGames = () => {
    isPlayingGames ? setIsPlayingGames(false) : setIsPlayingGames(true);
  };
  const toggleDJ = () => {
    isPlayingDJ ? setIsPlayingDJ(false) : setIsPlayingDJ(true);
  };
  const toggleFlamiliar = () => {
    isPlayingFlamiliar
      ? setIsPlayingFlamiliar(false)
      : setIsPlayingFlamiliar(true);
  };

  // CONTROLS
  const keyPress = ({ key }: any) => {
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
      if (key === 'q' || key === 'Q') {
        socket.emit('keyPress', { inputId: 'Snap', state: true });
      }
      if (key === 'e' || key === 'E') {
        socket.emit('keyPress', { inputId: 'Wave', state: true });
      }
      if (key === 'r' || key === 'R') {
        socket.emit('keyPress', { inputId: 'EnergyWave', state: true });
      }
      if (key === 'f' || key === 'F') {
        socket.emit('keyPress', { inputId: 'Heart', state: true });
      }
      if (key === '2' || key === '2') {
        socket.emit('keyPress', { inputId: '420', state: true });
      }
      if (key === '3' || key === '3') {
        socket.emit('keyPress', { inputId: 'Shades', state: true });
      }
      if (key === '4' || key === '4') {
        socket.emit('keyPress', { inputId: 'Beer', state: true });
      }
      if (key === '`' || key === '`') {
        socket.emit('keyPress', { inputId: 'Sad', state: true });
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
    if (key === 'q' || key === 'Q') {
      socket.emit('keyPress', { inputId: 'Snap', state: false });
    }
    if (key === 'e' || key === 'E') {
      socket.emit('keyPress', { inputId: 'Wave', state: false });
    }
    if (key === 'r' || key === 'R') {
      socket.emit('keyPress', { inputId: 'EnergyWave', state: false });
    }
    if (key === 'f' || key === 'F') {
      socket.emit('keyPress', { inputId: 'Heart', state: false });
    }
    if (key === '`' || key === '`') {
      socket.emit('keyPress', { inputId: 'Sad', state: false });
    }
  };

  // SOCKET ACTIVITY & MAP LOAD
  useEffect(() => {
    console.log('new player list retriggers');
    socket.on('newPlayerList', ({ PLAYER_LIST }) => {
      console.log(PLAYER_LIST);
      console.log(lobby);
      for (let player in PLAYER_LIST) {
        if (!lobby.includes(PLAYER_LIST[player].username)) {
          setLobby((prevItems) => [...prevItems, PLAYER_LIST[player].username]);
          setAvatarTextures((prevItems) => [
            ...prevItems,
            {
              alias: PLAYER_LIST[player].username,
              src: PLAYER_LIST[player].avatar,
            },
          ]);
        }
      }
    });

    return () => {
      socket.off('newPlayerList');
    };
  }, [avatarTextures]);
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

  const typing = async () => {
    await setIsTyping(true);
  };

  useEffect(() => {}, [setOnKeyboard]);

  const notTyping = async () => {
    await setIsTyping(false);
  };
  const sendMessage = () => {
    socket.emit('message', { message, eventId });
    displayMessage({
      message: message,
      username: user?.username,
      avatar: user?.avatar_uri,
    });
    setMessage('');
  };

  useEffect(() => {
    console.log('message retriggers');
    socket.emit('joinChat', { user, eventId });
    axios.get(`api/chatroom/${eventId}`).catch((err) => console.error(err));
    socket.on('message', (msg) => {
      displayMessage(msg);
    });

    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, [socket]);

  const chatSetOnKeyboard = (val) => {
    setOnKeyboard(val);
  };

  const handlePointerDown = (e) => {
    keyPress({ key: e.target.name });
  };

  const handlePointerUp = (e) => {
    keyUp({ key: e.target.name }); 
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden">
      <div
        className={`${isPlayingGames ? 'invisible' : ''} flex justify-center mt-24`}
      >
        <Countdown endTime={dayjs(start_time)} />
      </div>
      {(!isPlayingGames && (
        <div className="flex justify-center">
          <RainbowButton
            className="bg-gradient-to-r from-cyan-500 via-grey-100 to-blue-500 text-white mt-2"
            onClick={toggleGames}
          >
            Ice-Breaker Games
          </RainbowButton>
        </div>
      )) || (
        <div className="flex justify-center">
          <RainbowButton
            className="bg-gradient-to-r from-cyan-500 via-grey-100 to-blue-500 text-white mt-1"
            onClick={toggleGames}
          >
            Chat-Room Lobby
          </RainbowButton>
        </div>
      )}
      <div className="lg:grid grid-flow-row-dense lg:grid-cols-3 gap-2">
        {isPlayingGames && !isPlayingFlamiliar && !isPlayingDJ && (
          <div className="col-span-2">
            <Suspense
              fallback={
                <div className="flex justify-center align-center">
                  <img id="loading-image" src={loading} alt="Loading..."></img>
                </div>
              }
            >
              <Menu toggleDJ={toggleDJ} toggleFlamiliar={toggleFlamiliar} />
            </Suspense>
          </div>
        )}
        {isPlayingFlamiliar && isPlayingGames && (
          <div className=" col-span-2">
            <div>
              <Suspense
                fallback={
                  <div className="flex justify-center align-center">
                    <img
                      id="loading-image"
                      src={loading}
                      alt="Loading..."
                    ></img>
                  </div>
                }
              >
                <ChatroomContext.Provider value={eventId}>
                  <Flamiliar
                    toggleFlamiliar={toggleFlamiliar}
                    socket={socket}
                  />
                </ChatroomContext.Provider>
              </Suspense>
            </div>
          </div>
        )}

        {isPlayingDJ && isPlayingGames && (
          <div className="col-span-2">
            <Suspense
              fallback={
                <div className="flex justify-center align-center">
                  <img id="loading-image" src={loading} alt="Loading..."></img>
                </div>
              }
            >
              <div>
                <div className="flex justify-center"></div>
                <ToggleDJContext.Provider value={toggleDJ}>
                  <ChatroomContext.Provider value={eventId}>
                    <DJam />
                  </ChatroomContext.Provider>
                </ToggleDJContext.Provider>
              </div>
            </Suspense>
          </div>
        )}
        {!isPlayingGames && (
          <div className=" col-span-2 p-4">
            <div
              onClick={notTyping}
              className="card aspect-w-16 aspect-h-9 max-w-6xl bg-black border border-black rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden "
            >
              <div className="p-2">
                <div className="flex justify-center aspect-w-16 aspect-h-9 relative aspect-video align-center ">
                  <Suspense
                    fallback={
                      <div className="flex justify-center align-center">
                        <img
                          id="loading-image"
                          src={loading}
                          alt="Loading..."
                        ></img>
                      </div>
                    }
                  >
                    <ChatroomContext.Provider value={eventId}>
                      <MainChat
                        onKeyboard={onKeyboard}
                        chatSetOnKeyboard={chatSetOnKeyboard}
                        avatarTextures={avatarTextures}
                      />
                    </ChatroomContext.Provider>
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isPlayingGames && (
          <Card className="w-50 block sm:hidden bg-transparent border-transparent">
            <div className="flex flex-col items-center">
              <Button
                className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full mt-2 border border-black"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                name="w"
              >
                ↑
              </Button>
              <div className="flex justify-center">
                <Button
                  className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full border border-black"
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  name="a"
                >
                  ←
                </Button>
                <Button
                  className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full border border-black"
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  name="s"
                >
                  ↓
                </Button>
                <Button
                  className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-black font-bold text-lg rounded-full border border-black"
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  name="d"
                >
                  →
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div>
          <div className="block mt-2 p-4 h-96">
            <Card className="bg-transparent border-transparent">
              <div onClick={typing}>
                <Card className="bg-gray-900 border-fuchsia-200 flex items-center justify-center">
                  {/* Message Box Container with Responsive Height */}
                  <div className="h-[15vh] md: h-[24] lg:h-[50vh] w-full max-w-7xl overflow-y-auto">
                    <AnimatedList>
                      {allMessages.map((msg) => (
                        <Suspense
                          fallback={
                            <div className="flex justify-center align-center">
                              <img
                                id="loading-image"
                                src={loading}
                                alt="Loading..."
                              ></img>
                            </div>
                          }
                        >
                          <MsgBox
                            className="w-80 md:w-360 lg:w-565 "
                            msg={msg.message}
                            user={msg.username}
                            eventId={eventId}
                            avatar={msg.avatar}
                          />
                        </Suspense>
                      ))}
                    </AnimatedList>
                  </div>
                </Card>

                {/* Label */}
                <Label className="flex justify-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-2xl rounded-md">
                  Send A Chat
                </Label>

                {/* Textarea Input */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Textarea
                      className="justify-center items-center border-fuchsia-200 bg-gray-900 text-yellow-500 rounded-md w-72"
                      type="text"
                      placeholder="Be kind to each other..."
                      value={message}
                      maxLength="150"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <FaShip
                      onClick={sendMessage}
                      className="absolute w-5 h-5 bottom-2.5 right-2.5 text-white hover:text-fuchsia-500"
                    />
                  </div>
                </div>

                {/* Message Limit Display */}
                <h1 className="flex justify-center items-start mt-2 text-xs text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 mr-1.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <em>Message Limit: {message.length} / 150</em>
                </h1>
              </div>
            </Card>
          </div>
        </div>
        {onKeyboard && !isPlayingGames && (
          <Suspense
            fallback={
              <div className="flex justify-center align-center">
                <img id="loading-image" src={loading} alt="Loading..."></img>
              </div>
            }
          >
            <div className="hidden lg:block col-span-3">
              <ToggleDJContext.Provider value={toggleDJ}>
                <ChatroomContext.Provider value={eventId}>
                  <DJam />
                </ChatroomContext.Provider>
              </ToggleDJContext.Provider>
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default Chatroom;
