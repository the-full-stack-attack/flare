import Sequelize from 'sequelize';
import database from '../index';
import Venue_Tag from "./venue_tags";


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
    total_reviews: { type: Sequelize.INTEGER },
    accepted_payments: { type: Sequelize.STRING },
    price_range: { type: Sequelize.STRING },
    fsq_id: { type: Sequelize.STRING },
    google_place_id: { type: Sequelize.STRING },
    outdoor_seating: { type: Sequelize.BOOLEAN },
    peak_hour: { type: Sequelize.DATE },
    wheelchair_accessible: { type: Sequelize.BOOLEAN },
    restroom: { type: Sequelize.BOOLEAN },
    private_parking: { type: Sequelize.BOOLEAN },
    street_parking: { type: Sequelize.BOOLEAN },
    serves_alcohol: { type: Sequelize.BOOLEAN },
    cleanliness: { type: Sequelize.STRING },
    crowded: { type: Sequelize.STRING },
    noise_level: { type: Sequelize.STRING },
    service_quality: { type: Sequelize.STRING },
});


Venue.hasMany(Venue_Tag, { foreignKey: 'venue_id' });
Venue_Tag.belongsTo(Venue, { foreignKey: 'venue_id' });


export default Venue;