import Sequelize from 'sequelize';
import database from '../index';

const Event_Venue_Image = database.define('Event_Venue_Image', {
    display_order: { type: Sequelize.INTEGER },
});

export default Event_Venue_Image;

