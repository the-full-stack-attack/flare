import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Player, QuipLashPlayer } from '../client/assets/chatroom/chatAssets';

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
];

const initializeSocket = (
  server: any,
  PLAYER_LIST: any,
  SOCKET_LIST: any,
  QUIPLASH_LIST: any,
  QUIPLASH_GAMES: any,
) => {
  const io = new Server(server);


  io.on('connection', (socket) => {
    // Creates A Player for chatroom
    socket.on('joinChat', ({ user, eventId }) => {
      socket.data.name = socket.id;
      socket.data.eventId = eventId;
      socket.join(eventId);
      const player = Player(socket.id, user, eventId);
      const stringName = socket.data.name;
      SOCKET_LIST[stringName] = socket;
      PLAYER_LIST[socket.id] = player;
    });

    // Removes player everywhere on disconnect
    socket.on('disconnect', () => {
      socket.leave(socket.data.eventId);
      delete SOCKET_LIST[socket.id];
      delete PLAYER_LIST[socket.id];
    });
    // QUIPLASH SOCKETS

    // QUITTING
    socket.on('quitQuiplash', () => {
      socket.leave(`Quiplash room: ${socket.data.eventId}`);
      delete QUIPLASH_LIST[socket.id];
      QUIPLASH_GAMES[socket.data.eventId].playerCount -= 1;
      if (QUIPLASH_GAMES[socket.data.eventId].playerCount <= 0) {
        delete QUIPLASH_GAMES[socket.data.eventId];
      };
    });

    // JOINING
    socket.on('joinQuiplash', ({ user, eventId }) => {
      socket.data.eventId = eventId;
      socket.join(`Quiplash room: ${eventId}`);
      const quiplashPlayer = QuipLashPlayer(socket.id, user, eventId);
      QUIPLASH_LIST[socket.id] = quiplashPlayer;

      // Creates a game if one doesn't already exist
      if (QUIPLASH_GAMES[eventId] === undefined) {
        QUIPLASH_GAMES[eventId] = {
          players: {}, // key = username // value = player
          votes: [], // array of usernames that was voted for
          playerCount: 0,
          answers: {},
          promptGiven: false,
          startTimer() { 
            // After 30 seconds, Show answers & begin next timer
            setTimeout(() => {
              QUIPLASH_GAMES[eventId].promptGiven = false;
              socket.nsp
                .to(`Quiplash room: ${socket.data.eventId}`)
                .emit(`promptGiven`, QUIPLASH_GAMES[eventId].promptGiven);
              socket.nsp
                .to(`Quiplash room: ${socket.data.eventId}`)
                .emit(`showAnswers`, QUIPLASH_GAMES[eventId].answers);
                
              let intervalId: NodeJS.Timeout;
              
              let timer = 30;
              let startInterval = () => {
                  intervalId = setInterval(() => {
                    console.log("Interval running...");
                    timer -= 1;
                      socket.nsp
                      .to(`Quiplash room: ${socket.data.eventId}`)
                      .emit(`countDown`, timer)
                    
                  }, 1000); // Run every 1 second
                }
                
                
              startInterval();
                
                // Stop the interval after 5 seconds
                setTimeout(() => {
                  clearInterval(intervalId);
                  console.log("Interval stopped.");
                }, 5000);

              setTimeout(() => {
                let totalVotes: { [key: string]: any } = {};
                let winner = ['', 0];
                for (let i = 0; i < QUIPLASH_GAMES[eventId].votes.length; i++) {
                  // if the current name that was voted for is not in the object
                  if (
                    totalVotes[QUIPLASH_GAMES[eventId].votes[i]] === undefined
                  ) {
                    // add them to the object , set their vote to 1
                    totalVotes[QUIPLASH_GAMES[eventId].votes[i]] = 1;
                  } else {
                    // if they are already in the object, add 1 to that persons name
                    totalVotes[QUIPLASH_GAMES[eventId].votes[i]] += 1;
                  }
                }
                // At the end of the loop, check who has the highest vote.
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
                QUIPLASH_GAMES[eventId].votes.length = 0; // reset votes
                // clear answers
                for (const prop of Object.getOwnPropertyNames(
                  QUIPLASH_GAMES[eventId].answers
                )) {
                  delete QUIPLASH_GAMES[eventId].answers[prop];
                }
                // allow a new prompt
                QUIPLASH_GAMES[eventId].promptGiven = false;
                socket.nsp
                  .to(`Quiplash room: ${socket.data.eventId}`)
                  .emit(`showWinner`, { winner, falsyBool, truthyBool });
              }, 15000);
            }, 20000);
          },
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
      socket.nsp
        .to(`Quiplash room: ${socket.data.eventId}`)
        .emit('ongoingPrompt', QUIPLASH_GAMES[eventId].promptGiven);
    });

    //  GENERATE A PROMPT

    // triggered when its time to give a new prompt
    socket.on('generatePrompt', async () => {
      // generate quiplash prompt that is unique
      let mod = Math.floor(Math.random() * 70);
      let prompt = `Generate a single quiplash prompt related to ${modifiers[mod]} without using possessive pronouns`;
      if (mod >= 61) {
        prompt = `Generate a quiplash prompt without using possessive pronouns`;
      } else if (mod >= 30) {
        prompt = `Generate a single risky quiplash prompt that might get you in trouble with ${modifiers[Math.floor(mod / 2)]} without using possessive pronouns`;
      }
      // on the client side, they need to deactivate the ability to access this socket for all players in the same chatroom once it is clicked.
      // after 90 seconds, the client can reactivate the button to access this socket for all players in the same room
      try {
        const result = await bartenderAI.generateContent(prompt);
        console.log(result);
        socket.nsp
          .to(`Quiplash room: ${socket.data.eventId}`)
          .emit('receivePrompt', result);
      } catch (err) {
        const boo = {
          response: {
            candidates: [
              {
                content: {
                  parts: [{ text: 'what would you do for a klondike bar?' }],
                },
              },
            ],
          },
        };
        socket.nsp
          .to(`Quiplash room: ${socket.data.eventId}`)
          .emit('receivePrompt', boo);
      }
      QUIPLASH_GAMES[socket.data.eventId].promptGiven = true;
      QUIPLASH_GAMES[socket.data.eventId].startTimer();
      socket.nsp
        .to(`Quiplash room: ${socket.data.eventId}`)
        .emit(`promptGiven`, QUIPLASH_GAMES[socket.data.eventId].promptGiven);
    });

    // Quiplash Answer Submissions

    socket.on('quiplashMessage', ({ message, eventId, user }) => {
      console.log('received a quiplash message');
      QUIPLASH_GAMES[socket.data.eventId].answers[user.username] = message;
    });

    // VOTE
    socket.on('vote', (e) => {
      console.log('vote received for ', e);
      QUIPLASH_GAMES[socket.data.eventId].votes.push(e);
    });

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
      console.log(eventId, 'message id');
      console.log(message, 'the message');
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
