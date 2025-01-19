const { aiRouter } = require('./ai.ts');
const { aiConversationRouter } = require('./aiConversation.ts');
const { aiTaskRouter } = require('./aiTask.ts');
const { avatarRouter } = require('./avatar.ts');
const { chatRouter } = require('./chat.ts');
const { chatroomRouter } = require('./chatroom.ts');
const { flareRouter } = require('./flare.ts');
const { eventRouter } = require('./event.ts');
const { userRouter } = require('./user.ts');
const { taskRouter } = require('./task.ts');
const { event2Router } = require('./event2.ts');

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


