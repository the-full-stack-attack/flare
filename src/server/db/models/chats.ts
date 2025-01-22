import Sequelize from 'sequelize';
import database from '../index';
import Chatroom from './chatrooms';
import User from './users';

const Chat = database.define('Chat', {
    user_id: { type: Sequelize.INTEGER, },
    message: { type: Sequelize.STRING(60), },
    created_at: { type: Sequelize.DATE, },
    chatroom_id: { type: Sequelize.INTEGER, },
});

Chat.belongsTo(User, { foreignKey: 'user_id' });
Chat.belongsTo(Chatroom, { foreignKey: 'chatroom_id' });
User.hasMany(Chat, { foreignKey: 'user_id' });
Chatroom.hasMany(Chat, { foreignKey: 'chatroom_id' });

export default Chat;