import Sequelize from 'sequelize';
import database from '../index';

const Venue_Image = database.define('Venue_Image', {
    path: { type: Sequelize.STRING },
    source: { type: Sequelize.STRING },
});

export default Venue_Image;