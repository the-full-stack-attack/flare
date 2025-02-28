import { f } from "react-router/dist/development/fog-of-war-Cm1iXIp7";

// Define Player type interface for better type checking
interface PlayerInterface {
  username: string;
  avatar: string;
  name: string;
  eventId: string;
  data: {
    x: number;
    y: number;
  };
  pressingRight: boolean;
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
  sentMessage: boolean;
  currentMessage: string;
}

// Create Player class in TypeScript
class Player {
  username: string;

  avatar: string;

  name: string;

  eventId: string;

  data: {
    x: number;
    y: number;
  };

  pressingRight: boolean;

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

  sentMessage: boolean;

  currentMessage: string;

  constructor(id: string, user: { username: string, avatar_uri: string }, eventId: string) {
    this.username = user.username;
    this.avatar = user.avatar_uri;
    this.name = id;
    this.eventId = eventId;
    this.data = { x: 25, y: 25 };
    this.pressingRight = false;
    this.pressingLeft = false;
    this.pressingUp = false;
    this.pressingDown = false;
    this.isWalking = false;
    this.isSnapping = false;
    this.isWaving = false;
    this.isEnergyWaving = false;
    this.isHearting = false;
    this.equipBeer = false;
    this.equipShades = false;
    this.equip420 = false;
    this.isSad = false;
    this.maxSpd = 5;
    this.sentMessage = false;
    this.currentMessage = '';
  }

  updatePosition() {
    if (this.pressingRight) {
      if (!(this.data.x + this.maxSpd > 620)) {
        this.data.x += this.maxSpd;
      }
    }
    if (this.pressingLeft) {
      if (!(this.data.x - this.maxSpd < 0)) {
        this.data.x -= this.maxSpd;
      }
    }
    if (this.pressingUp) {
      if (!(this.data.y - this.maxSpd < 0)) {
        this.data.y -= this.maxSpd;
      }
    }
    if (this.pressingDown) {
      if (!(this.data.y + this.maxSpd > 340)) {
        this.data.y += this.maxSpd;
      }
    }
  }
}

export { Player, PlayerInterface };
