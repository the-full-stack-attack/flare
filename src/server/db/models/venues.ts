import Sequelize from 'sequelize';
import database from '../index';

const Venue = database.define('Venue', {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
});


export default Venue;