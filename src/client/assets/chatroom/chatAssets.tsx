// Creates a player object with their own state... (replace with keyword 'this'?)
const Player = function (id: any, user: any, eventId: any): any {
  const self = {
    username: user.username,
    avatar: user.avatar_uri,
    name: id,
    eventId,
    data: {
      // positions
      x: 25,
      y: 25,
    },
    pressingRight: false, // states of movement
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
    isWalking: false,
    isSnapping: false,
    isWaving: false,
    isEnergyWaving: false,
    maxSpd: 3,
    updatePosition() {
      // method for updating state of movement
      if (self.pressingRight) {
        if( !(( self.data.x + self.maxSpd) > 620)) {
        self.data.x += self.maxSpd;
        };
      }
      if (self.pressingLeft) {
        if( !(( self.data.x - self.maxSpd) < 0)) {
        self.data.x -= self.maxSpd;
        };
      }
      if (self.pressingUp) {
        if( !((self.data.y - self.maxSpd) < 0)) {
          self.data.y -= self.maxSpd
        };
      }
      if (self.pressingDown) {
        if( !((self.data.y + self.maxSpd) > 340)) {
        self.data.y += self.maxSpd;
        };
      }
    },
  };
  return self;
};

const QuipLashPlayer = function ( id: any, user: any, eventId: any ): any {
  const quip = {
    username: user.username,
    name: id,
    playingQuiplash: false,
    quipResponse: '',
    sentResponse: false,
    eventId,
    updatePlayingQuiplash() {
      quip.playingQuiplash = !quip.playingQuiplash;
    },
  };
  return quip;
}

export { Player, QuipLashPlayer };