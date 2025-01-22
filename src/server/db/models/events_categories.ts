import Sequelize from 'sequelize';
import database from '../index';
import Event from './events';
import Category from './categories';

const Event_Category = database.define('Event_Category', {
    event_id: { type: Sequelize.INTEGER, },
    category_id: { type: Sequelize.INTEGER, },
});

Event.belongsToMany(Category, { through: Event_Category });
Category.belongsToMany(Event, { through: Event_Category});

export default Event_Category;
