import Sequelize from 'sequelize';
import database from '../index';
import User from './users';
import Venue from './venues';
import Category from "./categories";
import Interest from "./interests";
import Event_Interest from "./events_interests";


const Event = database.define('Event', {
    title: { type: Sequelize.STRING(60) },
    start_time: { type: Sequelize.STRING },
    end_time: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    venue_id: { type: Sequelize.INTEGER },
    category_id: { type: Sequelize.INTEGER },
    created_by: { type: Sequelize.INTEGER },
    chatroom_id: { type: Sequelize.INTEGER },

});

Event.belongsTo(User, { foreignKey: 'created_by', });
Event.belongsTo(Venue, { foreignKey: 'venue_id', });
Event.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Event, { foreignKey: 'category_id' });
Event.belongsToMany(Interest, { through: Event_Interest });
Interest.belongsToMany(Event, { through: Event_Interest });


export default Event;


