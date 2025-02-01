import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Event from './events';

const Text = database.define('Text', {
  content: { type: Sequelize.STRING },
  time_from_start: { type: Sequelize.STRING },
  user_id: { type: Sequelize.INTEGER },
  send_time: { type: Sequelize.DATE },
  event_id: { type: Sequelize.INTEGER },
});

Text.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Text, { foreignKey: 'user_id' });
Text.belongsTo(Event, { foreignKey: 'event_id' });

export default Text;
