import { Server, Socket } from 'socket.io';
import { Player, QuipLashPlayer } from '../client/assets/chatroom/chatAssets';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Console } from 'console';
import dotenv from 'dotenv';
const googleGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const bartenderAI = googleGenAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const modifiers = [
  'Meditation',
  'Philosophy',
  'Relationships',
  'Cheating',
  'risky behavior',
  'war',
  'furries',
  'fighting',
  'social anxiety',
  'income inequality',
  'rehab',
  'drinking alcohol',
  'javascript',
  'artificial intelligence',
  'Arts & Crafts',
  'Music',
  'Gaming',
  'Movies & TV',
  'Comics & Anime',
  'Books & Reading',
  'Technology',
  'Nature',
  'Food & Cooking',
  'Nightlife',
  'Coffee & Tea',
  'Health & Wellness',
  'Pets & Animals',
  'Sports & Recreation',
  'Community Events',
  'social media',
  'working in an office',
  'popular culture',
]
const initializeSocket = (
  server: any,
  PLAYER_LIST: any,
  SOCKET_LIST: any,
  QUIPLASH_LIST: any,
  QUIPLASH_GAMES: any,
) => {
  const io = new Server(server);
  // Register event listeners for Socket.IO
  io.on('connection', (socket) => {
    // when client joins chat, create a player, add them to the lists
    socket.on('joinChat', ({ user, eventId }) => {
      console.log(typeof eventId, eventId)
      socket.data.name = socket.id;
      socket.data.eventId = eventId;
      socket.join(eventId);
      const stringName = socket.data.name;
      SOCKET_LIST[stringName] = socket;
      const player = Player(socket.id, user, eventId);
      PLAYER_LIST[socket.id] = player;
    });

    // QUIPLASH SOCKETS
    socket.on('joinQuiplash', ({ user, eventId }) => {
      console.log(user, 'quipl');
      console.log(eventId, 'quipl');
      console.log(PLAYER_LIST);
      console.log(socket.id);
      socket.data.eventId = eventId;
      const quiplashPlayer = QuipLashPlayer(socket.id, user, eventId);
      QUIPLASH_LIST[socket.id] = quiplashPlayer;
      console.log(QUIPLASH_LIST);

       // if no game currently exists for the current room
       if(QUIPLASH_GAMES[eventId] === undefined){
        console.log(`no games exist for room ${eventId} yet, creating a room`);
        // create a game on the quiplash game object
        QUIPLASH_GAMES[eventId] = {
          players: [],
          votes: [],
          playerCount: 0,
        };
        // if a game already exists, let server know we succeeded test #1
      } else {
        console.log(`a game for room ${eventId} already exists, adding player`);
      }

      // A game should already exist at this point regardless of whether or not it did before

      // add the player to the array of players
      QUIPLASH_GAMES[eventId].players.push(quiplashPlayer);
      // increase the current player count from zero to 1
      QUIPLASH_GAMES[eventId].playerCount += 1;
      console.log(QUIPLASH_LIST, 'quiplash list');
      console.log(QUIPLASH_GAMES, 'ONGOING QUIPLASH GAMES')

    });

    // if a player quits quiplash
    socket.on('quitQuiplash', () => {
      // remove their socket from the room
      socket.leave(socket.data.eventId);
      // delete that player from the list of players by socket
      delete QUIPLASH_LIST[socket.id]
      // decrease the current player count for that game based on their current eventId
      QUIPLASH_GAMES[socket.data.eventId].playerCount -= 1;
      // if there are no more players playing that game, delete the quiplash game from the list of games
      if(QUIPLASH_GAMES[socket.data.eventId].playerCount <= 0){
      delete QUIPLASH_GAMES[socket.data.eventId]
      }
      console.log(QUIPLASH_LIST, 'list quip');
      console.log(QUIPLASH_GAMES, 'remaining QUIPLASH GAMES');
    })

    // On disconnect, delete them from the lists
    socket.on('disconnect', () => {
      socket.leave(socket.data.eventId);
      delete SOCKET_LIST[socket.id];
      delete PLAYER_LIST[socket.id];
    });

    socket.on('readyForQuiplash', async (data) => {
      console.log(data)
      let mod = Math.floor(Math.random() * 100);
      let prompt = `Generate a single quiplash prompt related to ${modifiers[mod]}`;
      if (mod >= 61) {
        prompt = `Generate a quiplash prompt`;
      } else if (mod >= 30) {
        prompt = `Generate a single risky quiplash prompt that might get you in trouble with ${modifiers[Math.floor(mod / 2)]}`;
      }

      const result = await bartenderAI.generateContent(prompt);
      console.log(result)
      socket.emit('askNextQuiplash', result)

    })

    // Controls movement. Update their respective state via socket.id
    socket.on('keyPress', ({ inputId, state }) => {
      if (inputId === 'Up') {
        PLAYER_LIST[socket.id].pressingUp = state;
      }
      if (inputId === 'Left') {
        PLAYER_LIST[socket.id].pressingLeft = state;
      }
      if (inputId === 'Right') {
        PLAYER_LIST[socket.id].pressingRight = state;
      }
      if (inputId === 'Down') {
        PLAYER_LIST[socket.id].pressingDown = state;
      }
    });

    socket.on('message', ({ message, eventId }) => {
      console.log(eventId, 'message id')
      console.log(message, 'the message')
      PLAYER_LIST[socket.id].sentMessage = true;
      PLAYER_LIST[socket.id].currentMessage = message;
      socket.to(eventId).emit('message', message);
      // Remove message after a few seconds
      setTimeout(() => {
        PLAYER_LIST[socket.id].sentMessage = false;
      }, 2000);
    });


  });

  setInterval(() => {
    let pack = []; // package to store players
    for (let key in PLAYER_LIST) {
      let player = PLAYER_LIST[key];
      player.updatePosition();
      pack.push({
        id: player.name,
        x: player.data.x,
        y: player.data.y,
        username: player.username,
        sentMessage: player.sentMessage,
        currentMessage: player.currentMessage,
        room: player.eventId,
      });
    }
    // loop through the sockets and send the package to each of them
    for (let key in SOCKET_LIST) {
      let socket = SOCKET_LIST[key];
      socket.emit('newPositions', pack);
    }
  }, 1000 / 25);
};

export default initializeSocket;
