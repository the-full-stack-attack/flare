import { Socket } from 'socket.io';
import { Player } from '@/client/assets/chatroom/chatAssets';
// Lists of Sockets and Players, key will be socket.id
type PlayerData = {
  id: string;
  username: string;
  avatar: string;
    // positions
    x: number;
    y: number;
  isWalking: boolean;
  isSnapping: boolean;
  isWaving: boolean;
  isEnergyWaving: boolean;
  isHearting: boolean;
  equipBeer: boolean;
  equipShades: boolean;
  equip420: boolean;
  isSad: boolean;
  sentMessage: boolean,
  currentMessage: string,
  room: string,
}

type PlayersPack = {
  [key: string]: PlayerData[];
}

type SocketList = {
  [key: string]: Socket;
}
type PlayerList = {
  [key: string]: Player;
}
type QuiplashList = {
  [key: string]: any;
}
type QuiplashGames = {
  [key: string]: any;
}

export { type SocketList, PlayerList, QuiplashList, QuiplashGames, PlayerData, PlayersPack, }