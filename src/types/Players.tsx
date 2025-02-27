import { Socket } from 'socket.io';

// Lists of Sockets and Players, key will be socket.id
type Player = {
  username: string;
  avatar: string;
  name: string;
  eventId: string;
  data: {
    // positions
    x: number;
    y: number;
  };
  pressingRight: boolean; // states of movement
  pressingLeft: boolean;
  pressingUp: boolean;
  pressingDown: boolean;
  isWalking: boolean;
  isSnapping: boolean;
  isWaving: boolean;
  isEnergyWaving: boolean;
  isHearting: boolean;
  equipBeer: boolean;
  equipShades: boolean;
  equip420: boolean;
  isSad: boolean;
  maxSpd: number;
}

type SocketList = {
  [key: string]: Socket;
}
type PlayerList = {
  [key: string]: any;
}
type QuiplashList = {
  [key: string]: any;
}
type QuiplashGames = {
  [key: string]: any;
}

export { type SocketList, PlayerList, QuiplashList, QuiplashGames, Player }