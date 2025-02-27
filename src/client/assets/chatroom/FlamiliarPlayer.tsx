// Define FlamiliarPlayer type interface for better type checking
interface FlamiliarPlayer {
  username: string;
  name: string;
  playingQuiplash: boolean;
  quipResponse: string;
  sentResponse: boolean;
  eventId: string;
}

// Create FlamiliarPlayer class in TypeScript
class FlamiliarPlayer {
  username: string;
  name: string;
  playingQuiplash: boolean;
  quipResponse: string;
  sentResponse: boolean;
  eventId: string;

  constructor(id: string, user: { username: string }, eventId: string) {
    this.username = user.username;
    this.name = id;
    this.playingQuiplash = false;
    this.quipResponse = '';
    this.sentResponse = false;
    this.eventId = eventId;
  }

  updatePlayingQuiplash() {
    this.playingQuiplash = !this.playingQuiplash;
  }
}

export { FlamiliarPlayer };