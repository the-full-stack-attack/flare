import Sequelize from 'sequelize';
import database from '../index';

const Venue = database.define('Venue', {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    street_address: { type: Sequelize.STRING },
    zip_code: { type: Sequelize.INTEGER },
    city_name: { type: Sequelize.STRING },
    state_name: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING },
    website: { type: Sequelize.STRING },
    rating: { type: Sequelize.INTEGER },
    accepted_payments: { type: Sequelize.STRING },
    price_level: { type: Sequelize.INTEGER },
    outdoor_seating: { type: Sequelize.BOOLEAN },
    wheelchair_accessible: { type: Sequelize.BOOLEAN },
    classification: { type: Sequelize.STRING },
    cleanliness: { type: Sequelize.STRING },
    private_parking: { type: Sequelize.BOOLEAN },
    street_parking: { type: Sequelize.BOOLEAN },
    restroom: { type: Sequelize.BOOLEAN },
    atm: { type: Sequelize.BOOLEAN },
    crowded: { type: Sequelize.STRING },
    attire: { type: Sequelize.STRING },
    noisy: { type: Sequelize.STRING },
    facebook_id: { type: Sequelize.STRING },
    instagram: { type: Sequelize.STRING },
    tips: { type: Sequelize.STRING },
});


export default Venue;