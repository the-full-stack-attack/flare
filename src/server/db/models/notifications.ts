import Sequelize from 'sequelize';
import database from '../index';

const Notification = database.define('Notification', {
  title: { type: Sequelize.STRING },
  message: { type: Sequelize.TEXT },
  send_time: { type: Sequelize.DATE },
});

export default Notification;
