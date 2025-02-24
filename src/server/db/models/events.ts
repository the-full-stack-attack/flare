import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Venue from './venues';
import Category from './categories';
import Interest from './interests';
import Event_Interest from './events_interests';
import Chatroom from './chatrooms';
import Notification from './notifications';
import Venue_Image from './venue_images';
import Event_Venue_Image from './event_venue_images';

const Event = database.define('Event', {
  title: { type: Sequelize.STRING(60) },
  start_time: { type: Sequelize.DATE },
  end_time: { type: Sequelize.DATE },
  address: { type: Sequelize.STRING },
  city: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  venue_id: { type: Sequelize.INTEGER },
  category_id: { type: Sequelize.INTEGER },
  created_by: { type: Sequelize.INTEGER },
  hour_before_notif: { type: Sequelize.INTEGER },
});

Event.belongsTo(User, { foreignKey: 'created_by', onDelete: 'CASCADE' });
Event.belongsTo(Venue, { foreignKey: 'venue_id' });
Event.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Event, { foreignKey: 'category_id' });
Event.hasOne(Chatroom, { foreignKey: 'event_id' });
Chatroom.belongsTo(Event, { foreignKey: 'event_id', onDelete: 'CASCADE' });
Event.belongsTo(Notification, { foreignKey: 'hour_before_notif' });
Event.belongsToMany(Venue_Image, { through: Event_Venue_Image });


export default Event;
