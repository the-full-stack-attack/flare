import database from '../index';
import Event from './events';
import Interest from './interests';

const Event_Interest = database.define('Event_Interest', {});

Event.belongsToMany(Interest, { through: Event_Interest });
Interest.belongsToMany(Event, { through: Event_Interest });

Event_Interest.belongsTo(Event, { onDelete: 'CASCADE' });
Event_Interest.belongsTo(Interest);

export default Event_Interest;
