import Sequelize from 'sequelize';
import database from '../index';

const Venue = database.define('Venue', {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    street_address: { type: Sequelize.STRING },
    zip_code: { type: Sequelize.INTEGER },
    city_name: { type: Sequelize.STRING },
    state_name: { type: Sequelize.STRING },
});


export default Venue;