import Sequelize from 'sequelize';
import database from '../index';
import Event from './events';
import Category from './categories';

const Event_Category = database.define('Event_Category', {});

// Declare the foreign key for the user id and the task id
Event.belongsToMany(Category, { through: Event_Category });
Category.belongsToMany(Event, { through: Event_Category });
export default Event_Category;
