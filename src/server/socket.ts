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

    // On disconnect, delete them from the lists
    socket.on('disconnect', () => {
      socket.leave(socket.data.eventId);
      delete SOCKET_LIST[socket.id];
      delete PLAYER_LIST[socket.id];
    });
    // QUIPLASH SOCKETS
    
    // QUITTING 

    // if a player quits quiplash
    socket.on('quitQuiplash', () => {
      // remove their socket from the room
      socket.leave(`Quiplash room: ${socket.data.eventId}`);
      // delete that player from the list of players by socket
      delete QUIPLASH_LIST[socket.id]
      // decrease the current player count for that game based on their current eventId
      QUIPLASH_GAMES[socket.data.eventId].playerCount -= 1;
      // if there are no more players playing that game, delete the quiplash game from the list of games
      if (QUIPLASH_GAMES[socket.data.eventId].playerCount <= 0) {
        delete QUIPLASH_GAMES[socket.data.eventId]
      }
      console.log(QUIPLASH_LIST, 'list quip');
      console.log(QUIPLASH_GAMES, 'remaining QUIPLASH GAMES');
    })



    // JOINING

    socket.on('joinQuiplash', ({ user, eventId }) => {
      console.log(user, 'quipl');
      console.log(eventId, 'quipl');
      console.log(PLAYER_LIST);
      console.log(socket.id);
      socket.data.eventId = eventId;
      socket.join(`Quiplash room: ${eventId}`);
      const quiplashPlayer = QuipLashPlayer(socket.id, user, eventId);
      QUIPLASH_LIST[socket.id] = quiplashPlayer;
      console.log(QUIPLASH_LIST);

       // if no game currently exists for the current room
       if(QUIPLASH_GAMES[eventId] === undefined){
        console.log(`no games exist for room ${eventId} yet, creating a room`);
        // create a game on the quiplash game object
        QUIPLASH_GAMES[eventId] = {
          players: {}, // each key in this object is the users username, and it points to quiplash player
          votes: [], // array of usernames that was voted for
          playerCount: 0, // count of players, when it is zero; delete the game
          answers: {},
          promptGiven: false, // This dictates if the button is pushable or not
          startTimer() {
            console.log('timer started');
            setTimeout(() => {
              QUIPLASH_GAMES[eventId].promptGiven = false;
              socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit(`promptGiven`, QUIPLASH_GAMES[eventId].promptGiven);
              socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit(`showAnswers`, QUIPLASH_GAMES[eventId].answers);

              setTimeout(() => {
                let totalVotes : { [key: string]: any } = {};
                let winner = [ '' , 0 ];
                for(let i = 0; i < QUIPLASH_GAMES[eventId].votes.length; i++){
                  // if the current name that was voted for is not in the object
                  if(totalVotes[QUIPLASH_GAMES[eventId].votes[i]] === undefined){
                    // add them to the object , set their vote to 1
                    totalVotes[QUIPLASH_GAMES[eventId].votes[i]] = 1;
                  } else {
                    // if they are already in the object, add 1 to that persons name
                    totalVotes[QUIPLASH_GAMES[eventId].votes[i]] += 1;
                  }
                }
                // At the end of the loop, check who has the highest vote.
                // loop through the object
                for (let key in totalVotes) {
                  let currentContestant = [key, totalVotes[key]];
                  // if there is no winner (the first iteration)
                  if (winner[1] < currentContestant[1]) {
                    // set the winner to the first guy
                    winner = currentContestant;
                  }
                }
                let falsyBool = false;
                let truthyBool = true;
                QUIPLASH_GAMES[eventId].votes.length = 0 // reset votes
                // clear answers
                for (const prop of Object.getOwnPropertyNames(QUIPLASH_GAMES[eventId].answers)) {
                  delete QUIPLASH_GAMES[eventId].answers[prop];
                }
                // allow a new prompt
                QUIPLASH_GAMES[eventId].promptGiven = false;
                socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit(`showWinner`, { winner, falsyBool, truthyBool });
              }, 15000);
            }, 20000);
          }
        };
        // if a game already exists, let server know we succeeded test #1
      } else {
        console.log(`a game for room ${eventId} already exists, adding player`);
      }
      // A game should already exist at this point regardless of whether or not it did before
      // add the player to the correct game by eventId, a quiplash player to the players object. their key is their username
      QUIPLASH_GAMES[eventId].players[user.username] = quiplashPlayer;
      // increase the current player count from zero to 1
      QUIPLASH_GAMES[eventId].playerCount += 1;
      console.log(QUIPLASH_LIST, 'quiplash list');
      console.log(QUIPLASH_GAMES, 'ONGOING QUIPLASH GAMES');
      let returnData = QUIPLASH_GAMES[eventId];
      socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit('ongoingPrompt', QUIPLASH_GAMES[eventId].promptGiven);
    });



    //  GENERATE A PROMPT

        // triggered when its time to give a new prompt
    socket.on('generatePrompt', async () => {
    
      // generate quiplash prompt that is unique
      let mod = Math.floor(Math.random() * 100);
      let prompt = `Generate a single quiplash prompt related to ${modifiers[mod]}`;
      if (mod >= 61) {
        prompt = `Generate a quiplash prompt`;
      } else if (mod >= 30) {
        prompt = `Generate a single risky quiplash prompt that might get you in trouble with ${modifiers[Math.floor(mod / 2)]}`;
      }
      // on the client side, they need to deactivate the ability to access this socket for all players in the same chatroom once it is clicked.
      // after 90 seconds, the client can reactivate the button to access this socket for all players in the same room
      try {
        const result = await bartenderAI.generateContent(prompt);
        console.log(result)

        /**
In my understanding for Socket.IO, nsp (namespaces) act as isolated channels for communication. 
When you create a new socket, it's like tuning into a radio station that broadcasts on a specific frequency. 
Without specifying a namespace, you're essentially broadcasting your message on a public channel where anyone can listen in. 
But by using 'nsp', you create a private channel for your sockets to communicate on.

Imagine a large office building with hundreds of employees. 
If everyone talked at once, you'd have a cacophony of noise and no one would get anything done. 
Now, introduce conference rooms with walls—each room is a namespace. 

When you use 'socket.nsp.to('room').emit(data)', you're essentially speaking into the intercom of that specific conference room. 
Only the sockets that have joined that 'room' & namespace will receive the message. 
Take a step further back and look at the documentation on namespaces:

Official documentation states that
io.sockets === io.of("/") <-- this is a default 'namespace' of io. Where the namespace is essentially global. 
So whenever I try to put two and two together; I am thinking that:
socket.nsp === io.of('this socket').
in which case
socket.nsp.emit(data) <-- this part emits only to yourself...?
(i put ...? because I think where this emits is dependent on the original way you initiated io... meaning I
think the 'nsp' is a property that refrences the io initialization)
the latter half
socket.to(room).emit <--- behaves normally by emitting to all in the room except yourself. possibly by removing every socket that is not connected to this room...?

then the final part is just chaining the two
`socket.nsp.to(room).emit(data) <--- emits to yourself, and to everyone else in a certain room

I am not too sure, but I am thinking about writing a dev.to article about this because it seems as if there is no official documentation explaining the .nsp property on the socket from their official site for any version whatsoever
         */
        socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit('receivePrompt', result);
      } catch (err) {
        
        let boo = { response: { candidates: [{ content: { parts: [{ text: 'what would you do for a klondike bar?' }] } }] } }
        socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit('receivePrompt', boo);
      }
      QUIPLASH_GAMES[socket.data.eventId].promptGiven = true;
      QUIPLASH_GAMES[socket.data.eventId].startTimer();
      socket.nsp.to(`Quiplash room: ${socket.data.eventId}`).emit(`promptGiven`, QUIPLASH_GAMES[socket.data.eventId].promptGiven)
    })

    // Quiplash Answer Submissions

    socket.on('quiplashMessage', ({ message, eventId, user }) => {
      console.log('received a quiplash message');
      QUIPLASH_GAMES[socket.data.eventId].answers[user.username] = message;
    })

    // VOTE
    socket.on('vote', (e) => {
      console.log('vote received for ', e)
      QUIPLASH_GAMES[socket.data.eventId].votes.push(e);
    })




    // chatroom



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
