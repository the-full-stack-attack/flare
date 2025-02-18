import Sequelize from 'sequelize';
import database from '../index';

const Flare = database.define('Flare', {
  name: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING },
  icon: { type: Sequelize.STRING },
  achievement: { type: Sequelize.STRING },
  milestone: { type: Sequelize.INTEGER },
  description: { type: Sequelize.STRING },
  value: { type: Sequelize.INTEGER, defaultValue: 0 },
  notification_message: { type: Sequelize.TEXT },
});

export default Flare;
