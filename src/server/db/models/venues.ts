import Sequelize from 'sequelize';
import database from '../index';
import Venue_Attributes from "./venue_attributes";
import Venue_Amenities from "./venue_amenities";
import Venue_Hours from "./venue_hours";
import Venue_Tags from "./venue_tags";


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
});

Venue.hasOne(Venue_Amenities, { foreignKey: 'venue_id' });
Venue.hasOne(Venue_Attributes, { foreignKey: 'venue_id' });
Venue.hasMany(Venue_Hours, { foreignKey: 'venue_id' });
Venue.hasMany(Venue_Tags, { foreignKey: 'venue_id' });

export default Venue;