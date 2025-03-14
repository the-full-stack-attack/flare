import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Event from './events';

const User_Event = database.define('User_Event', {
  user_attended: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  user_attending: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  private_review: { type: Sequelize.STRING(250) },
  public_review: { type: Sequelize.STRING(250) },
});

User.belongsToMany(Event, { through: User_Event });
Event.belongsToMany(User, { through: User_Event });

User_Event.belongsTo(User, { onDelete: 'CASCADE' });
User_Event.belongsTo(Event, { onDelete: 'CASCADE' });

export default User_Event;
