import Sequelize from 'sequelize';
import database from '../index';
import Event from './events';
import Category from './categories';

const Event_Category = database.define('Event_Category', {
    event_id: { type: Sequelize.INTEGER, },
    category_id: { type: Sequelize.INTEGER, },
});


export default Event_Category;
