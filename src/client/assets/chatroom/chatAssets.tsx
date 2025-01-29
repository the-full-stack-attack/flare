// Creates a player object with their own state... (replace with keyword 'this'?)
const Player = function (id: any, user: any, eventId: any): any {
  const self = {
    username: user.username,
    name: id,
    data: {
      // positions
      x: 25,
      y: 25,
    },
    number: Math.floor(10 * Math.random()),
    pressingRight: false, // states of movement
    pressingLeft: false,
    pressingUp: false,
    pressingDown: false,
    maxSpd: 10,
    sentMessage: false,
    currentMessage: '',
    eventId,
    playingQuiplash: false,
    updatePosition() {
      // method for updating state of movement
      if (self.pressingRight) {
        self.data.x += self.maxSpd;
      }
      if (self.pressingLeft) {
        self.data.x -= self.maxSpd;
      }
      if (self.pressingUp) {
        self.data.y -= self.maxSpd;
      }
      if (self.pressingDown) {
        self.data.y += self.maxSpd;
      }
    },
  };
  return self;
};

export default Player 