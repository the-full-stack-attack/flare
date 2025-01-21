import Sequelize from 'sequelize';
import database from '../index';
import Event from './events';

const Chatroom = database.define('Chatroom', {
    map: { type: Sequelize.STRING, },
    event_id: { type: Sequelize.INTEGER, },
});

Chatroom.belongsTo(Event, { foreignKey: 'event_id' });
Event.hasOne(Chatroom, { foreignKey: 'event_id' });

export default Chatroom;