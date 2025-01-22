import Sequelize from 'sequelize';
import database from '../index';

const Notification = database.define('Notification', {
    message: { type: Sequelize.STRING, },
    send_time: { type: Sequelize.DATE, },
});

export default Notification;