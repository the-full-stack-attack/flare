import Sequelize from 'sequelize';
import database from '../index';

const Event_Venue_Tag = database.define('Event_Venue_Tag', {
    display_order: { type: Sequelize.INTEGER },
})

export default Event_Venue_Tag;
