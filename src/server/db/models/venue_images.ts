import Sequelize from 'sequelize';
import database from '../index';
import Event from './events';
import Event_Venue_Image from './event_venue_images';

const Venue_Image = database.define('Venue_Image', {
    path: { type: Sequelize.STRING },
    source: { type: Sequelize.STRING },
});


Venue_Image.belongsToMany(Event, { through: Event_Venue_Image });

export default Venue_Image;