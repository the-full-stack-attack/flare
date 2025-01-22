import Sequelize from 'sequelize';
import database from '../index';
import Event from './events';
import Interest from './interests';

const Event_Interest = database.define('Event_Interest', {
    event_id: { type: Sequelize.INTEGER },
    interest_id: { type: Sequelize.INTEGER },
});

Event.belongsToMany(Interest, { through: Event_Interest });
Interest.belongsToMany(Event, { through: Event_Interest });

export default Event_Interest;