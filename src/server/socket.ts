/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unused-state */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-enable no-console */
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable react/jsx-no-bind */
/* eslint-enable react/no-unused-state */
/* eslint-enable react-hooks/exhaustive-deps */
/* eslint-enable consistent-return */
/* eslint-enable no-restricted-syntax */
/* eslint-enable react-hooks/rules-of-hooks */

import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Player, PlayerInterface } from '../client/assets/chatroom/chatAssets';
import { FlamiliarPlayer } from '../client/assets/chatroom/FlamiliarPlayer';
import SOCKET_URL from '../../config';
import { type SocketList, PlayerList, QuiplashList, QuiplashGames } from '../types/Players';
import { Socket } from 'socket.io-client';

dotenv.config();

const googleGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const bartenderAI = googleGenAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});
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
  PLAYER_LIST: PlayerList,
  SOCKET_LIST: SocketList,
  QUIPLASH_LIST: QuiplashList,
  QUIPLASH_GAMES: QuiplashGames,
  DEVELOPMENT: any,
) => {
  let io;
  if (DEVELOPMENT === 'true') {
    // environment variable based on development is passed in here
    io = new Server(server);
  } else {
    // https://socket.io/docs/v4/handling-cors/ <-- DOCS
    io = new Server(server, {
      cors: {
        origin: SOCKET_URL, // or with an array of origins  // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
        // allowedHeaders: ["my-custom-header"], // IF WE USE COOKIES
        credentials: true, // IF WE USE COOKIES
      },
    });
  }

  io.on('connection', (socket) => {
    // Creates A Player for chatroom
    socket.on('joinChat', ({ user, eventId }) => {
      socket.data.name = socket.id;
      socket.data.eventId = eventId;
      socket.join(eventId);
      const player = new Player(socket.id, user, eventId);
      const stringName = socket.data.name;
      SOCKET_LIST[stringName] = socket;
      PLAYER_LIST[socket.id] = player;
      socket.nsp.to(eventId).emit('newPlayerList', { PLAYER_LIST });
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
      try {
        delete QUIPLASH_LIST[socket.id];
        QUIPLASH_GAMES[socket.data.eventId].playerCount -= 1;
      } catch (error) {
        console.log('cannot find player to delete');
      }
      if (QUIPLASH_GAMES[socket.data.eventId].playerCount <= 0) {
        delete QUIPLASH_GAMES[socket.data.eventId];
      }
    });

    // JOINING
    socket.on('joinQuiplash', ({ user, eventId }) => {
      socket.data.eventId = eventId;
      socket.join(`Quiplash room: ${eventId}`);
      const quiplashPlayer = new FlamiliarPlayer(socket.id, user, eventId);
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
            let initialIntervalId: NodeJS.Timeout;
            let initialTimer = 30;

            const startInitialInterval = () => {
              initialIntervalId = setInterval(() => {
                initialTimer -= 1;
                socket.nsp
                  .to(`Quiplash room: ${socket.data.eventId}`)
                  .emit(`countDown`, initialTimer);
              }, 1000); // Run every 1 second
            };

            startInitialInterval();

            // Stop the interval after 30 seconds
            setTimeout(() => {
              clearInterval(initialIntervalId);
            }, 31000);

            // After 30 seconds, Show answers & begin next timer
            setTimeout(() => {
              if (QUIPLASH_GAMES[eventId] === undefined) {
                return;
              }
              QUIPLASH_GAMES[eventId].promptGiven = false;
              socket.nsp
                .to(`Quiplash room: ${socket.data.eventId}`)
                .emit(`promptGiven`, QUIPLASH_GAMES[eventId].promptGiven);
              socket.nsp
                .to(`Quiplash room: ${socket.data.eventId}`)
                .emit(`showAnswers`, QUIPLASH_GAMES[eventId].answers);

              let intervalId: NodeJS.Timeout;
              let timer = 16;

              const startInterval = () => {
                intervalId = setInterval(() => {
                  timer -= 1;
                  socket.nsp
                    .to(`Quiplash room: ${socket.data.eventId}`)
                    .emit(`countDown`, timer);
                }, 1000); // Run every 1 second
              };

              startInterval();

              // Stop the interval after 15 seconds
              setTimeout(() => {
                clearInterval(intervalId);
              }, 17000);

              setTimeout(() => {
                const totalVotes: { [key: string]: number } = {};
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
                // SET THE WINNER
                for (let key in totalVotes) {
                  let currentContestant = [key, totalVotes[key]];
                  if (winner[1] < currentContestant[1]) {
                    winner = currentContestant;
                  }
                }

                // reset all properties
                const falsyBool = false;
                const truthyBool = true;
                QUIPLASH_GAMES[eventId].votes.length = 0;
                for (const prop of Object.getOwnPropertyNames(
                  QUIPLASH_GAMES[eventId].answers
                )) {
                  delete QUIPLASH_GAMES[eventId].answers[prop];
                }
                QUIPLASH_GAMES[eventId].promptGiven = false;
                const restartTime = 30;
                socket.nsp
                  .to(`Quiplash room: ${socket.data.eventId}`)
                  .emit(`showWinner`, { winner, falsyBool, truthyBool });
                socket.nsp
                  .to(`Quiplash room: ${socket.data.eventId}`)
                  .emit(`countDown`, restartTime);
              }, 17000);
            }, 33000);
          },
        }; // END OF QUIPLASH GAME OBJECT
      } // END OF IF STATEMENT

      // if a game already exists, add the player to it
      QUIPLASH_GAMES[eventId].players[user.username] = quiplashPlayer;
      QUIPLASH_GAMES[eventId].playerCount += 1;
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
      QUIPLASH_GAMES[socket.data.eventId].answers[user.username] = message;
    });

    // VOTE
    socket.on('vote', (e) => {
      QUIPLASH_GAMES[socket.data.eventId].votes.push(e);
    });

    // Chatroom

    // Controls movement. Update their respective state via socket.id
    socket.on('keyPress', ({ inputId, state }) => {
      if (inputId === 'Up') {
        PLAYER_LIST[socket.id].pressingUp = state;
        PLAYER_LIST[socket.id].isWalking = state;
      }
      if (inputId === 'Left') {
        PLAYER_LIST[socket.id].pressingLeft = state;
        PLAYER_LIST[socket.id].isWalking = state;
      }
      if (inputId === 'Right') {
        PLAYER_LIST[socket.id].pressingRight = state;
        PLAYER_LIST[socket.id].isWalking = state;
      }
      if (inputId === 'Down') {
        PLAYER_LIST[socket.id].pressingDown = state;
        PLAYER_LIST[socket.id].isWalking = state;
      }
      if (inputId === 'Snap') {
        PLAYER_LIST[socket.id].isSnapping = state;
      }
      if (inputId === 'Wave') {
        PLAYER_LIST[socket.id].isWaving = state;
      }
      if (inputId === 'EnergyWave') {
        PLAYER_LIST[socket.id].isEnergyWaving = state;
      }
      if (inputId === 'Heart') {
        PLAYER_LIST[socket.id].isHearting = state;
      }
      if (inputId === 'Shades') {
        PLAYER_LIST[socket.id].equipShades =
          !PLAYER_LIST[socket.id].equipShades;
      }
      if (inputId === '420') {
        PLAYER_LIST[socket.id].equip420 = !PLAYER_LIST[socket.id].equip420;
      }
      if (inputId === 'Beer') {
        PLAYER_LIST[socket.id].equipBeer = !PLAYER_LIST[socket.id].equipBeer;
      }
      if (inputId === 'Sad') {
        PLAYER_LIST[socket.id].isSad = state;
      }
    });

    socket.on('message', ({ message, eventId }) => {
      PLAYER_LIST[socket.id].sentMessage = true;
      PLAYER_LIST[socket.id].currentMessage = message;

      socket
        .to(eventId)
        .emit('message', {
          message: message,
          username: PLAYER_LIST[socket.id].username,
          avatar: PLAYER_LIST[socket.id].avatar,
        });
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
        avatar: player.avatar,
        x: player.data.x,
        y: player.data.y,
        username: player.username,
        sentMessage: player.sentMessage,
        currentMessage: player.currentMessage,
        room: player.eventId,
        isWalking: player.isWalking,
        isSnapping: player.isSnapping,
        isWaving: player.isWaving,
        isEnergyWaving: player.isEnergyWaving,
        isHearting: player.isHearting,
        equip420: player.equip420,
        equipShades: player.equipShades,
        equipBeer: player.equipBeer,
        isSad: player.isSad,
      });
    }
    // loop through the sockets and send the package to each of them
    for (let key in SOCKET_LIST) {
      let socket = SOCKET_LIST[key];
      socket.emit('newPositions', pack);
    }
  }, 1000 / 20);
};

export default initializeSocket;
