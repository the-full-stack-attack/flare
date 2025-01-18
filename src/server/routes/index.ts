const { aiRouter } = require('./ai');
const { aiConversationRouter } = require('./aiConversation');
const { aiTaskRouter } = require('./aiTask');
const { avatarRouter } = require('./avatar');
const { chatRouter } = require('./chat');
const { chatroomRouter } = require('./chatroom');
const { flareRouter } = require('./flare');
const { eventRouter } = require('./event');
const { userRouter } = require('./user');
const { taskRouter } = require('./task');
const { event2Router } = require('./event2');

module.exports = {
  aiRouter,
  aiConversationRouter,
  aiTaskRouter,
  avatarRouter,
  chatRouter,
  chatroomRouter,
  flareRouter,
  eventRouter,
  userRouter,
  taskRouter,
  event2Router,
}


