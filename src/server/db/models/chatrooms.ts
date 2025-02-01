import Sequelize from 'sequelize';
import database from '../index';


const Chatroom = database.define('Chatroom', {
    map: { type: Sequelize.STRING, },
    event_id: { type: Sequelize.INTEGER, },
});


export default Chatroom;